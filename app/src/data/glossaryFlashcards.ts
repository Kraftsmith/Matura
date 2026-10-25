import type { Flashcard, GlossaryEntry, MaturaModule, VocabularyText } from '../types';
import { vocabularyTextsByModule } from './vocabularyTexts';

/** Lower-case, hyphens as spaces, single spaces: "screen-time" and "Screen time" compare equal. */
const normalise = (s: string) => s.toLowerCase().replace(/[-‐-―]/g, ' ').replace(/\s+/g, ' ').trim();

const STOP_WORDS = new Set(['a', 'an', 'the', 'your', 'his', 'her', 'be', 'in', 'of', 'to', 'on', 'some', 'something']);

/** Score how well a bold phrase from the text matches a glossary term; word stems are compared so "shrugged" matches "shrug". */
const matchScore = (term: string, bold: string) => {
  if (normalise(term) === normalise(bold)) return 2;
  const boldWords = normalise(bold).split(' ');
  const termWords = normalise(term).split(' ').filter((w) => !STOP_WORDS.has(w));
  if (termWords.length === 0) return normalise(term) === normalise(bold) ? 1 : 0;
  const hits = termWords.filter((tw) => {
    const stem = tw.slice(0, Math.max(3, tw.length - 2));
    return boldWords.some((bw) => bw.startsWith(stem) || tw.startsWith(bw.slice(0, Math.max(3, bw.length - 2))));
  }).length;
  return hits / termWords.length;
};

/** The sentence of the text in which the term is highlighted, with the ** markers removed. */
const exampleFor = (term: string, text: VocabularyText): string => {
  let best: { score: number; sentence: string } | null = null;
  for (const paragraph of text.paragraphs) {
    const sentences = paragraph.split(/(?<=[.!?]["”']?)\s+(?=["“']?(?:\*\*)?[A-Z])/);
    for (const sentence of sentences) {
      for (const m of sentence.matchAll(/\*\*([^*]+)\*\*/g)) {
        const score = matchScore(term, m[1]);
        if (score > 0 && (!best || score > best.score)) best = { score, sentence };
      }
    }
  }
  return (best?.sentence ?? text.paragraphs[0]).replace(/\*\*/g, '');
};

const toFlashcard = (entry: GlossaryEntry, text: VocabularyText, index: number): Flashcard => ({
  id: `${text.id}-g${index + 1}`,
  front: entry.term,
  partOfSpeech: entry.pos,
  backMeaningPl: entry.polish ?? '',
  backMeaningRu: entry.russian,
  backMeaningEn: entry.definition,
  exampleSentence: exampleFor(entry.term, text),
  category: text.subtopic,
});

/**
 * Every key word from the module's "Słownictwo" texts becomes a flashcard in the module deck,
 * after the hand-written cards, unless a card with the same front already exists.
 */
export const withGlossaryFlashcards = (module: MaturaModule): MaturaModule => {
  const texts = vocabularyTextsByModule[module.id] ?? [];
  if (texts.length === 0) return module;
  const seen = new Set(module.flashcards.map((c) => normalise(c.front)));
  const extra: Flashcard[] = [];
  for (const text of texts) {
    text.glossary.forEach((entry, i) => {
      const key = normalise(entry.term);
      if (seen.has(key)) return;
      seen.add(key);
      extra.push(toFlashcard(entry, text, i));
    });
  }
  return extra.length === 0 ? module : { ...module, flashcards: [...module.flashcards, ...extra] };
};
