import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ProgressContext,
  emptyModuleProgress,
  emptyProgressState,
  type CardStatus,
  type ModuleProgress,
  type ProgressState,
  type ProgressValue,
} from './progress-context';
import { useUser } from './useUser';
import type { UserFlashcard } from './types';

const STORAGE_KEY = 'matura.progress.v3';
/** Older keys hold the seeded demo progress mixed with real answers, so they are dropped rather than migrated. */
const LEGACY_KEYS = ['matura.progress.v2'];

interface StoredProgress {
  version: 2;
  users: Record<string, ProgressState>;
}

const isProgressState = (v: unknown): v is ProgressState =>
  !!v && typeof v === 'object' && (v as ProgressState).version === 1 && typeof (v as ProgressState).modules === 'object';

/** Reads every user's progress. Nothing saved yet (or unreadable data) means everyone starts from zero. */
const readStored = (): Record<string, ProgressState> => {
  try {
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    if (parsed.version !== 2 || !parsed.users || typeof parsed.users !== 'object') return {};
    const users: Record<string, ProgressState> = {};
    for (const [id, st] of Object.entries(parsed.users)) if (isProgressState(st)) users[id] = st;
    return users;
  } catch {
    return {};
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
  const { user } = useUser();
  const userId = user.id;
  const [allStates, setAllStates] = useState<Record<string, ProgressState>>(readStored);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    try {
      const payload: StoredProgress = { version: 2, users: allStates };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      // The result of the write is only known here, after it happened.
      // oxlint-disable-next-line react/set-state-in-effect
      setSaveFailed(false);
    } catch {
      /* storage unavailable: keep in memory only and tell the learner */
      setSaveFailed(true);
    }
  }, [allStates]);

  // Another tab saved: take its data, otherwise this tab's next write would overwrite that work.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setAllStates(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const state = allStates[userId] ?? emptyProgressState();

  const getModuleFor = useCallback(
    (uid: string, moduleId: string): ModuleProgress => allStates[uid]?.modules[moduleId] ?? emptyModuleProgress(),
    [allStates],
  );

  const getModule = useCallback((moduleId: string) => getModuleFor(userId, moduleId), [getModuleFor, userId]);

  const updateUser = useCallback(
    (fn: (s: ProgressState) => ProgressState) => {
      setAllStates((prev) => ({ ...prev, [userId]: fn(prev[userId] ?? emptyProgressState()) }));
    },
    [userId],
  );

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
      const current = allStates[userId];
      const card = current?.cards?.[moduleId]?.find((c) => c.id === cardId);
      if (!card) return undefined;
      const status = statusIn(current?.modules[moduleId], cardId);
      setCards(moduleId, (cards) => cards.filter((c) => c.id !== cardId));
      updateModule(moduleId, (m) => withStatus(m, cardId, 'none'));
      return { card, status };
    },
    [allStates, userId, setCards, updateModule],
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
  const resetUser = useCallback((uid: string) => {
    setAllStates((prev) => {
      const next = { ...prev };
      const cards = prev[uid]?.cards;
      if (cards) next[uid] = { ...emptyProgressState(), cards };
      else delete next[uid];
      return next;
    });
  }, []);

  const value = useMemo<ProgressValue>(
    () => ({ userId, state, allStates, getModule, getModuleFor, updateModule, setCardStatus, saveTestResult, saveExerciseResult, touchModule, touchDeck, addCard, updateCard, removeCard, restoreCard, moveCard, resetUser, saveFailed }),
    [userId, state, allStates, getModule, getModuleFor, updateModule, setCardStatus, saveTestResult, saveExerciseResult, touchModule, touchDeck, addCard, updateCard, removeCard, restoreCard, moveCard, resetUser, saveFailed],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
