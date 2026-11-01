/** Lower-case, single-spaced, hyphens treated as spaces, so "rip-off" and "Rip off" both match. */
export const normalise = (s: string) => s.toLowerCase().replace(/[-‐-―]/g, ' ').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

/** Splits a paragraph into sentences; the ** markers of key words may stand at a sentence start. */
export const splitSentences = (paragraph: string): string[] => paragraph.split(/(?<=[.!?]["”']?)\s+(?=["“']?(?:\*\*)?[A-Z])/);

const EDGES = /^[\s.,;:!?"“”„'’()]+|[\s.,;:!?"“”„'’()]+$/g;

/** Selected text without line breaks, surrounding spaces and punctuation. */
export const cleanSelection = (raw: string): string => raw.replace(/\s+/g, ' ').replace(EDGES, '');

const MAX_LENGTH = 60;
const MAX_WORDS = 6;

/** Longer selections are sentences, not words to learn. */
export const fitsOnCard = (phrase: string): boolean => phrase.length > 0 && phrase.length <= MAX_LENGTH && phrase.split(' ').length <= MAX_WORDS;

/** The sentence of a paragraph that holds the phrase. */
export const sentenceWith = (paragraph: string, phrase: string): string => splitSentences(paragraph).find((s) => s.includes(phrase))?.trim() ?? '';

/** "Scruffy clothes" at the start of a sentence becomes "scruffy clothes"; "I" and "UK" stay as they are. */
export const lowerSentenceStart = (phrase: string, sentence: string): string => {
  const firstWord = phrase.split(' ')[0];
  const opensSentence = sentence.replace(/^["“']/, '').startsWith(phrase);
  return opensSentence && firstWord !== 'I' && !/^.[A-Z]/.test(firstWord) ? phrase[0].toLowerCase() + phrase.slice(1) : phrase;
};

/** A single word with an ending that often marks an inflected form, so the dialog can suggest the base form. */
export const looksInflected = (phrase: string): boolean => !phrase.includes(' ') && phrase.length > 3 && /(?:ed|ing|[^s]s)$/i.test(phrase);
