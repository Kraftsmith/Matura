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

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const userId = user.id;
  const [allStates, setAllStates] = useState<Record<string, ProgressState>>(readStored);

  useEffect(() => {
    try {
      const payload: StoredProgress = { version: 2, users: allStates };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, [allStates]);

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
      updateModule(moduleId, (m) => {
        const mastered = m.mastered.filter((id) => id !== cardId);
        const review = m.review.filter((id) => id !== cardId);
        if (status === 'mastered') mastered.push(cardId);
        if (status === 'review') review.push(cardId);
        return { ...m, mastered, review };
      });
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

  const touchModule = useCallback(
    (moduleId: string) => {
      updateUser((s) => (s.lastModuleId === moduleId ? s : { ...s, lastModuleId: moduleId }));
    },
    [updateUser],
  );

  const resetUser = useCallback((uid: string) => {
    setAllStates((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
  }, []);

  const value = useMemo<ProgressValue>(
    () => ({ userId, state, allStates, getModule, getModuleFor, setCardStatus, saveTestResult, touchModule, resetUser }),
    [userId, state, allStates, getModule, getModuleFor, setCardStatus, saveTestResult, touchModule, resetUser],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
