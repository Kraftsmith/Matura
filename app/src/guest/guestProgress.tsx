import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProgressContext, emptyModuleProgress, emptyProgressState, type ModuleProgress, type ProgressState, type ProgressValue } from '../progress-context';
import {
  findCard,
  makeCard,
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
} from '../progressOps';
import { GUEST_KEY, readGuestProgress, writeGuestProgress } from './guestStorage';

export const GUEST_USER_ID = 'guest';

interface GuestProgressProviderProps {
  /** Topics open on the site; writes to any other topic are ignored. */
  allowedModules: readonly string[];
  children: React.ReactNode;
}

/**
 * Progress for a visitor without an account, kept in this browser only (Spec - Landing §8.3).
 * The first render is empty on the server and the client alike; the stored work arrives in an effect,
 * so the HTML built at deploy time and the first client render match.
 */
export const GuestProgressProvider: React.FC<GuestProgressProviderProps> = ({ allowedModules, children }) => {
  const [state, setState] = useState<ProgressState>(emptyProgressState);
  const loaded = useRef(false);

  useEffect(() => {
    const stored = readGuestProgress();
    loaded.current = true;
    // oxlint-disable-next-line react/set-state-in-effect
    if (stored) setState(stored);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== GUEST_KEY) return;
      const next = readGuestProgress();
      if (next) setState(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (loaded.current) writeGuestProgress(state);
  }, [state]);

  const allowed = useCallback((moduleId: string) => allowedModules.includes(moduleId), [allowedModules]);

  /** Applies an operation on one topic, if that topic is open. */
  const change = useCallback(
    (moduleId: string, fn: (s: ProgressState) => ProgressState) => {
      if (allowed(moduleId)) setState(fn);
    },
    [allowed],
  );

  const getModule = useCallback((moduleId: string): ModuleProgress => state.modules[moduleId] ?? emptyModuleProgress(), [state]);
  const getModuleFor = useCallback((_uid: string, moduleId: string) => getModule(moduleId), [getModule]);

  const updateModule = useCallback<ProgressValue['updateModule']>((moduleId, fn) => change(moduleId, (s) => opUpdateModule(s, moduleId, fn)), [change]);
  const setCardStatus = useCallback<ProgressValue['setCardStatus']>((moduleId, cardId, status) => change(moduleId, (s) => opSetCardStatus(s, moduleId, cardId, status)), [change]);
  const saveTestResult = useCallback<ProgressValue['saveTestResult']>((moduleId, score) => change(moduleId, (s) => opSaveTestResult(s, moduleId, score)), [change]);
  const saveExerciseResult = useCallback<ProgressValue['saveExerciseResult']>(
    (moduleId, exerciseId, score) => change(moduleId, (s) => opSaveExerciseResult(s, moduleId, exerciseId, score)),
    [change],
  );
  const touchModule = useCallback<ProgressValue['touchModule']>((moduleId) => change(moduleId, (s) => opTouchModule(s, moduleId)), [change]);
  const touchDeck = useCallback<ProgressValue['touchDeck']>((moduleId) => change(moduleId, (s) => opTouchDeck(s, moduleId)), [change]);

  const addCard = useCallback<ProgressValue['addCard']>(
    (moduleId, draft) => {
      const card = makeCard(moduleId, draft);
      change(moduleId, (s) => opAddCard(s, moduleId, card));
      return card;
    },
    [change],
  );
  const updateCard = useCallback<ProgressValue['updateCard']>((moduleId, cardId, patch) => change(moduleId, (s) => opUpdateCard(s, moduleId, cardId, patch)), [change]);
  const removeCard = useCallback<ProgressValue['removeCard']>(
    (moduleId, cardId) => {
      const removed = findCard(state, moduleId, cardId);
      if (removed) change(moduleId, (s) => opRemoveCard(s, moduleId, cardId));
      return removed;
    },
    [state, change],
  );
  const restoreCard = useCallback<ProgressValue['restoreCard']>((moduleId, card, status) => change(moduleId, (s) => opRestoreCard(s, moduleId, card, status)), [change]);
  const moveCard = useCallback<ProgressValue['moveCard']>(
    (fromModuleId, toModuleId, cardId, patch) => {
      if (!allowed(fromModuleId) || !allowed(toModuleId)) return;
      const removed = findCard(state, fromModuleId, cardId);
      if (!removed) return;
      setState((s) => opRestoreCard(opRemoveCard(s, fromModuleId, cardId), toModuleId, { ...removed.card, ...patch, updatedAt: new Date().toISOString() }, removed.status));
    },
    [allowed, state],
  );
  const resetUser = useCallback(() => setState(opReset), []);
  const flush = useCallback(() => Promise.resolve(true), []);

  const allStates = useMemo(() => ({ [GUEST_USER_ID]: state }), [state]);

  const value = useMemo<ProgressValue>(
    () => ({
      userId: GUEST_USER_ID,
      state,
      allStates,
      getModule,
      getModuleFor,
      updateModule,
      setCardStatus,
      saveTestResult,
      saveExerciseResult,
      touchModule,
      touchDeck,
      addCard,
      updateCard,
      removeCard,
      restoreCard,
      moveCard,
      resetUser,
      flush,
      saveFailed: false,
    }),
    [state, allStates, getModule, getModuleFor, updateModule, setCardStatus, saveTestResult, saveExerciseResult, touchModule, touchDeck, addCard, updateCard, removeCard, restoreCard, moveCard, resetUser, flush],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
