import { allModules } from './data/modulesData';
import { normalise } from './text';
import type { GrammarRule, MaturaModule, TestQuestion } from './types';

/**
 * One grammar point of the handbook with the tasks that check it, in the order of the test. Grammar runs across
 * the whole course, so the handbook does not show which topic a rule sits in: `module` is only where its tasks open.
 */
export interface HandbookEntry {
  module: MaturaModule;
  rule: GrammarRule;
  tasks: TestQuestion[];
}

/** Every grammar rule of the course, in the order of the topics. */
export const handbookEntries: HandbookEntry[] = allModules.flatMap((module) =>
  module.grammarRules.map((rule) => ({
    module,
    rule,
    tasks: module.testQuestions.filter((q) => q.grammarRef?.ruleId === rule.id),
  })),
);

/** Polish typed without its letters still finds the rule: "mowa zalezna", "przeszlosc". */
const plain = (s: string) => normalise(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

/** Rules whose title, structure, summary or examples contain the query; all of them for an empty query. */
export const searchHandbook = (query: string, entries: HandbookEntry[] = handbookEntries): HandbookEntry[] => {
  const q = plain(query);
  if (!q) return entries;
  return entries.filter(({ rule }) => [rule.title, rule.formula ?? '', rule.ruleSummary, ...rule.examples.map((e) => e.english)].some((text) => plain(text).includes(q)));
};
