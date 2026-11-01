import { useContext, useMemo } from 'react';
import { allModules } from './data/modulesData';
import { deckOf, findInDeck } from './decks';
import { FlashcardDialogContext, type CardPrefill, type FlashcardDialogValue } from './flashcard-dialog-context';
import { useProgress } from './useProgress';
import { useTeacherCards } from './useTeacherCards';

export const useFlashcardDialog = (): FlashcardDialogValue => {
  const ctx = useContext(FlashcardDialogContext);
  if (!ctx) throw new Error('useFlashcardDialog must be used inside FlashcardDialogProvider');
  return ctx;
};

/** The deck a new card joins: the user's own, or the chosen learner's as the teacher can see it. */
export const useTargetDeck = (moduleId: string | undefined, targetUserId?: string) => {
  const { state, userId } = useProgress();
  const { cardsOf } = useTeacherCards();
  return useMemo(() => {
    const module = allModules.find((m) => m.id === moduleId);
    if (!module) return [];
    return targetUserId ? deckOf(module, undefined, cardsOf(targetUserId)) : deckOf(module, state, cardsOf(userId));
  }, [moduleId, targetUserId, state, userId, cardsOf]);
};

/** Everything a page needs to offer "add to flashcards" for words of one topic. */
export const useAddFlashcard = (moduleId: string, targetUserId?: string) => {
  const { open } = useFlashcardDialog();
  const deck = useTargetDeck(moduleId, targetUserId);
  return {
    open: (prefill: CardPrefill) => open({ moduleId, prefill }),
    isInDeck: (front: string) => !!findInDeck(deck, front),
    cardIdFor: (front: string) => findInDeck(deck, front)?.id,
  };
};
