import type { LanguageUseExercise } from './types';
import { isGapCorrect } from './progressSummary';

/** The learner's answers: promptId → replyId (matching), gap index → word (bank), item id → option index (dialogues). */
export type ExerciseAnswers = Record<string, string>;

/** One key per scored item of the exercise. */
export const itemKeys = (ex: LanguageUseExercise): string[] => {
  if (ex.type === 'matching') return ex.prompts.map((p) => p.id);
  if (ex.type === 'word-bank') return ex.items.map((_, i) => String(i));
  return ex.items.map((item) => item.id);
};

export const isItemCorrect = (ex: LanguageUseExercise, key: string, value = ''): boolean => {
  if (ex.type === 'matching') return !!value && ex.answers[key] === value;
  if (ex.type === 'word-bank') return isGapCorrect(ex.items[Number(key)], value);
  const item = ex.items.find((i) => i.id === key);
  return !!value && !!item && item.correctIndex === Number(value);
};

/** The key of the exercise in the form of learner's answers, for "Pokaż odpowiedzi". */
export const solvedAnswers = (ex: LanguageUseExercise): ExerciseAnswers => {
  if (ex.type === 'matching') return { ...ex.answers };
  if (ex.type === 'word-bank') return Object.fromEntries(ex.items.map((item, i) => [String(i), item.answer]));
  return Object.fromEntries(ex.items.map((item) => [item.id, String(item.correctIndex)]));
};

export const scoreOf = (ex: LanguageUseExercise, answers: ExerciseAnswers) => {
  const keys = itemKeys(ex);
  const correct = keys.filter((k) => isItemCorrect(ex, k, answers[k])).length;
  return { correct, total: keys.length, percent: Math.round((correct / keys.length) * 100) };
};
