/**
 * Content of the site comes from the app's data (Spec - Landing §3.1, rule 1).
 * This module only reads it and derives counts, slugs and teasers.
 */
import { allModules } from '@app/data/modulesData';
import { vocabularyTextsByModule } from '@app/data/vocabularyTexts';
import { languageUseExercisesByModule } from '@app/data/languageUseExercises';
import { vocabularyExercisesByText } from '@app/data/vocabularyExercises';
import type { LanguageUseExercise, MaturaModule, VocabularyText } from '@app/types';
import { APP_PATH, isOpenModule, pricing } from '../../site.config';

export { allModules, vocabularyTextsByModule, languageUseExercisesByModule, vocabularyExercisesByText };

/** Sections of a topic as they appear in site addresses, in the order of the tabs. */
export const SITE_SECTIONS = ['slownictwo', 'srodki', 'gramatyka', 'opis-ilustracji', 'pisanie', 'fiszki'] as const;
export type SiteSection = (typeof SITE_SECTIONS)[number];

/** The app spells one section differently; everything else is the same id. */
export const appSectionOf = (s: SiteSection): string => (s === 'opis-ilustracji' ? 'opis-foto' : s);

export const SECTION_LABEL: Record<SiteSection, string> = {
  slownictwo: 'Słownictwo',
  srodki: 'Środki językowe',
  gramatyka: 'Gramatyka',
  'opis-ilustracji': 'Opis ilustracji',
  pisanie: 'Pisanie',
  fiszki: 'Fiszki',
};

export const topicPath = (moduleId: string, section?: SiteSection, item?: string): string =>
  `/tematy/${moduleId}${section ? `/${section}` : ''}${item ? `/${item}` : ''}`;

/** The same place inside the app. */
export const appHash = (moduleId: string, section?: SiteSection, item?: string): string =>
  `${moduleId}${section ? `/${appSectionOf(section)}` : ''}${item ? `/${item}` : ''}`;

export const appLink = (hash: string): string => `${APP_PATH}#${hash}`;
export const registerLink = (src: string, next?: string) => appLink(`register?src=${encodeURIComponent(src)}${next ? `&next=${encodeURIComponent(next)}` : ''}`);
export const loginLink = (next?: string) => appLink(`login${next ? `?next=${encodeURIComponent(next)}` : ''}`);

export const moduleById = (id: string): MaturaModule | undefined => allModules.find((m) => m.id === id);

export interface ModuleCounts {
  words: number;
  texts: number;
  exercises: number;
  rules: number;
  cards: number;
  testQuestions: number;
}

export const countsOf = (m: MaturaModule): ModuleCounts => ({
  words: m.vocabularyList.length,
  texts: (vocabularyTextsByModule[m.id] ?? []).length,
  exercises: (languageUseExercisesByModule[m.id] ?? []).length,
  rules: m.grammarRules.length,
  cards: m.flashcards.length,
  testQuestions: m.testQuestions.length,
});

/** Numbers the landing quotes ("56 ćwiczeń"): counted, never typed (Spec - Landing §9.3). */
export const totals = allModules.reduce(
  (acc, m) => {
    const c = countsOf(m);
    acc.words += c.words;
    acc.texts += c.texts;
    acc.exercises += c.exercises;
    acc.rules += c.rules;
    acc.cards += c.cards;
    return acc;
  },
  { topics: allModules.length, words: 0, texts: 0, exercises: 0, rules: 0, cards: 0 },
);

/** How a topic is offered: open on the site, free with an account, or paid. */
export type Access = 'open' | 'free-account' | 'paid';
export const accessOf = (moduleId: string): Access =>
  isOpenModule(moduleId) ? 'open' : pricing.freeAccountModules.includes(moduleId) ? 'free-account' : 'paid';

export const textsOf = (moduleId: string): VocabularyText[] => vocabularyTextsByModule[moduleId] ?? [];
export const exercisesOf = (moduleId: string): LanguageUseExercise[] => languageUseExercisesByModule[moduleId] ?? [];

export const EXERCISE_TYPE_LABEL: Record<LanguageUseExercise['type'], string> = {
  matching: 'Dopasowanie',
  'word-bank': 'Bank słów',
  'mini-dialogue': 'Minidialogi',
};

export const exerciseItemCount = (e: LanguageUseExercise): number => (e.type === 'matching' ? e.prompts.length : e.items.length);

/** Paragraphs in the data mark glossary terms with **term**; the site shows them as plain emphasis. */
export const paragraphHtml = (p: string): string =>
  escapeHtml(p).replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>');

export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export const stripMarks = (p: string): string => p.replace(/\*\*/g, '');

/** Neighbours for the "Dalej" block. */
export const neighbours = (moduleId: string): { prev?: MaturaModule; next?: MaturaModule } => {
  const i = allModules.findIndex((m) => m.id === moduleId);
  return { prev: allModules[i - 1], next: allModules[i + 1] };
};

/** Polish plural: plural(3, 'słowo', 'słowa', 'słów') → "3 słowa". */
export const plural = (n: number, one: string, few: string, many: string): string => {
  const form = n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;
  return `${n} ${form}`;
};

export const levelLabel = (level: 'P' | 'R' | 'P/R' | 'Podstawowy' | 'Rozszerzony'): string =>
  level === 'P' || level === 'Podstawowy' ? 'poziom podstawowy' : level === 'R' || level === 'Rozszerzony' ? 'poziom rozszerzony' : 'oba poziomy';
