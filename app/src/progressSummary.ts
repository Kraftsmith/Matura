import type { GapFillItem, MaturaModule, TestQuestion } from './types';
import type { I18nKey } from './i18n';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { vocabularyExercisesByText } from './data/vocabularyExercises';
import { GRAMMAR_PASS_SCORE, emptyModuleProgress, type ModuleProgress, type ProgressState } from './progress-context';

export type GrammarStatus = 'none' | 'inProgress' | 'passed';

export const grammarStatusOf = (best: number | undefined): GrammarStatus => {
  if (best === undefined) return 'none';
  return best >= GRAMMAR_PASS_SCORE ? 'passed' : 'inProgress';
};

export const isTestAnswerCorrect = (q: TestQuestion, answer = ''): boolean => {
  const a = answer.trim().toLowerCase();
  return !!a && q.correctAnswers.some((c) => c.trim().toLowerCase() === a);
};

/** Lower-case, single-spaced, hyphens treated as spaces, so "rip-off" and "Rip off" both match. */
const normalise = (s: string) => s.toLowerCase().replace(/[-‐-―]/g, ' ').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

export const isGapCorrect = (item: GapFillItem, value = ''): boolean => {
  const v = normalise(value);
  return v.length > 0 && [item.answer, ...(item.alternatives ?? [])].some((a) => normalise(a) === v);
};

export const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/** One answer as the learner gave it. `correct` is unset until the answer has been checked. */
export interface WorkAnswer {
  label: string;
  answer: string;
  correct?: boolean;
}

export interface ExerciseWork {
  id: string;
  title: string;
  total: number;
  best?: number;
  revealed: boolean;
  answers: WorkAnswer[];
}

/** Everything the learner typed in one module, in a form the dashboards can show. */
export interface ModuleWork {
  test?: { answered: number; checked: number; correct: number; total: number; answers: WorkAnswer[] };
  exercises: ExerciseWork[];
  notes: { question: string; text: string }[];
  essay?: { title: string; text: string; words: number; at: string };
  /** Tasks with saved work: the test, each exercise, the notes and the essay count once each. */
  count: number;
}

const summarizeWork = (module: MaturaModule, p: ModuleProgress): ModuleWork => {
  const testAnswers = module.testQuestions.flatMap((q): WorkAnswer[] => {
    const answer = p.testWork?.answers[q.id]?.trim();
    if (!answer) return [];
    const label = [q.sentencePrefix, '___', q.sentenceSuffix].filter(Boolean).join(' ');
    return [{ label, answer, correct: p.testWork?.checked[q.id] ? isTestAnswerCorrect(q, answer) : undefined }];
  });
  const test = testAnswers.length
    ? {
        answered: testAnswers.length,
        checked: testAnswers.filter((a) => a.correct !== undefined).length,
        correct: testAnswers.filter((a) => a.correct).length,
        total: module.testQuestions.length,
        answers: testAnswers,
      }
    : undefined;

  const exercises = (vocabularyTextsByModule[module.id] ?? []).flatMap((text): ExerciseWork[] => {
    const saved = p.gapWork?.[text.id];
    const items = vocabularyExercisesByText[text.id]?.items;
    if (!saved || !items) return [];
    if (saved.best === undefined && !saved.values.some((v) => v.trim())) return [];
    const revealed = !!saved.revealed;
    const answers = revealed
      ? []
      : items.flatMap((item, i): WorkAnswer[] => {
          const answer = saved.values[i]?.trim();
          return answer ? [{ label: item.sentence, answer, correct: saved.checked ? isGapCorrect(item, answer) : undefined }] : [];
        });
    return [{ id: text.id, title: text.title, total: items.length, best: saved.best, revealed, answers }];
  });

  const notes = module.pictureDescription.examQuestions.flatMap((q) => {
    const text = p.pictureNotes?.[q.questionNumber]?.trim();
    return text ? [{ question: q.questionText, text }] : [];
  });

  const essay = p.essay?.text.trim()
    ? { title: module.writingPrompt.title, text: p.essay.text, words: countWords(p.essay.text), at: p.essay.at }
    : undefined;

  return { test, exercises, notes, essay, count: (test ? 1 : 0) + exercises.length + (notes.length ? 1 : 0) + (essay ? 1 : 0) };
};

export interface ModuleSummary {
  module: MaturaModule;
  total: number;
  mastered: number;
  review: number;
  wordsPct: number;
  best?: number;
  attempts: number;
  grammar: GrammarStatus;
  work: ModuleWork;
}

/** Counts only ids that still exist in the deck, in case data changed between sessions. */
export const summarizeModule = (module: MaturaModule, p: ModuleProgress = emptyModuleProgress()): ModuleSummary => {
  const total = module.flashcards.length;
  const ids = new Set(module.flashcards.map((c) => c.id));
  const mastered = p.mastered.filter((id) => ids.has(id)).length;
  const review = p.review.filter((id) => ids.has(id)).length;
  const best = p.test?.best;
  return {
    module,
    total,
    mastered,
    review,
    wordsPct: total ? (mastered / total) * 100 : 0,
    best,
    attempts: p.test?.attempts ?? 0,
    grammar: grammarStatusOf(best),
    work: summarizeWork(module, p),
  };
};

export interface UserSummary {
  rows: ModuleSummary[];
  totalWords: number;
  masteredWords: number;
  reviewWords: number;
  wordsPct: number;
  grammarPassed: number;
  grammarStarted: number;
  startedModules: number;
  /** Tasks with saved work across all modules. */
  workCount: number;
  lastActiveAt?: string;
  lastModule?: MaturaModule;
}

export const summarizeUser = (modules: MaturaModule[], state: ProgressState | undefined): UserSummary => {
  const rows = modules.map((m) => summarizeModule(m, state?.modules[m.id]));
  const totalWords = rows.reduce((a, r) => a + r.total, 0);
  const masteredWords = rows.reduce((a, r) => a + r.mastered, 0);
  const reviewWords = rows.reduce((a, r) => a + r.review, 0);
  const grammarPassed = rows.filter((r) => r.grammar === 'passed').length;
  const grammarStarted = rows.filter((r) => r.grammar !== 'none').length;
  const startedModules = rows.filter((r) => r.mastered > 0 || r.review > 0 || r.best !== undefined || r.work.count > 0).length;
  const lastTestAt = rows
    .map((r) => state?.modules[r.module.id]?.test?.lastAt)
    .filter((d): d is string => !!d)
    .sort()
    .at(-1);
  const lastActiveAt = [state?.updatedAt, lastTestAt].filter((d): d is string => !!d).sort().at(-1);
  return {
    rows,
    totalWords,
    masteredWords,
    reviewWords,
    wordsPct: totalWords ? Math.round((masteredWords / totalWords) * 100) : 0,
    grammarPassed,
    grammarStarted,
    startedModules,
    workCount: rows.reduce((a, r) => a + r.work.count, 0),
    lastActiveAt,
    lastModule: state?.lastModuleId ? modules.find((m) => m.id === state.lastModuleId) : undefined,
  };
};

/** Relative day label through the UI dictionary: today, yesterday, N days ago, or a date when older than a month. */
export const formatRelative = (iso: string | undefined, t: (key: I18nKey, vars?: Record<string, string | number>) => string, locale = 'pl-PL'): string => {
  if (!iso) return t('dash.never');
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return t('dash.never');
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return t('dash.today');
  if (days === 1) return t('dash.yesterday');
  if (days < 31) return t('dash.daysAgo', { n: days });
  return new Date(iso).toLocaleDateString(locale);
};
