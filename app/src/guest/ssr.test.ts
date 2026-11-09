// The section components are rendered to HTML at build time for the public site, in Node, without a browser.
// Each of them must produce the page's content and none of them may touch window while rendering.
import { createElement, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GuestProviders } from './GuestProviders';
import { VocabularyView } from '../components/VocabularyView';
import { LanguageUseView } from '../components/language-use/LanguageUseView';
import { GrammarSectionView } from '../components/GrammarSectionView';
import { PictureDescriptionView } from '../components/PictureDescriptionView';
import { WritingTrainerView } from '../components/WritingTrainerView';
import { FlashcardsView } from '../components/FlashcardsView';
import { allModules } from '../data/modulesData';
import { vocabularyTextsByModule } from '../data/vocabularyTexts';
import { languageUseExercisesByModule } from '../data/languageUseExercises';
import { deckOf } from '../decks';

const MODULE_ID = 'czlowiek';
const module = allModules.find((m) => m.id === MODULE_ID)!;
const texts = vocabularyTextsByModule[MODULE_ID];
const exercises = languageUseExercisesByModule[MODULE_ID];

const render = (child: ReactNode) => renderToString(createElement(GuestProviders, { allowedModules: [MODULE_ID] }, child));

const explanationOf = () => {
  for (const e of exercises) {
    if (e.type === 'mini-dialogue') return e.items[0].explanation.pl;
    if (e.type === 'matching' && e.explanations) return Object.values(e.explanations)[0].pl;
  }
  throw new Error('no explanation in the data');
};

describe('section components rendered to HTML without a browser', () => {
  it('słownictwo: the texts and their words', () => {
    const html = render(createElement(VocabularyView, { moduleId: MODULE_ID, texts, vocabulary: module.vocabularyList, moduleTitle: module.titlePl, teacherSignedIn: false }));
    expect(html).toContain(texts[0].title);
    expect(html).toContain(texts[0].glossary[0].term);
  });

  it('słownictwo: one text on its own page', () => {
    const html = render(createElement(VocabularyView, { moduleId: MODULE_ID, texts, textId: texts[1].id, vocabulary: module.vocabularyList, moduleTitle: module.titlePl }));
    expect(html).toContain(texts[1].title);
    expect(html).not.toContain(texts[0].title);
  });

  it('środki językowe: the tasks, but not their explanations', () => {
    const html = render(createElement(LanguageUseView, { moduleId: MODULE_ID, exercises, moduleTitle: module.titlePl, onResult: () => {} }));
    expect(html).toContain(exercises[0].instruction);
    expect(html).not.toContain(explanationOf());
  });

  it('gramatyka: the rules and the test', () => {
    const html = render(createElement(GrammarSectionView, { moduleId: MODULE_ID, rules: module.grammarRules, questions: module.testQuestions, moduleTitle: module.titlePl }));
    expect(html).toContain(module.grammarRules[0].title);
    expect(html).toContain(module.testQuestions[0].prompt.slice(0, 30));
    expect(html).not.toContain(module.testQuestions[0].explanation);
  });

  it('opis ilustracji: the steps', () => {
    const html = render(createElement(PictureDescriptionView, { moduleId: MODULE_ID, data: module.pictureDescription, moduleTitle: module.titlePl }));
    expect(html).toContain(module.pictureDescription.steps[0].stepName);
  });

  it('pisanie: the task', () => {
    const html = render(createElement(WritingTrainerView, { moduleId: MODULE_ID, prompt: module.writingPrompt, moduleTitle: module.titlePl }));
    expect(html).toContain(module.writingPrompt.title);
  });

  it('fiszki: the first card', () => {
    const cards = deckOf(module);
    const html = render(createElement(FlashcardsView, { cards, moduleTitle: module.titlePl, moduleId: MODULE_ID, masteredIds: new Set<string>(), reviewIds: new Set<string>(), onCardStatus: () => {} }));
    expect(html).toContain(cards[0].front);
  });
});
