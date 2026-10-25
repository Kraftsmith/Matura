import type { ModuleProgress, ProgressState } from '../progress-context';
import { allModules } from './modulesData';

const cardIds = (moduleId: string, from: number, to: number): string[] =>
  (allModules.find((m) => m.id === moduleId)?.flashcards ?? []).slice(from, to).map((c) => c.id);

const daysAgo = (d: number): string => new Date(Date.now() - d * 86_400_000).toISOString();

const mod = (
  moduleId: string,
  masteredCount: number,
  reviewCount: number,
  test?: { best: number; last?: number; attempts: number; daysAgo: number },
): ModuleProgress => ({
  mastered: cardIds(moduleId, 0, masteredCount),
  review: cardIds(moduleId, masteredCount, masteredCount + reviewCount),
  ...(test
    ? { test: { best: test.best, last: test.last ?? test.best, attempts: test.attempts, lastAt: daysAgo(test.daysAgo) } }
    : {}),
});

/**
 * Starting point for the roster. Maria is well into the course, Evgeny has only begun,
 * so the teacher's overview shows two clearly different learners from the first launch.
 * Used only when no progress has been saved yet.
 */
export const buildDemoProgress = (): Record<string, ProgressState> => ({
  maria: {
    version: 1,
    lastModuleId: 'zywienie',
    updatedAt: daysAgo(1),
    modules: {
      czlowiek: mod('czlowiek', 25, 0, { best: 92, attempts: 2, daysAgo: 14 }),
      'miejsce-zamieszkania': mod('miejsce-zamieszkania', 5, 0, { best: 100, attempts: 1, daysAgo: 11 }),
      edukacja: mod('edukacja', 3, 0, { best: 100, attempts: 2, daysAgo: 8 }),
      praca: mod('praca', 2, 0, { best: 100, attempts: 1, daysAgo: 5 }),
      'zycie-prywatne': mod('zycie-prywatne', 1, 0, { best: 100, attempts: 1, daysAgo: 3 }),
      zywienie: mod('zywienie', 0, 1, { best: 0, attempts: 1, daysAgo: 1 }),
    },
  },
  evgeny: {
    version: 1,
    lastModuleId: 'czlowiek',
    updatedAt: daysAgo(3),
    modules: {
      czlowiek: mod('czlowiek', 7, 4, { best: 40, last: 40, attempts: 2, daysAgo: 3 }),
      'miejsce-zamieszkania': mod('miejsce-zamieszkania', 2, 1),
    },
  },
});
