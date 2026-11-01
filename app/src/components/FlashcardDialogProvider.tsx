import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { TeacherFlashcard, UserFlashcard } from '../types';
import { FlashcardDialogContext, type CardRequest, type FlashcardDialogValue } from '../flashcard-dialog-context';
import { AddFlashcardDialog } from './AddFlashcardDialog';
import { Toast, type ToastAction } from './ui';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';
import { useUser } from '../useUser';
import { buildHash } from '../userRoute';
import { findUser } from '../users';

const UNDO_MS = 8000;
const LINK_MS = 6000;

interface ShownToast {
  id: number;
  text: string;
  action?: ToastAction;
  ms: number;
}

interface FlashcardDialogProviderProps {
  children: React.ReactNode;
  /** Shown in the dialog when the teacher's session ended while they were typing. */
  signIn: React.ReactNode;
  onSignedOut: () => void;
}

/** The add / edit dialog and the messages after it, shared by every page that offers a card. */
export const FlashcardDialogProvider: React.FC<FlashcardDialogProviderProps> = ({ children, signIn, onSignedOut }) => {
  const { t } = useSettings();
  const { user } = useUser();
  const progress = useProgress();
  const teacherCards = useTeacherCards();
  const [request, setRequest] = useState<CardRequest & { key: number }>();
  const [toast, setToast] = useState<ShownToast>();

  const notify = useCallback((next: Omit<ShownToast, 'id'>) => setToast({ ...next, id: Date.now() }), []);
  const dismiss = useCallback(() => setToast(undefined), []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(dismiss, toast.ms);
    return () => window.clearTimeout(id);
  }, [toast, dismiss]);

  const open = useCallback<FlashcardDialogValue['open']>((next) => setRequest({ ...next, key: Date.now() }), []);

  const { removeCard: removeLocal, restoreCard } = progress;
  const removeOwn = useCallback<FlashcardDialogValue['removeOwn']>(
    (moduleId, card) => {
      const removed = removeLocal(moduleId, card.id);
      if (!removed) return;
      const undo = () => {
        restoreCard(moduleId, removed.card, removed.status);
        dismiss();
      };
      notify({ text: t('cards.deleted'), ms: UNDO_MS, action: { label: t('cards.undo'), onClick: undo } });
    },
    [removeLocal, restoreCard, notify, dismiss, t],
  );

  const { removeCard: removeRemote, undoRemove, arrived, clearArrived } = teacherCards;
  const removeForStudent = useCallback<FlashcardDialogValue['removeForStudent']>(
    (card) => {
      removeRemote(card, () => notify({ text: t('cards.deleteFailed'), ms: LINK_MS }));
      const undo = () => {
        undoRemove();
        dismiss();
      };
      notify({ text: t('cards.deleted'), ms: UNDO_MS, action: { label: t('cards.undo'), onClick: undo } });
    },
    [removeRemote, undoRemove, notify, dismiss, t],
  );

  // A learner hears about new cards wherever they are on the site.
  useEffect(() => {
    if (arrived.length === 0) return;
    const [first] = arrived;
    const rest = arrived.length === 1 ? `${first.moduleId}/fiszki/${first.id}` : `${first.moduleId}/fiszki/od-nauczyciela`;
    // oxlint-disable-next-line react/set-state-in-effect
    notify({
      text: arrived.length === 1 ? t('lesson.newCard', { w: first.front }) : t('lesson.newCards', { n: arrived.length }),
      ms: LINK_MS,
      action: { label: t('add.openShort'), href: `#${buildHash(user.id, rest)}` },
    });
    clearArrived();
  }, [arrived, clearArrived, notify, t, user.id]);

  const onAdded = useCallback(
    (moduleId: string, deckTitle: string, card: UserFlashcard) => {
      window.getSelection()?.removeAllRanges();
      notify({
        text: t('add.added', { deck: deckTitle }),
        ms: LINK_MS,
        action: { label: t('add.openShort'), href: `#${buildHash(user.id, `${moduleId}/fiszki/${card.id}`)}` },
      });
    },
    [notify, t, user.id],
  );

  const onAddedForStudent = useCallback(
    (card: TeacherFlashcard) => {
      window.getSelection()?.removeAllRanges();
      const undo = () => removeForStudent(card);
      notify({ text: t('lesson.added', { name: findUser(card.studentId)?.name ?? card.studentId }), ms: UNDO_MS, action: { label: t('cards.undo'), onClick: undo } });
    },
    [notify, removeForStudent, t],
  );

  const value = useMemo<FlashcardDialogValue>(() => ({ open, removeOwn, removeForStudent }), [open, removeOwn, removeForStudent]);

  return (
    <FlashcardDialogContext.Provider value={value}>
      {children}
      {request && (
        <AddFlashcardDialog
          key={request.key}
          request={request}
          signIn={signIn}
          onSignedOut={onSignedOut}
          onClose={() => setRequest(undefined)}
          onAdded={onAdded}
          onAddedForStudent={onAddedForStudent}
          onRemoveOwn={removeOwn}
          onRemoveForStudent={removeForStudent}
        />
      )}
      {toast && <Toast action={toast.action}>{toast.text}</Toast>}
    </FlashcardDialogContext.Provider>
  );
};
