import type { MaturaModule } from './types';
import type { I18nKey } from './i18n';
import { GRAMMAR_PASS_SCORE, emptyModuleProgress, type ModuleProgress, type ProgressState } from './progress-context';

export type GrammarStatus = 'none' | 'inProgress' | 'passed';

export const grammarStatusOf = (best: number | undefined): GrammarStatus => {
  if (best === undefined) return 'none';
  return best >= GRAMMAR_PASS_SCORE ? 'passed' : 'inProgress';
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
  const startedModules = rows.filter((r) => r.mastered > 0 || r.review > 0 || r.best !== undefined).length;
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
