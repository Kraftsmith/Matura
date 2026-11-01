import type { Flashcard, MaturaModule, TeacherFlashcard, UserFlashcard } from './types';
import type { ModuleProgress, ProgressState } from './progress-context';
import { normalise } from './text';

/** Cards the teacher added for one learner, keyed by module id. */
export type TeacherCards = Record<string, TeacherFlashcard[]>;

/** Everything the learner sees in one module's deck: built-in cards first, the teacher's next, their own last. */
export const deckOf = (module: MaturaModule, state?: ProgressState, teacherCards?: TeacherCards): Flashcard[] => [
  ...module.flashcards,
  ...(teacherCards?.[module.id] ?? []),
  ...(state?.cards?.[module.id] ?? []),
];

export const isUserCard = (card: Flashcard): card is UserFlashcard => 'source' in card;
export const isTeacherCard = (card: Flashcard): card is TeacherFlashcard => isUserCard(card) && card.source === 'teacher';
export const isOwnCard = (card: Flashcard): card is UserFlashcard => isUserCard(card) && card.source !== 'teacher';

export const findInDeck = (deck: Flashcard[], front: string): Flashcard | undefined => {
  const key = normalise(front);
  return deck.find((c) => normalise(c.front) === key);
};

/** Mastered and "Do powtórki" counts for a deck: ids that left the deck do not count. */
export const deckCounts = (deck: Flashcard[], p: ModuleProgress | undefined) => {
  const ids = new Set(deck.map((c) => c.id));
  return { mastered: (p?.mastered ?? []).filter((id) => ids.has(id)).length, review: (p?.review ?? []).filter((id) => ids.has(id)).length };
};
