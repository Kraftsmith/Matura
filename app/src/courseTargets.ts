import type { SectionType } from './types';
import { allModules } from './data/modulesData';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { languageUseExercisesByModule } from './data/languageUseExercises';
import { vocabularyExercisesByText } from './data/vocabularyExercises';
import type { I18nKey } from './i18n';
import { isModuleId, moduleSections, validItem } from './routing';

/**
 * A homework target is a page of the course written as its route: "czlowiek/slownictwo/czl-txt-2",
 * "czlowiek/gramatyka/test", "czlowiek/pisanie", "fiszki/czlowiek" (a deck). The same string opens the page.
 */
export interface CourseTarget {
  moduleId: string;
  section: SectionType;
  item?: string;
}

/** What the site can tell about the work: counted by itself, or only by hand. */
export type TargetKind = 'gap' | 'exercise' | 'test' | 'essay' | 'deck' | 'manual';

export const parseTarget = (target: string): CourseTarget | undefined => {
  const [a, b, c, d] = target.split('/');
  if (d !== undefined) return undefined;
  if (a === 'fiszki') return b && isModuleId(b) && c === undefined ? { moduleId: b, section: 'fiszki' } : undefined;
  if (!isModuleId(a) || !b || !moduleSections.includes(b as SectionType) || b === 'fiszki') return undefined;
  const section = b as SectionType;
  if (c !== undefined && validItem(a, section, c) !== c) return undefined;
  return { moduleId: a, section, item: c };
};

export const targetString = (t: CourseTarget): string => (t.section === 'fiszki' ? `fiszki/${t.moduleId}` : t.item ? `${t.moduleId}/${t.section}/${t.item}` : `${t.moduleId}/${t.section}`);

export const targetKind = (t: CourseTarget): TargetKind => {
  if (t.section === 'slownictwo' && t.item) return vocabularyExercisesByText[t.item] ? 'gap' : 'manual';
  if (t.section === 'srodki' && t.item) return 'exercise';
  if (t.section === 'gramatyka' && t.item === 'test') return 'test';
  if (t.section === 'pisanie') return 'essay';
  if (t.section === 'fiszki') return 'deck';
  return 'manual';
};

/** Only work the site records with a time counts by itself; everything else the learner ticks off. */
export const autoCounted = (t: CourseTarget): boolean => targetKind(t) !== 'manual' && targetKind(t) !== 'deck';

export const sectionKey: Record<string, I18nKey> = {
  'opis-foto': 'tab.picture',
  gramatyka: 'tab.grammar',
  slownictwo: 'tab.vocabulary',
  srodki: 'tab.srodki',
  pisanie: 'tab.writing',
  fiszki: 'tab.flashcards',
};

export interface TargetLabel {
  topic: string;
  section: I18nKey;
  /** The text's title, the rule's title, "Test", or the exercise number with its language function. */
  item?: { text: string; key?: I18nKey; n?: number };
}

/** Pieces of a target's name; the component joins them with the UI dictionary. */
export const describeTarget = (t: CourseTarget): TargetLabel | undefined => {
  const module = allModules.find((m) => m.id === t.moduleId);
  if (!module) return undefined;
  const label: TargetLabel = { topic: module.titlePl, section: sectionKey[t.section] };
  if (!t.item) return label;
  if (t.section === 'slownictwo') {
    const text = vocabularyTextsByModule[t.moduleId]?.find((x) => x.id === t.item);
    if (text) label.item = { text: text.title };
  } else if (t.section === 'srodki') {
    const list = languageUseExercisesByModule[t.moduleId] ?? [];
    const i = list.findIndex((e) => e.id === t.item);
    if (i >= 0) label.item = { text: list[i].functionLabel, key: 'hw.exerciseN', n: i + 1 };
  } else if (t.section === 'gramatyka') {
    if (t.item === 'test') label.item = { text: '', key: 'hdr.test' };
    else {
      const rule = module.grammarRules.find((r) => r.id === t.item);
      if (rule) label.item = { text: rule.title };
    }
  }
  return label;
};

/** Every page of a module that can be set as homework, in the order of the tabs. */
export const moduleTargets = (moduleId: string): CourseTarget[] => {
  const module = allModules.find((m) => m.id === moduleId);
  if (!module) return [];
  return [
    { moduleId, section: 'opis-foto' },
    ...module.grammarRules.map((r): CourseTarget => ({ moduleId, section: 'gramatyka', item: r.id })),
    { moduleId, section: 'gramatyka', item: 'test' },
    ...(vocabularyTextsByModule[moduleId] ?? []).map((x): CourseTarget => ({ moduleId, section: 'slownictwo', item: x.id })),
    ...(languageUseExercisesByModule[moduleId] ?? []).map((e): CourseTarget => ({ moduleId, section: 'srodki', item: e.id })),
    { moduleId, section: 'pisanie' },
    { moduleId, section: 'fiszki' },
  ];
};
