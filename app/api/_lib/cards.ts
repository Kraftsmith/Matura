const PARTS_OF_SPEECH = ['noun', 'verb', 'adjective', 'adverb', 'idiom', 'phrasal_verb', 'phrase'];
const MAX_FRONT = 100;
const MAX_FIELD = 500;

const CARD_ID = /^t-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isCardId = (id: string | undefined): id is string => CARD_ID.test(id ?? '');

const optional = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);
const fieldOk = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.length <= MAX_FIELD);

const TEXT_FIELDS = ['backMeaningPl', 'backMeaningRu', 'backMeaningEn', 'exampleSentence', 'exampleTranslation', 'exampleTranslationRu', 'category', 'sourceRef'];

export interface CardFields {
  front: string;
  partOfSpeech: string;
  meaningPl: string;
  meaningRu: string | null;
  meaningEn: string | null;
  example: string;
  examplePl: string | null;
  exampleRu: string | null;
  category: string;
  sourceRef: string | null;
}

/** Null when the body cannot become a card: every card needs a word and at least one meaning. */
export const parseCard = (body: Record<string, unknown> | null): CardFields | null => {
  if (!body || TEXT_FIELDS.some((f) => !fieldOk(body[f]))) return null;
  const front = optional(body.front);
  const category = optional(body.category);
  const partOfSpeech = body.partOfSpeech;
  if (!front || front.length > MAX_FRONT || !category) return null;
  if (typeof partOfSpeech !== 'string' || !PARTS_OF_SPEECH.includes(partOfSpeech)) return null;
  const meaningPl = optional(body.backMeaningPl);
  const meaningRu = optional(body.backMeaningRu);
  const meaningEn = optional(body.backMeaningEn);
  if (!meaningPl && !meaningRu && !meaningEn) return null;
  return {
    front,
    partOfSpeech,
    meaningPl: meaningPl ?? '',
    meaningRu,
    meaningEn,
    example: optional(body.exampleSentence) ?? '',
    examplePl: optional(body.exampleTranslation),
    exampleRu: optional(body.exampleTranslationRu),
    category,
    sourceRef: optional(body.sourceRef),
  };
};

/** Same rule as normalise in src/text.ts; the functions do not load the app's sources. */
const keyOf = (s: string) => s.toLowerCase().replace(/[-‐-―]/g, ' ').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

export const sameFront = (a: string, b: string) => keyOf(a) === keyOf(b);

export const toCard = (r: Record<string, unknown>) => ({
  id: r.id,
  studentId: r.user_id,
  moduleId: r.module_id,
  front: r.front,
  partOfSpeech: r.part_of_speech,
  backMeaningPl: r.meaning_pl,
  backMeaningRu: r.meaning_ru ?? undefined,
  backMeaningEn: r.meaning_en ?? undefined,
  exampleSentence: r.example,
  exampleTranslation: r.example_pl ?? undefined,
  exampleTranslationRu: r.example_ru ?? undefined,
  category: r.category,
  source: r.source,
  sourceRef: r.source_ref ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at ?? undefined,
});
