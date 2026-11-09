import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, clearStudentProgress, fetchProgress, putMeta, putModule } from './accountApi';
import { ProgressContext, emptyModuleProgress, emptyProgressState, type ModuleProgress, type ProgressState, type ProgressValue } from './progress-context';
import {
  countGuestWork,
  findCard,
  isProgressState,
  makeCard,
  mergeGuestProgress,
  opAddCard,
  opRemoveCard,
  opReset,
  opRestoreCard,
  opSaveExerciseResult,
  opSaveTestResult,
  opSetCardStatus,
  opTouchDeck,
  opTouchModule,
  opUpdateCard,
  opUpdateModule,
} from './progressOps';
import { readGuestProgress, removeGuestProgress } from './guest/guestStorage';
import { allModules } from './data/modulesData';
import { useSettings } from './useSettings';
import { useUser } from './useUser';

/** The browser-only store from before accounts. Read once, for the learner it belongs to. */
const LEGACY_KEY = 'matura.progress.v3';
const SAVE_DELAY_MS = 1500;
const FIRST_RETRY_MS = 5000;
const MAX_RETRY_MS = 60_000;

/** Key of the last module / last deck pointers among the per-module fingerprints. */
const META = '';
const EMPTY = '{}';

interface Cache {
  state: ProgressState;
  /** Modules changed here and not yet accepted by the server. */
  dirty: string[];
}

const cacheKey = (userId: string) => `matura.progress.cache.${userId}`;

const readCache = (userId: string): Cache | undefined => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cacheKey(userId)) ?? 'null') as Cache | null;
    return parsed && isProgressState(parsed.state) ? { state: parsed.state, dirty: parsed.dirty ?? [] } : undefined;
  } catch {
    return undefined;
  }
};

const moduleData = (s: ProgressState, id: string) => ({ module: s.modules[id], cards: s.cards?.[id] });
const metaOf = (s: ProgressState) => ({ lastModuleId: s.lastModuleId, lastDeckId: s.lastDeckId, updatedAt: s.updatedAt });

/** One string per module, to see what changed without tracking every write. */
const fingerprint = (s: ProgressState): Record<string, string> => {
  const prints: Record<string, string> = { [META]: JSON.stringify(metaOf(s)) };
  for (const id of new Set([...Object.keys(s.modules), ...Object.keys(s.cards ?? {})])) prints[id] = JSON.stringify(moduleData(s, id));
  return prints;
};

const changedIds = (current: Record<string, string>, synced: Record<string, string>): string[] =>
  [...new Set([...Object.keys(current), ...Object.keys(synced)])].filter((id) => (current[id] ?? EMPTY) !== (synced[id] ?? EMPTY));

/** What the server has, with this browser's unsent modules on top. */
const mergeUnsent = (server: ProgressState, local: ProgressState, dirty: string[]): ProgressState => {
  const merged: ProgressState = { ...server, modules: { ...server.modules }, cards: { ...server.cards } };
  for (const id of dirty) {
    if (id === META) {
      Object.assign(merged, metaOf(local));
      continue;
    }
    const data = moduleData(local, id);
    if (data.module) merged.modules[id] = data.module;
    else delete merged.modules[id];
    if (data.cards) merged.cards![id] = data.cards;
    else delete merged.cards![id];
  }
  return merged;
};

const readLegacy = (userId: string): ProgressState | undefined => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEGACY_KEY) ?? 'null') as { users?: Record<string, unknown> } | null;
    const state = parsed?.users?.[userId];
    return isProgressState(state) ? state : undefined;
  } catch {
    return undefined;
  }
};

/** Removes only this user's part: a shared browser may hold someone else's work too. */
const dropLegacy = (userId: string) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEGACY_KEY) ?? 'null') as { users?: Record<string, unknown> } | null;
    if (!parsed?.users) return;
    delete parsed.users[userId];
    if (Object.keys(parsed.users).length === 0) window.localStorage.removeItem(LEGACY_KEY);
    else window.localStorage.setItem(LEGACY_KEY, JSON.stringify(parsed));
  } catch {
    /* storage unavailable: nothing to remove */
  }
};

