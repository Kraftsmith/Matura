import type { SectionType } from './types';
import { allModules } from './data/modulesData';
import { vocabularyTextsByModule } from './data/vocabularyTexts';
import { languageUseExercisesByModule } from './data/languageUseExercises';
import { routeOf } from './userRoute';

/**
 * URL scheme: #<moduleId>/<section>[/<item>], e.g. #praca/opis-foto,
 * #czlowiek/slownictwo/czl-txt-2 (one text), #czlowiek/srodki/czl-sj-2 (one exercise), #czlowiek/gramatyka/test.
 * Also accepted: #<section> (default module), #<moduleId> (first tab), #design-system, #profile, #ustawienia (languages),
 * #dashboard/<studentId> (teacher looking at one learner, /fiszki opens their cards, /zadania their homework),
 * #powiadomienia (the notifications),
 * #fiszki (all decks), #fiszki/powtorka (review of all decks), #fiszki/<moduleId>[/<cardId>] (one deck),
 * #kalendarz[/<date>] (the teacher's week), #kalendarz/z/<lessonId> (one lesson), #zajecia (a learner's lessons and homework).
 * An empty hash opens the dashboard.
 */

export const moduleSections: SectionType[] = ['opis-foto', 'gramatyka', 'slownictwo', 'srodki', 'pisanie', 'fiszki'];
/** Section shown when a module is opened without an explicit section (the first tab). */
export const DEFAULT_SECTION: SectionType = moduleSections[0];
export const standaloneSections: SectionType[] = ['dashboard', 'fiszki-hub', 'design-system', 'profile', 'ustawienia', 'kalendarz', 'zajecia', 'powiadomienia'];
const validSections: SectionType[] = [...moduleSections, ...standaloneSections];
export const DEFAULT_MODULE = allModules[0].id;

/** Old links: the test used to be its own tab, now it lives at the bottom of the grammar section. */
const legacySections: Record<string, SectionType> = { test: 'gramatyka' };

/** Second segment of #fiszki: the review across all decks. No module has this id. */
export const REVIEW_ITEM = 'powtorka';
/** Item of a deck address: the deck opened on the cards from the teacher. */
export const TEACHER_FILTER_ITEM = 'od-nauczyciela';
/** Second segment of #kalendarz before a lesson id. */
const LESSON_SEGMENT = 'z';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface Route {
  moduleId: string;
  section: SectionType;
  /** Dashboard only: a learner's id when the teacher opens that learner's page. */
  viewUserId?: string;
  /** One item inside the section: a vocabulary text id, a grammar rule id, "test", an exercise id, a flashcard id or a calendar date. */
  item?: string;
  /** The deck was opened inside the Fiszki module, not from its topic. */
  fromHub?: boolean;
  /** Calendar only: the lesson open in the side panel. */
  lessonId?: string;
}

export const isStandalone = (s: SectionType) => standaloneSections.includes(s);
export const isModuleId = (id: string) => allModules.some((m) => m.id === id);

/** Keeps the item only if it exists in that module's section; unknown items fall back to the whole section. */
export const validItem = (moduleId: string, section: SectionType, item?: string): string | undefined => {
  if (!item) return undefined;
  if (section === 'slownictwo') return (vocabularyTextsByModule[moduleId] ?? []).some((t) => t.id === item) ? item : undefined;
  if (section === 'srodki') return (languageUseExercisesByModule[moduleId] ?? []).some((e) => e.id === item) ? item : undefined;
  if (section === 'gramatyka') {
    const module = allModules.find((m) => m.id === moduleId);
    return item === 'test' || module?.grammarRules.some((r) => r.id === item) ? item : undefined;
  }
  if (section === 'fiszki') {
    // Own and teacher's cards are not known here; FlashcardsView opens on the first card if the id is gone.
    const module = allModules.find((m) => m.id === moduleId);
    return item === TEACHER_FILTER_ITEM || /^[ut]-/.test(item) || module?.flashcards.some((c) => c.id === item) ? item : undefined;
  }
  return undefined;
};

