import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiError, clearStudentProgress, fetchProgress, putMeta, putModule } from './accountApi';
import {
  ProgressContext,
  emptyModuleProgress,
  emptyProgressState,
  type CardStatus,
  type ModuleProgress,
  type ProgressState,
  type ProgressValue,
} from './progress-context';
import { useSettings } from './useSettings';
import { useUser } from './useUser';
import type { UserFlashcard } from './types';

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

const isProgressState = (v: unknown): v is ProgressState =>
  !!v && typeof v === 'object' && (v as ProgressState).version === 1 && typeof (v as ProgressState).modules === 'object';

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

const newCardId = (moduleId: string) => `u-${moduleId}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 4)}`;

const withStatus = (m: ModuleProgress, cardId: string, status: CardStatus): ModuleProgress => {
  const mastered = m.mastered.filter((id) => id !== cardId);
  const review = m.review.filter((id) => id !== cardId);
  if (status === 'mastered') mastered.push(cardId);
  if (status === 'review') review.push(cardId);
  return { ...m, mastered, review };
};

const statusIn = (m: ModuleProgress | undefined, cardId: string): CardStatus =>
  m?.mastered.includes(cardId) ? 'mastered' : m?.review.includes(cardId) ? 'review' : 'none';

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
      offered.current = true;
      if (legacy) {
        if (serverEmpty && window.confirm(t('progress.importAsk'))) setState(legacy);
        dropLegacy(userId);
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

  const updateModule = useCallback(
    (moduleId: string, fn: (m: ModuleProgress) => ModuleProgress) => {
      updateUser((s) => ({
        ...s,
        updatedAt: new Date().toISOString(),
        modules: { ...s.modules, [moduleId]: fn(s.modules[moduleId] ?? emptyModuleProgress()) },
      }));
    },
    [updateUser],
  );

  const setCardStatus = useCallback(
    (moduleId: string, cardId: string, status: CardStatus) => {
      updateModule(moduleId, (m) => withStatus(m, cardId, status));
    },
    [updateModule],
  );

  const saveTestResult = useCallback(
    (moduleId: string, scorePercent: number) => {
      const score = Math.max(0, Math.min(100, Math.round(scorePercent)));
      updateModule(moduleId, (m) => ({
        ...m,
        test: {
          best: Math.max(m.test?.best ?? 0, score),
          last: score,
          attempts: (m.test?.attempts ?? 0) + 1,
          lastAt: new Date().toISOString(),
        },
      }));
    },
    [updateModule],
  );

  const saveExerciseResult = useCallback(
    (moduleId: string, exerciseId: string, scorePercent: number) => {
      const score = Math.max(0, Math.min(100, Math.round(scorePercent)));
      updateModule(moduleId, (m) => {
        const previous = m.exercises?.[exerciseId];
        return {
          ...m,
          exercises: {
            ...m.exercises,
            [exerciseId]: {
              best: Math.max(previous?.best ?? 0, score),
              last: score,
              attempts: (previous?.attempts ?? 0) + 1,
              lastAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [updateModule],
  );

  const touchModule = useCallback(
    (moduleId: string) => {
      updateUser((s) => (s.lastModuleId === moduleId ? s : { ...s, lastModuleId: moduleId }));
    },
    [updateUser],
  );

  const touchDeck = useCallback(
    (moduleId: string) => {
      updateUser((s) => (s.lastDeckId === moduleId ? s : { ...s, lastDeckId: moduleId }));
    },
    [updateUser],
  );

  const setCards = useCallback(
    (moduleId: string, fn: (cards: UserFlashcard[]) => UserFlashcard[]) => {
      updateUser((s) => ({
        ...s,
        updatedAt: new Date().toISOString(),
        cards: { ...s.cards, [moduleId]: fn(s.cards?.[moduleId] ?? []) },
      }));
    },
    [updateUser],
  );

  const addCard = useCallback<ProgressValue['addCard']>(
    (moduleId, draft) => {
      const card: UserFlashcard = { ...draft, id: newCardId(moduleId), createdAt: new Date().toISOString() };
      setCards(moduleId, (cards) => [...cards, card]);
      return card;
    },
    [setCards],
  );

  const updateCard = useCallback<ProgressValue['updateCard']>(
    (moduleId, cardId, patch) => {
      setCards(moduleId, (cards) => cards.map((c) => (c.id === cardId ? { ...c, ...patch, id: cardId, updatedAt: new Date().toISOString() } : c)));
    },
    [setCards],
  );

  const removeCard = useCallback<ProgressValue['removeCard']>(
    (moduleId, cardId) => {
      const card = state.cards?.[moduleId]?.find((c) => c.id === cardId);
      if (!card) return undefined;
      const status = statusIn(state.modules[moduleId], cardId);
      setCards(moduleId, (cards) => cards.filter((c) => c.id !== cardId));
      updateModule(moduleId, (m) => withStatus(m, cardId, 'none'));
      return { card, status };
    },
    [state, setCards, updateModule],
  );

  const restoreCard = useCallback<ProgressValue['restoreCard']>(
    (moduleId, card, status) => {
      setCards(moduleId, (cards) => [...cards, card]);
      updateModule(moduleId, (m) => withStatus(m, card.id, status));
    },
    [setCards, updateModule],
  );

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
      if (uid === userId) setState((prev) => (prev.cards ? { ...emptyProgressState(), cards: prev.cards } : emptyProgressState()));
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