/** Names the topics a guest worked in, for the transfer question. */
const guestTopics = (guest: ProgressState): string => {
  const ids = new Set([...Object.keys(guest.modules), ...Object.keys(guest.cards ?? {})]);
  return allModules
    .filter((m) => ids.has(m.id))
    .map((m) => `„${m.titlePl}”`)
    .join(', ');
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, students, refreshClass, markSignedOut } = useUser();
  const { t } = useSettings();
  const userId = user.id;
  // The teacher's own practice stays in this browser; only learners' work goes to the server.
  const syncing = user.role === 'student';
  const [state, setState] = useState<ProgressState>(() => readCache(userId)?.state ?? emptyProgressState());
  const [saveFailed, setSaveFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);

  const stateRef = useRef(state);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const retryMs = useRef(0);
  const offered = useRef(false);
  const synced = useRef<Record<string, string>>(
    (() => {
      const cached = readCache(userId);
      if (!cached) return {};
      const prints = fingerprint(cached.state);
      for (const id of cached.dirty) delete prints[id];
      return prints;
    })(),
  );

  const writeCache = useCallback(() => {
    try {
      const cache: Cache = { state: stateRef.current, dirty: changedIds(fingerprint(stateRef.current), synced.current) };
      window.localStorage.setItem(cacheKey(userId), JSON.stringify(cache));
    } catch {
      /* storage unavailable: the work is still in this tab and goes to the server */
    }
  }, [userId]);

  const fail = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) markSignedOut();
      else setSaveFailed(true);
    },
    [markSignedOut],
  );

  const pull = useCallback(async () => {
    try {
      const server = await fetchProgress();
      const local = stateRef.current;
      const dirty = changedIds(fingerprint(local), synced.current);
      synced.current = fingerprint(server);
      const merged = mergeUnsent(server, local, dirty);
      if (JSON.stringify(fingerprint(merged)) !== JSON.stringify(fingerprint(local))) setState(merged);
      setReady(true);

      const serverEmpty = Object.keys(synced.current).length === 1 && synced.current[META] === EMPTY;
      const legacy = offered.current ? undefined : readLegacy(userId);
      // What a guest did on the public site before signing up (Spec - Landing §8.3): offered once, then the key goes.
      const guest = offered.current ? undefined : readGuestProgress();
      offered.current = true;
      if (legacy) {
        if (serverEmpty && window.confirm(t('progress.importAsk'))) setState(legacy);
        dropLegacy(userId);
      }
      if (guest) {
        const counts = countGuestWork(guest);
        if ((counts.exercises > 0 || counts.cards > 0) && window.confirm(t('progress.importGuestAsk', { topics: guestTopics(guest), n: counts.exercises, m: counts.cards }))) {
          setState((prev) => mergeGuestProgress(prev, guest));
        }
        removeGuestProgress();
      }
    } catch (e) {
      fail(e);
    }
  }, [fail, t, userId]);

  /** Sends every changed module; true when all of them were accepted. */
  const push = useCallback((): Promise<boolean> => {
    const run = queue.current.then(async () => {
      const current = stateRef.current;
      const prints = fingerprint(current);
      try {
        for (const id of changedIds(prints, synced.current)) {
          await (id === META ? putMeta(metaOf(current)) : putModule(id, moduleData(current, id)));
          synced.current = { ...synced.current, [id]: prints[id] ?? EMPTY };
        }
        retryMs.current = 0;
        setSaveFailed(false);
        writeCache();
        return true;
      } catch (e) {
        fail(e);
        retryMs.current = Math.min(MAX_RETRY_MS, retryMs.current * 2 || FIRST_RETRY_MS);
        window.setTimeout(() => setRetry((n) => n + 1), retryMs.current);
        return false;
      }
    });
    queue.current = run;
    return run;
  }, [fail, writeCache]);

  // Callers waiting for an explicit save. Served from the effect below, after the state they changed has rendered.
  const waiting = useRef<((ok: boolean) => void)[]>([]);
  const [flushTick, setFlushTick] = useState(0);

  const flush = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        if (!syncing) {
          resolve(true);
          return;
        }
        waiting.current.push(resolve);
        setFlushTick((n) => n + 1);
      }),
    [syncing],
  );

  useEffect(() => {
    stateRef.current = state;
    writeCache();
    if (!syncing) return;
    if (waiting.current.length > 0) {
      const waiters = waiting.current;
      waiting.current = [];
      void push().then((ok) => waiters.forEach((w) => w(ok)));
      return;
    }
    if (!ready || changedIds(fingerprint(state), synced.current).length === 0) return;
    const id = window.setTimeout(() => void push(), SAVE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [state, ready, retry, flushTick, syncing, push, writeCache]);

  // Another device may have saved while this tab slept; a lost connection may be back.
  useEffect(() => {
    if (!syncing) return;
    void pull();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void pull();
    };
    const onOnline = () => void pull();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
    };
  }, [syncing, pull]);

  // Another tab saved: take its data, otherwise this tab's next write would overwrite that work.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== cacheKey(userId)) return;
      const cached = readCache(userId);
      if (cached) setState(cached.state);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [userId]);

  const allStates = useMemo(() => {
    const all: Record<string, ProgressState> = { [userId]: state };
    for (const s of students) all[s.id] = s.progress;
    return all;
  }, [userId, state, students]);

  const getModuleFor = useCallback(
    (uid: string, moduleId: string): ModuleProgress => allStates[uid]?.modules[moduleId] ?? emptyModuleProgress(),
    [allStates],
  );

  const getModule = useCallback((moduleId: string) => getModuleFor(userId, moduleId), [getModuleFor, userId]);

  const updateUser = useCallback((fn: (s: ProgressState) => ProgressState) => setState(fn), []);

  const updateModule = useCallback<ProgressValue['updateModule']>((moduleId, fn) => updateUser((s) => opUpdateModule(s, moduleId, fn)), [updateUser]);
  const setCardStatus = useCallback<ProgressValue['setCardStatus']>((moduleId, cardId, status) => updateUser((s) => opSetCardStatus(s, moduleId, cardId, status)), [updateUser]);
  const saveTestResult = useCallback<ProgressValue['saveTestResult']>((moduleId, score) => updateUser((s) => opSaveTestResult(s, moduleId, score)), [updateUser]);
  const saveExerciseResult = useCallback<ProgressValue['saveExerciseResult']>(
    (moduleId, exerciseId, score) => updateUser((s) => opSaveExerciseResult(s, moduleId, exerciseId, score)),
    [updateUser],
  );
  const touchModule = useCallback<ProgressValue['touchModule']>((moduleId) => updateUser((s) => opTouchModule(s, moduleId)), [updateUser]);
  const touchDeck = useCallback<ProgressValue['touchDeck']>((moduleId) => updateUser((s) => opTouchDeck(s, moduleId)), [updateUser]);

  const addCard = useCallback<ProgressValue['addCard']>(
    (moduleId, draft) => {
      const card = makeCard(moduleId, draft);
      updateUser((s) => opAddCard(s, moduleId, card));
      return card;
    },
    [updateUser],
  );

  const updateCard = useCallback<ProgressValue['updateCard']>((moduleId, cardId, patch) => updateUser((s) => opUpdateCard(s, moduleId, cardId, patch)), [updateUser]);

  const removeCard = useCallback<ProgressValue['removeCard']>(
    (moduleId, cardId) => {
      const removed = findCard(state, moduleId, cardId);
      if (removed) updateUser((s) => opRemoveCard(s, moduleId, cardId));
      return removed;
    },
    [state, updateUser],
  );

  const restoreCard = useCallback<ProgressValue['restoreCard']>((moduleId, card, status) => updateUser((s) => opRestoreCard(s, moduleId, card, status)), [updateUser]);

  const moveCard = useCallback<ProgressValue['moveCard']>(
    (fromModuleId, toModuleId, cardId, patch) => {
      const removed = removeCard(fromModuleId, cardId);
      if (removed) restoreCard(toModuleId, { ...removed.card, ...patch, updatedAt: new Date().toISOString() }, removed.status);
    },
    [removeCard, restoreCard],
  );

  /** Clears statuses and results; the learner's own cards are their writing, so they stay. */
  const resetUser = useCallback(
    (uid: string) => {
      if (uid === userId) setState(opReset);
      else clearStudentProgress(uid).then(refreshClass).catch(() => setSaveFailed(true));
    },
    [userId, refreshClass],
  );

  const value = useMemo<ProgressValue>(
    () => ({ userId, state, allStates, getModule, getModuleFor, updateModule, setCardStatus, saveTestResult, saveExerciseResult, touchModule, touchDeck, addCard, updateCard, removeCard, restoreCard, moveCard, resetUser, flush, saveFailed }),
    [userId, state, allStates, getModule, getModuleFor, updateModule, setCardStatus, saveTestResult, saveExerciseResult, touchModule, touchDeck, addCard, updateCard, removeCard, restoreCard, moveCard, resetUser, flush, saveFailed],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