export const parseHash = (hash: string): Route => {
  const raw = routeOf(hash);
  const [a, rawB, c] = raw.split('/');
  const b = rawB && legacySections[rawB] ? legacySections[rawB] : rawB;
  const isSection = (s: string): s is SectionType => validSections.includes(s as SectionType);

  if (!raw || a === 'dashboard') {
    // Whether this learner is in the class is known only after the server answers.
    return { moduleId: DEFAULT_MODULE, section: 'dashboard', viewUserId: b, item: b && (c === 'fiszki' || c === 'zadania') ? c : undefined };
  }
  if (a === 'fiszki') {
    if (b === REVIEW_ITEM) return { moduleId: DEFAULT_MODULE, section: 'fiszki-hub', item: REVIEW_ITEM };
    if (b && isModuleId(b)) return { moduleId: b, section: 'fiszki', fromHub: true, item: validItem(b, 'fiszki', c) };
    return { moduleId: DEFAULT_MODULE, section: 'fiszki-hub' };
  }
  if (a === 'kalendarz') {
    if (b === LESSON_SEGMENT && c && UUID.test(c)) return { moduleId: DEFAULT_MODULE, section: 'kalendarz', lessonId: c.toLowerCase() };
    return { moduleId: DEFAULT_MODULE, section: 'kalendarz', item: b && DATE.test(b) ? b : undefined };
  }
  if (a === 'zajecia') return { moduleId: DEFAULT_MODULE, section: 'zajecia' };
  if (a === 'design-system') return { moduleId: DEFAULT_MODULE, section: 'design-system' };
  if (a === 'profile') return { moduleId: DEFAULT_MODULE, section: 'profile' };
  if (isModuleId(a)) {
    const section = b && isSection(b) && !isStandalone(b) ? b : DEFAULT_SECTION;
    return { moduleId: a, section, item: validItem(a, section, c) };
  }
  const a2 = legacySections[a] ?? a;
  if (isSection(a2)) return { moduleId: DEFAULT_MODULE, section: a2 };
  return { moduleId: DEFAULT_MODULE, section: 'dashboard' };
};

export const toHash = (r: Route): string => {
  if (r.section === 'dashboard') return r.viewUserId ? `dashboard/${r.viewUserId}${r.item ? `/${r.item}` : ''}` : 'dashboard';
  if (r.section === 'fiszki-hub') return r.item ? `fiszki/${r.item}` : 'fiszki';
  if (r.section === 'kalendarz') return r.lessonId ? `kalendarz/${LESSON_SEGMENT}/${r.lessonId}` : r.item ? `kalendarz/${r.item}` : 'kalendarz';
  if (r.fromHub) return r.item ? `fiszki/${r.moduleId}/${r.item}` : `fiszki/${r.moduleId}`;
  if (isStandalone(r.section)) return r.section;
  return r.item ? `${r.moduleId}/${r.section}/${r.item}` : `${r.moduleId}/${r.section}`;
};

/* ---------- Addresses on the public site (Spec - Landing §3.1, rule 4) ---------- */

/** Where the app is served from on the shared host. */
export const APP_BASE = '/app/';

/** Sections whose public name differs from the app's: people search for "opis ilustracji", not "opis foto". */
const SITE_SECTION_SLUGS: Partial<Record<SectionType, string>> = { 'opis-foto': 'opis-ilustracji' };

export const siteSectionSlug = (section: SectionType): string => SITE_SECTION_SLUGS[section] ?? section;

/** The module section behind a public slug; undefined for anything that is not a module section. */
export const sectionFromSiteSlug = (slug: string): SectionType | undefined => moduleSections.find((s) => siteSectionSlug(s) === slug);

/** The same page inside the app: `/app/#czlowiek/srodki/czl-sj-2`. */
export const appUrl = (r: Route): string => `${APP_BASE}#${toHash(r)}`;

/**
 * The same page on the public site: `/tematy/czlowiek/srodki/czl-sj-2`. A module opened without a section
 * is the topic overview. Pages that exist only in the app (dashboard, calendar, profile) point into the app.
 */
export const siteUrl = (r: Route): string => {
  if (r.section === 'fiszki' && r.fromHub) return `/tematy/${r.moduleId}/fiszki`;
  if (isStandalone(r.section)) return appUrl(r);
  const base = `/tematy/${r.moduleId}`;
  if (r.section === DEFAULT_SECTION && !r.item) return base;
  const item = r.item && r.item !== TEACHER_FILTER_ITEM ? `/${r.item}` : '';
  return `${base}/${siteSectionSlug(r.section)}${item}`;
};

/**
 * The homework targets this page could satisfy, most specific first: a text page is also the whole Słownictwo
 * section, so homework for either shows its banner here. Undefined on pages that cannot be homework.
 */
export const pageTargets = (r: Route): string[] => {
  if (r.section === 'fiszki' && r.fromHub) return [`fiszki/${r.moduleId}`];
  if (isStandalone(r.section)) return [];
  const section = `${r.moduleId}/${r.section}`;
  if (r.section === 'fiszki') return [`fiszki/${r.moduleId}`, section];
  return r.item && r.item !== TEACHER_FILTER_ITEM ? [`${section}/${r.item}`, section] : [section];
};
