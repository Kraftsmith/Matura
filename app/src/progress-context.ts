import { createContext } from 'react';

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
}

/** One learner's progress. */
export interface ProgressState {
  version: 1;
  modules: Record<string, ModuleProgress>;
  lastModuleId?: string;
  /** ISO date of the last change (card marked or test finished). */
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
  setCardStatus: (moduleId: string, cardId: string, status: CardStatus) => void;
  saveTestResult: (moduleId: string, scorePercent: number) => void;
  touchModule: (moduleId: string) => void;
  resetUser: (userId: string) => void;
}

/** A module's grammar counts as studied once its test is passed at this score. */
export const GRAMMAR_PASS_SCORE = 80;

export const emptyModuleProgress = (): ModuleProgress => ({ mastered: [], review: [] });
export const emptyProgressState = (): ProgressState => ({ version: 1, modules: {} });

export const ProgressContext = createContext<ProgressValue | null>(null);
