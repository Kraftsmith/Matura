import { createContext } from 'react';
import type { UserFlashcard } from './types';

/** The test as the learner left it: answers typed so far and the tasks already checked. */
export interface TestWork {
  answers: Record<string, string>;
  checked: Record<string, boolean>;
}

/** One gap-fill exercise under a vocabulary text. */
export interface GapWork {
  values: string[];
  checked: boolean;
  /** The answers were revealed, so the values are no longer the learner's own. */
  revealed?: boolean;
  /** Best number of correct gaps across checks; survives "try again". */
  best?: number;
  at: string; // ISO date
}

/** One "Środki językowe" exercise as the learner left it: their answers and whether they were checked. */
export interface LanguageWork {
  /** promptId → replyId (matching), gap index → word (bank), item id → option index (dialogues). */
  answers: Record<string, string>;
  checked: boolean;
  /** The key was shown, so the answers are no longer the learner's own. */
  revealed?: boolean;
  at: string; // ISO date
}

/** Result of one "Środki językowe" exercise. */
export interface ExerciseResult {
  best: number; // 0–100
  last: number;
  attempts: number;
  lastAt: string; // ISO date
}

/** How well one module is known. Everything is derived from what the learner actually did. */
export interface ModuleProgress {
  /** Flashcard ids marked "Opanowane". */
  mastered: string[];
  /** Flashcard ids marked "Do powtórki". */
  review: string[];
  /** Grammar / language-means test results, saved every time the whole test is checked. */
  test?: {
    best: number;
    last: number;
    attempts: number;
    lastAt: string; // ISO date
  };
  testWork?: TestWork;
  /** Gap-fill exercises, keyed by vocabulary text id. */
  gapWork?: Record<string, GapWork>;
  /** Results of the "Środki językowe" exercises, keyed by exercise id. Saved every time an exercise is checked. */
  exercises?: Record<string, ExerciseResult>;
  /** Answers to the "Środki językowe" exercises, keyed by exercise id. */
  exerciseWork?: Record<string, LanguageWork>;
  /** Notes to the oral exam questions, keyed by question number. */
  pictureNotes?: Record<number, string>;
  essay?: { text: string; at: string };
}

/** One learner's progress. */
export interface ProgressState {
  version: 1;
  modules: Record<string, ModuleProgress>;
  lastModuleId?: string;
  /** The learner's own flashcards, keyed by module id. Content, not status: "Wyczyść postęp" keeps them. */
  cards?: Record<string, UserFlashcard[]>;
  /** Deck opened last in the Fiszki module, for "Kontynuuj". */
  lastDeckId?: string;
  /** ISO date of the last change to any of the learner's work. */
  updatedAt?: string;
}

export type CardStatus = 'mastered' | 'review' | 'none';

export interface ProgressValue {
  /** Whose progress the write methods below change: the signed-in user. */
  userId: string;
  /** The signed-in user's progress. */
  state: ProgressState;
  /** Progress of every user, keyed by user id (teacher overview). */
  allStates: Record<string, ProgressState>;
  getModule: (moduleId: string) => ModuleProgress;
  getModuleFor: (userId: string, moduleId: string) => ModuleProgress;
  /** Saves the signed-in user's work in one module. */
  updateModule: (moduleId: string, fn: (m: ModuleProgress) => ModuleProgress) => void;
  setCardStatus: (moduleId: string, cardId: string, status: CardStatus) => void;
  saveTestResult: (moduleId: string, scorePercent: number) => void;
  saveExerciseResult: (moduleId: string, exerciseId: string, scorePercent: number) => void;
  touchModule: (moduleId: string) => void;
  touchDeck: (moduleId: string) => void;
  addCard: (moduleId: string, card: Omit<UserFlashcard, 'id' | 'createdAt'>) => UserFlashcard;
  updateCard: (moduleId: string, cardId: string, patch: Partial<UserFlashcard>) => void;
  /** Also drops the card's status. Returns what was removed, so "Cofnij" can put it back. */
  removeCard: (moduleId: string, cardId: string) => { card: UserFlashcard; status: CardStatus } | undefined;
  /** "Cofnij": puts a removed card back at the end of the deck, with its status. */
  restoreCard: (moduleId: string, card: UserFlashcard, status: CardStatus) => void;
  /** Moves a card to another module's deck, applying an edit if there is one; its status moves with it. */
  moveCard: (fromModuleId: string, toModuleId: string, cardId: string, patch?: Partial<UserFlashcard>) => void;
  resetUser: (userId: string) => void;
  /**
   * Sends what is waiting, including a change made in the same event handler; false when something did not reach the server.
   * The "Zapisz" buttons and signing out use it.
   */
  flush: () => Promise<boolean>;
  /** The last save to the server failed: the work is only in this browser for now. */
  saveFailed: boolean;
}

/** A module's grammar counts as studied once its test is passed at this score. */
export const GRAMMAR_PASS_SCORE = 80;
/** A "Środki językowe" exercise counts as passed from this best score. */
export const EXERCISE_PASS_SCORE = 80;

export const emptyModuleProgress = (): ModuleProgress => ({ mastered: [], review: [] });
export const emptyProgressState = (): ProgressState => ({ version: 1, modules: {} });

export const ProgressContext = createContext<ProgressValue | null>(null);
