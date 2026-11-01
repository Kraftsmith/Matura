import { createContext } from 'react';
import type { TeacherFlashcard } from './types';
import type { TeacherCards } from './decks';
import type { CardDraft } from './teacherCardsApi';

export interface TeacherCardsValue {
  /** The cards the teacher added for this learner, keyed by module id. */
  cardsOf: (studentId: string) => TeacherCards;
  /** Cards that reached the learner since their last visit, waiting to be announced. */
  arrived: TeacherFlashcard[];
  clearArrived: () => void;
  /** Turns the learner's regular check on, for the pages where a new card matters. */
  setLive: (live: boolean) => void;
  /** Rejects when the server refuses, so the dialog can keep what was typed. */
  createCard: (studentId: string, moduleId: string, draft: CardDraft) => Promise<TeacherFlashcard>;
  /** Rejects when the server refuses, so the dialog can keep what was typed. */
  updateCard: (card: TeacherFlashcard, draft: CardDraft) => Promise<TeacherFlashcard>;
  /** The card disappears at once; the request goes out when the undo window closes. */
  removeCard: (card: TeacherFlashcard, onFailed: () => void) => void;
  undoRemove: () => void;
}

export const TeacherCardsContext = createContext<TeacherCardsValue | null>(null);
