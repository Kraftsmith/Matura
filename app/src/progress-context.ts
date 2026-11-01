import { createContext } from 'react';

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
  /** Notes to the oral exam questions, keyed by question number. */
  pictureNotes?: Record<number, string>;
  essay?: { text: string; at: string };
}

/** One learner's progress. */
export interface ProgressState {
  version: 1;
  modules: Record<string, ModuleProgress>;
  lastModuleId?: string;
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
  touchModule: (moduleId: string) => void;
  resetUser: (userId: string) => void;
  /** The last write to the browser's storage failed: the work lives only in this tab. */
  saveFailed: boolean;
}

/** A module's grammar counts as studied once its test is passed at this score. */
export const GRAMMAR_PASS_SCORE = 80;

export const emptyModuleProgress = (): ModuleProgress => ({ mastered: [], review: [] });
export const emptyProgressState = (): ProgressState => ({ version: 1, modules: {} });

export const ProgressContext = createContext<ProgressValue | null>(null);
