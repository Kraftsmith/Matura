import { createContext } from 'react';
import type { TeacherFlashcard, UserCardSource, UserFlashcard } from './types';
import type { CardDraft } from './teacherCardsApi';

export type CardPrefill = Partial<CardDraft> & { source?: UserCardSource };

export interface CardRequest {
  /** The deck from the address; without it the dialog offers a list of decks. */
  moduleId?: string;
  prefill?: CardPrefill;
  /** Edits this card instead of adding a new one. */
  editing?: UserFlashcard;
}

export interface FlashcardDialogValue {
  /** The learner the teacher is adding cards for; undefined means the teacher's own deck. */
  lessonStudent: string | undefined;
  chooseStudent: (id: string | undefined) => void;
  open: (request: CardRequest) => void;
  /** Removes the learner's own card, with "Cofnij" for 8 seconds. */
  removeOwn: (moduleId: string, card: UserFlashcard) => void;
  /** Removes a card added for a learner, with "Cofnij" for 8 seconds. */
  removeForStudent: (card: TeacherFlashcard) => void;
}

export const FlashcardDialogContext = createContext<FlashcardDialogValue | null>(null);
