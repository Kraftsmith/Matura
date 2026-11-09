import React, { useEffect, useState } from 'react';
import type { GapFillItem, GlossaryEntry as GlossaryEntryData, VocabularyItem, VocabularyText } from '../types';
import { Volume2, ImageIcon, MessageCircle, Languages, Maximize2, ChevronDown, ChevronUp, PenLine, RotateCcw, Eye, CheckCircle2, ArrowLeft, Plus, Check } from 'lucide-react';
import { Button, Chip, InlineInput, SectionTitle } from './ui';
import { ImageLightbox } from './ImageLightbox';
import { useSettings } from '../useSettings';
import { vocabularyExercisesByText } from '../data/vocabularyExercises';
import { useProgress } from '../useProgress';
import type { GapWork } from '../progress-context';
import { isGapCorrect } from '../languageUse';
import { SaveWork } from './SaveWork';
import { CopyLinkButton } from './CopyLinkButton';
import { LessonBar } from './LessonBar';
import { SelectionCardBar } from './SelectionCardBar';
import { speak } from '../speech';
import { useAddFlashcard, useFlashcardDialog } from '../useAddFlashcard';

/** Gap-fill sentences under a text: type the key word, check, see the answers, try again. */
const GapFillExercise: React.FC<{ moduleId: string; textId: string; items: GapFillItem[] }> = ({ moduleId, textId, items }) => {
  const { t } = useSettings();
  const { getModule, updateModule } = useProgress();
  const saved = getModule(moduleId).gapWork?.[textId];
  const values = items.map((_, i) => saved?.values[i] ?? '');
  const checked = saved?.checked ?? false;
  const [bankOpen, setBankOpen] = useState(false);

  const correctCount = items.filter((item, i) => isGapCorrect(item, values[i])).length;
  const wordBank = [...new Set(items.map((item) => item.answer))].sort((a, b) => a.localeCompare(b));

  const save = (patch: Partial<GapWork>) =>
    updateModule(moduleId, (m) => ({
      ...m,
      gapWork: {
        ...m.gapWork,
        [textId]: { values: [], checked: false, ...m.gapWork?.[textId], ...patch, at: new Date().toISOString() },
      },
    }));

  const check = () => {
    const attempted = values.some((v) => v.trim());
    save({ checked: true, best: attempted ? Math.max(saved?.best ?? 0, correctCount) : saved?.best });
  };
  const reset = () => save({ values: [], checked: false, revealed: false });
  const reveal = () => save({ values: items.map((item) => item.answer), checked: true, revealed: true });

  return (
    <section className="grid gap-3 border-t border-line-soft pt-5" aria-labelledby={`${textId}-practice`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 id={`${textId}-practice`} className="flex items-center gap-2 text-base leading-6 font-semibold">
          <PenLine className="h-5 w-5 text-primary" />
          {t('vocab.practice')}
        </h4>
        {checked && (
          <Chip tone={correctCount === items.length ? 'success' : 'primary'}>
            {correctCount === items.length && <CheckCircle2 className="h-4 w-4" />}
            {correctCount} / {items.length}
          </Chip>
        )}
      </div>
      <p className="text-sm leading-5 text-ink-2">{t('vocab.practiceHint')}</p>

      <ol className="grid gap-3">
        {items.map((item, i) => {
          const [before, after] = item.sentence.split('___');
          const correct = isGapCorrect(item, values[i]);
          const state = !checked ? 'idle' : correct ? 'correct' : 'wrong';
          return (
            <li key={item.sentence} className="text-base leading-7 text-ink">
              <span className="mr-1.5 tabular-nums text-ink-3">{i + 1}.</span>
              {before}
              <InlineInput
                value={values[i]}
                state={state}
                disabled={checked}
                aria-label={`${t('vocab.gapLabel')} ${i + 1}`}
                autoComplete="off"
                spellCheck={false}
                className="mx-1 my-0.5 align-baseline"
                onChange={(e) => save({ values: values.map((v, j) => (j === i ? e.target.value : v)) })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') check();
                }}
              />
              {after}
              {checked && !correct && (
                <span className="ml-2 text-sm font-semibold text-success">
                  {t('vocab.answer')}: {item.answer}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        {checked ? (
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            {t('vocab.tryAgain')}
          </Button>
        ) : (
          <Button size="sm" onClick={check}>
            {t('vocab.check')}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={reveal} disabled={checked && correctCount === items.length}>
          <Eye className="h-4 w-4" />
          {t('vocab.showAnswers')}
        </Button>
        <Button size="sm" variant={bankOpen ? 'secondary' : 'ghost'} onClick={() => setBankOpen((o) => !o)} aria-pressed={bankOpen}>
          {t('vocab.wordBank')}
        </Button>
        <SaveWork active={!!saved && !saved.revealed && values.some((v) => v.trim())} className="ml-auto" />
      </div>

      {bankOpen && (
        <div className="flex flex-wrap gap-1.5">
          {wordBank.map((w) => (
            <Chip key={w} size="sm">{w}</Chip>
          ))}
        </div>
      )}
    </section>
  );
};

interface VocabularyViewProps {
  moduleId: string;
  texts: VocabularyText[];
  /** When set, only this text is shown: its own page, the one to send as homework. */
  textId?: string;
  vocabulary: VocabularyItem[];
  moduleTitle: string;
  /** The server confirmed the teacher, so they can add cards for a learner. */
  teacherSignedIn?: boolean;
}

/** Renders a paragraph, turning **term** into a highlighted key word. */
const Paragraph: React.FC<{ text: string; textId: string }> = ({ text, textId }) => {
  const parts = text.split('**');
  return (
    <p data-card-text={textId} className="text-base leading-7 text-ink">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-primary-tint px-0.5 font-semibold text-primary-hover">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </p>
  );
};

/** The illustration, or a quiet placeholder until the file arrives in /public/images/vocab. */
const Illustration: React.FC<{ src: string; alt: string; onOpen: () => void }> = ({ src, alt, onOpen }) => {
  const [failed, setFailed] = useState(false);
  const { t } = useSettings();
  if (failed) {
    return (
      <div className="flex aspect-[3/1] w-full flex-col items-center justify-center gap-2 bg-hero px-6 text-center">
        <ImageIcon className="h-8 w-8 text-ink-3" />
        <p className="text-sm leading-5 font-semibold text-ink-2">{t('vocab.placeholder')}</p>
        <p className="max-w-[48ch] text-xs leading-4 text-ink-3">{alt}</p>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      title={t('vocab.enlargeHint')}
      aria-label={t('vocab.enlargeHint')}
      className="group relative block w-full cursor-zoom-in bg-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
    >
      <img src={src} alt={alt} onError={() => setFailed(true)} className="aspect-[3/2] w-full object-cover" />
      <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-ink/70 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        <Maximize2 className="h-3.5 w-3.5" />
        {t('vocab.enlarge')}
      </span>
    </button>
  );
};

/** A word that is already in the deck: the way to its card. */
const InDeckLink: React.FC<{ moduleId: string; cardId: string }> = ({ moduleId, cardId }) => {
  const { t } = useSettings();
  return (
    <a
      href={`#${moduleId}/fiszki/${cardId}`}
      className="grid h-6 w-6 shrink-0 place-items-center rounded text-success hover:bg-primary-tint"
      title={t('add.inDeck')}
      aria-label={t('add.inDeck')}
    >
      <Check className="h-4 w-4" />
    </a>
  );
};

/** One glossary line. The translation stays hidden until asked for, so the learner tries the English definition first. */
const GlossaryEntry: React.FC<{ entry: GlossaryEntryData; showTranslations: boolean }> = ({ entry, showTranslations }) => {
  const { tr, t } = useSettings();
  const [open, setOpen] = useState(false);
  const translation = tr(entry.polish, entry.russian);
  const shown = showTranslations || open;
  return (
    <div className="min-w-0">
      <dt className="text-base leading-6 font-semibold text-ink">{entry.term}</dt>
      <dd className="text-sm leading-5 text-ink-2">{entry.definition}</dd>
      {translation && shown && <dd className="text-sm leading-5 text-ink-3 italic">{translation}</dd>}
      {translation && !showTranslations && (
        <dd>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-0.5 inline-flex cursor-pointer items-center gap-1 text-xs leading-4 text-primary hover:underline"
          >
            <Languages className="h-3 w-3" />
            {open ? t('vocab.hideTranslation') : t('vocab.showTranslation')}
          </button>
        </dd>
      )}
    </div>
  );
};

interface TextCardProps {
  moduleId: string;
  text: VocabularyText;
  route: string;
  showTranslations: boolean;
  targetUserId?: string;
}

const TextCard: React.FC<TextCardProps> = ({ moduleId, text, route, showTranslations, targetUserId }) => {
  const add = useAddFlashcard(moduleId, targetUserId);
  const [lightbox, setLightbox] = useState(false);

  return (
    <article className="overflow-hidden card">
      <Illustration src={text.image.src} alt={text.image.alt} onOpen={() => setLightbox(true)} />
      <ImageLightbox isOpen={lightbox} src={text.image.src} alt={text.image.alt} caption={text.image.alt} onClose={() => setLightbox(false)} />

      <div className="grid gap-5 p-6 sm:p-8">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
            <Chip size="sm" tone="primary">{text.subtopic}</Chip>
            <span>Level {text.level === 'R' ? 'B2 (rozszerzony)' : 'B1+ (podstawowy)'}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl leading-8 font-semibold">
              <a href={`#${route}`} className="hover:text-primary hover:underline">
                {text.title}
              </a>
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              <CopyLinkButton rest={route} />
              <Button variant="secondary" size="sm" onClick={() => speak(text.paragraphs.join(' '))} title="Listen to the text">
                <Volume2 className="h-4 w-4" />
                Listen
              </Button>
            </div>
          </div>
        </div>

        <div className="grid max-w-[72ch] gap-4">
          {text.paragraphs.map((p, i) => (
            <Paragraph key={i} text={p} textId={text.id} />
          ))}
        </div>

        <section className="grid gap-3 border-t border-line-soft pt-5">
          <h4 className="text-base leading-6 font-semibold">Key vocabulary</h4>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {text.glossary.map((g) => {
              const cardId = add.cardIdFor(g.term);
              return (
              <div key={g.term} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2 border-b border-line-soft py-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <button
                  type="button"
                  onClick={() => speak(g.term)}
                  className="mt-0.5 grid h-6 w-6 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary"
                  title="Listen"
                  aria-label={`Listen: ${g.term}`}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <GlossaryEntry entry={g} showTranslations={showTranslations} />
                {cardId && <InDeckLink moduleId={moduleId} cardId={cardId} />}
              </div>
              );
            })}
          </dl>
        </section>

        {vocabularyExercisesByText[text.id] && (
          <GapFillExercise moduleId={moduleId} textId={text.id} items={vocabularyExercisesByText[text.id].items} />
        )}

        <section className="grid gap-2 rounded-lg border border-line border-l-4 border-l-primary bg-surface px-5 py-4">
          <h4 className="flex items-center gap-2 text-base leading-6 font-semibold">
            <MessageCircle className="h-5 w-5 text-primary" />
            Talk about it
          </h4>
          <ol className="grid list-decimal gap-1 pl-5 text-base leading-6 text-ink">
            {text.talkAbout.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

export const VocabularyView: React.FC<VocabularyViewProps> = ({ moduleId, texts, textId, vocabulary, moduleTitle, teacherSignedIn = false }) => {
  const { tr, t } = useSettings();
  const { lessonStudent, chooseStudent } = useFlashcardDialog();
  const add = useAddFlashcard(moduleId, lessonStudent);
  const sectionRoute = `${moduleId}/slownictwo`;
  const focused = textId ? texts.find((x) => x.id === textId) : undefined;

  // Opening a single text (or going back to all of them) starts at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [textId]);
  const [showTranslations, setShowTranslations] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const sortedList = [...vocabulary].sort((a, b) => a.english.localeCompare(b.english));

  return (
    <div className="grid gap-8 py-6">
      {teacherSignedIn && <LessonBar student={lessonStudent} onChoose={chooseStudent} />}
      <SelectionCardBar moduleId={moduleId} texts={texts} targetUserId={lessonStudent} />
      <SectionTitle
        title={`${t('vocab.title')}: ${moduleTitle}`}
        description={`${texts.length} ${texts.length === 1 ? 'text' : 'texts'} on the CKE subtopics of this module. Read, listen, learn the highlighted words, then answer the questions aloud.`}
        action={
          <Button
            variant={showTranslations ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowTranslations((v) => !v)}
            aria-pressed={showTranslations}
            title={t('vocab.translationsHint')}
          >
            <Languages className="h-4 w-4" />
            {t('vocab.translations')}
          </Button>
        }
      />

      {focused ? (
        <div className="grid gap-4">
          <a href={`#${sectionRoute}`} className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            {t('vocab.allTexts')} ({texts.length})
          </a>
          <TextCard moduleId={moduleId} text={focused} route={`${sectionRoute}/${focused.id}`} showTranslations={showTranslations} targetUserId={lessonStudent} />
        </div>
      ) : texts.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-base leading-6 font-semibold text-ink">Texts for this module are coming soon.</p>
          <p className="mt-1 text-sm leading-5 text-ink-2">Use the flashcards and the word list below in the meantime.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {texts.map((t) => (
            <TextCard key={t.id} moduleId={moduleId} text={t} route={`${sectionRoute}/${t.id}`} showTranslations={showTranslations} targetUserId={lessonStudent} />
          ))}
        </div>
      )}

      {!focused && sortedList.length > 0 && (
        <section className="overflow-hidden card">
          <button
            type="button"
            onClick={() => setListOpen((o) => !o)}
            aria-expanded={listOpen}
            className="flex w-full cursor-pointer items-center justify-between gap-3 px-6 py-4 text-left hover:bg-hero"
          >
            <span>
              <span className="block text-base leading-6 font-semibold text-ink">Word list A–Z</span>
              <span className="block text-sm leading-5 text-ink-2">{sortedList.length} {sortedList.length === 1 ? 'word or phrase' : 'words and phrases'} with example sentences</span>
            </span>
            {listOpen ? <ChevronUp className="h-5 w-5 text-ink-2" /> : <ChevronDown className="h-5 w-5 text-ink-2" />}
          </button>
          {listOpen && (
            <ul className="border-t border-line-soft">
              {sortedList.map((item) => {
                const cardId = add.cardIdFor(item.english);
                return (
                <li key={item.id} className="grid gap-1 border-b border-line-soft px-6 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-6 font-semibold text-ink">{item.english}</span>
                      <Chip size="sm">{item.level}</Chip>
                      <button
                        type="button"
                        onClick={() => speak(item.english)}
                        className="grid h-6 w-6 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary"
                        title="Listen"
                        aria-label={`Listen: ${item.english}`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      {cardId ? (
                        <InDeckLink moduleId={moduleId} cardId={cardId} />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            add.open({
                              front: item.english,
                              backMeaningPl: item.polish,
                              backMeaningRu: item.russian,
                              exampleSentence: item.example,
                              category: item.category,
                              source: 'slownictwo-list',
                            })
                          }
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary"
                          title={t('add.toCards')}
                          aria-label={`${t('add.toCards')}: ${item.english}`}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-5 text-ink-2 italic">"{item.example}"</p>
                    {showTranslations && <p className="text-sm leading-5 text-ink-3">{tr(item.polish, item.russian)}</p>}
                  </div>
                  <span className="text-xs leading-4 text-ink-3">{item.category}</span>
                </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};
