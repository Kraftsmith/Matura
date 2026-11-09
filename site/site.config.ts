/**
 * Everything about the site that is a decision, not content: the name, the addresses, the exam facts
 * with their sources, the open topics. Content itself comes from ../app/src/data (Spec - Landing §3.1).
 */

/** Product name. Placeholder until the owner decides (Spec - Landing §18, question 1). */
export const SITE_NAME = 'Matura Angielski';

/** Public origin of the site; the app is served under /app/ on the same host. */
export const SITE_URL = import.meta.env.SITE_URL ?? 'https://maturaenglish.pl';
export const APP_PATH = '/app/';

/** Topics open in full on the site, without an account. Adding an id here publishes all of its pages. */
export const openModules: readonly string[] = ['czlowiek'];
export const isOpenModule = (id: string) => openModules.includes(id);

/** The exam the countdown and the "terminy" page talk about. */
export const matura = {
  year: 2027,
  /** CKE publishes the timetable about a year ahead; until then the chip says "w maju". */
  dateConfirmed: false,
  /** ISO date of the written exam in English at the basic level, when confirmed. */
  writtenDate: '2027-05-06',
  month: 'maj',
};

export interface ExamFact {
  /** What the number is; shown in the footnote. */
  label: string;
  value: string;
  /** Official CKE document the number comes from. */
  source: string;
  sourceUrl: string;
  /** "stan na": when the fact was last checked against the source. */
  checkedOn: string;
}

const INFORMATOR = {
  source: 'Informator o egzaminie maturalnym z języka angielskiego od roku szkolnego 2022/2023 (CKE)',
  sourceUrl: 'https://cke.gov.pl/egzamin-maturalny/egzamin-maturalny-w-formule-2023/informatory/',
  checkedOn: '2026-11-09',
};

/**
 * Numbers about the exam, each with its source. Nothing about the exam is typed into a page directly:
 * pages render <Fact id="…" /> so that one change here updates every page (Spec - Landing §7.2).
 */
export const examFacts = {
  ppMinutes: { label: 'Czas części pisemnej, poziom podstawowy', value: '120 minut', ...INFORMATOR },
  prMinutes: { label: 'Czas części pisemnej, poziom rozszerzony', value: '150 minut', ...INFORMATOR },
  ppPoints: { label: 'Punkty w części pisemnej, poziom podstawowy', value: '60', ...INFORMATOR },
  ppListening: { label: 'Rozumienie ze słuchu, poziom podstawowy', value: '15 pkt', ...INFORMATOR },
  ppReading: { label: 'Rozumienie tekstów pisanych, poziom podstawowy', value: '20 pkt', ...INFORMATOR },
  ppLanguage: { label: 'Znajomość środków językowych, poziom podstawowy', value: '13 pkt', ...INFORMATOR },
  ppWriting: { label: 'Wypowiedź pisemna, poziom podstawowy', value: '12 pkt', ...INFORMATOR },
  prPoints: { label: 'Punkty w części pisemnej, poziom rozszerzony', value: '60', ...INFORMATOR },
  passThreshold: { label: 'Próg zdania (poziom podstawowy i część ustna)', value: '30%', ...INFORMATOR },
  oralMinutes: { label: 'Czas części ustnej', value: 'około 15 minut', ...INFORMATOR },
  oralPoints: { label: 'Punkty w części ustnej', value: '30', ...INFORMATOR },
  oralTasks: { label: 'Zadania w części ustnej', value: '3 zadania i rozmowa wstępna', ...INFORMATOR },
  ppWritingWords: { label: 'Długość wypowiedzi pisemnej, poziom podstawowy', value: '80–130 słów', ...INFORMATOR },
  prWritingWords: { label: 'Długość wypowiedzi pisemnej, poziom rozszerzony', value: '200–250 słów', ...INFORMATOR },
  topics: { label: 'Zakresy tematyczne w podstawie programowej', value: '14', ...INFORMATOR },
} satisfies Record<string, ExamFact>;

export type ExamFactId = keyof typeof examFacts;

/** Prices are placeholders until the owner decides (Spec - Landing §18, question 4). */
export const pricing = {
  currency: 'zł',
  /** Null means "not announced": the page shows "wkrótce" and the waiting list instead of a price. */
  monthly: null as number | null,
  untilMatura: null as number | null,
  /** Topics a free account gets in full on top of the open ones (Spec - Landing §18, question 3). */
  freeAccountModules: ['czlowiek', 'edukacja'],
};

/** Social accounts, Polish ones first; empty strings hide the link. */
export const social = {
  tiktok: '',
  instagram: '',
  youtube: '',
};

export const CONTACT_EMAIL = 'kontakt@example.com';
