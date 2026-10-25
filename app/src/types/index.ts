export type TranslationLang = 'pl' | 'ru';

export type SectionType =
  | 'dashboard'
  | 'fiszki'
  | 'opis-foto'
  | 'gramatyka' 
  | 'slownictwo' 
  | 'pisanie'
  | 'design-system';

export interface Flashcard {
  id: string;
  front: string; // Target word or phrase
  phonetic?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrasal_verb';
  backMeaningPl: string; // Polish translation
  backMeaningRu?: string; // Russian translation
  backMeaningEn: string; // English definition
  exampleSentence: string; // Example in English
  exampleTranslation?: string; // Example in Polish
  exampleTranslationRu?: string; // Example in Russian
  derivatives?: string[]; // Word family: [unreliable, reliably, reliance]
  collocations?: string[]; // E.g. [high-spirited, quick-tempered]
  category: string; // Subtopic (e.g. Cechy charakteru, Wygląd)
}

export type QuestionType = 
  | 'multiple-choice'
  | 'word-formation'
  | 'key-word-transformation'
  | 'translation'
  | 'mini-dialogue';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  prompt: string; // Instruction or context
  sentencePrefix?: string;
  sentenceSuffix?: string;
  targetWord?: string; // For word formation (BASE_WORD) or key word transformation (KEY)
  options?: string[]; // For multiple choice
  correctAnswers: string[]; // Possible correct strings (case-insensitive trimmed)
  explanation: string; // Detailed pedagogical explanation
  grammarRef?: {
    topic: string;
    /** Id of the GrammarRule in the same module that this task checks. */
    ruleId?: string;
    sectionUrl?: string;
  };
  level: 'Podstawowy' | 'Rozszerzony';
}

export interface PhotoQuestion {
  questionNumber: number;
  questionText: string;
  questionTextPl: string;
  questionTextRu?: string;
  hints: string[];
  modelAnswer: string;
  usefulPhrases: string[];
}

export interface PhotoDescriptionStep {
  stepName: string;
  stepNamePl: string;
  stepNameRu?: string;
  description: string;
  recommendedPhrases: string[];
  modelExample: string;
}

export interface PictureDescriptionData {
  imageSrc: string;
  imageAlt: string;
  title: string;
  situation: string;
  steps: PhotoDescriptionStep[];
  examQuestions: PhotoQuestion[];
  fullModelAnswer: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  level: 'P' | 'R' | 'P/R';
  ruleSummary: string;
  formula?: string;
  examples: {
    english: string;
    polish: string;
    russian?: string;
    note?: string;
  }[];
  maturaTrap?: string;
}

export interface VocabularyItem {
  id: string;
  english: string;
  polish: string;
  russian?: string;
  category: string;
  level: 'P' | 'R';
  example: string;
}

export interface WritingPrompt {
  type: 'E-mail' | 'Wpis na blogu' | 'Rozprawka' | 'Artykuł';
  level: 'Podstawowy' | 'Rozszerzony';
  title: string;
  taskPrompt: string;
  wordLimit: {
    min: number;
    max: number;
  };
  bulletPoints: string[];
  usefulPhrases: string[];
  samplePlan: string[];
  modelAnswer: string;
}

export interface MaturaModule {
  id: string;
  number: number;
  titlePl: string;
  titleEn: string;
  shortDescription: string;
  iconName: string;
  badge: 'B1+' | 'B2' | 'B2+';
  subtopics: string[];
  grammarSummary: string;
  flashcards: Flashcard[];
  pictureDescription: PictureDescriptionData;
  testQuestions: TestQuestion[];
  grammarRules: GrammarRule[];
  vocabularyList: VocabularyItem[];
  writingPrompt: WritingPrompt;
}


/** One key word or phrase from a topic text, explained in English; translations are optional extras. */
export interface GlossaryEntry {
  term: string;
  definition: string;
  polish?: string;
  russian?: string;
}

/** A short English reading text with an illustration, built around one CKE subtopic. */
export interface VocabularyText {
  id: string;
  title: string;
  subtopic: string;
  level: 'P' | 'R';
  image: {
    /** Path under /public; the illustration itself is produced separately (see Spec/Illustrations brief). */
    src: string;
    alt: string;
  };
  /** Paragraphs in English. Glossary terms are wrapped in double asterisks: **term**. */
  paragraphs: string[];
  glossary: GlossaryEntry[];
  /** Speaking prompts in English, to practise the vocabulary. */
  talkAbout: string[];
}

/** One gap-fill sentence; the gap is written as ___ and takes a word or phrase from the text. */
export interface GapFillItem {
  sentence: string;
  answer: string;
  /** Other spellings or forms that also count as correct. */
  alternatives?: string[];
}

/** The practice exercise under a topic text: sentences to complete with the key vocabulary. */
export interface VocabularyExercise {
  items: GapFillItem[];
}
