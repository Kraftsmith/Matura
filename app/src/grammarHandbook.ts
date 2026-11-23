import { allModules } from './data/modulesData';
import { normalise } from './text';
import type { GrammarRule, MaturaModule } from './types';

/** One rule of the handbook: the topic that teaches it and how many tasks of that topic's test check it. */
export interface HandbookEntry {
  module: MaturaModule;
  rule: GrammarRule;
  tasks: number;
}

/** Every grammar rule of the course, in the order of the topics. */
export const handbookEntries: HandbookEntry[] = allModules.flatMap((module) =>
  module.grammarRules.map((rule) => ({
    module,
    rule,
    tasks: module.testQuestions.filter((q) => q.grammarRef?.ruleId === rule.id).length,
  })),
);

/** Polish typed without its letters still finds the rule: "mowa zalezna", "przeszlosc". */
const plain = (s: string) => normalise(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

/** Rules whose title, structure, summary, examples or topic name contain the query; all of them for an empty query. */
export const searchHandbook = (query: string, entries: HandbookEntry[] = handbookEntries): HandbookEntry[] => {
  const q = plain(query);
  if (!q) return entries;
  return entries.filter(({ module, rule }) =>
    [rule.title, rule.formula ?? '', rule.ruleSummary, module.titlePl, module.titleEn, ...rule.examples.map((e) => e.english)].some((text) => plain(text).includes(q)),
  );
};
