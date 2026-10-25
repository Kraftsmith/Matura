import React, { useState } from 'react';
import type { GapFillItem, VocabularyItem, VocabularyText } from '../types';
import { Volume2, ImageIcon, MessageCircle, Languages, Maximize2, ChevronDown, ChevronUp, PenLine, RotateCcw, Eye, CheckCircle2 } from 'lucide-react';
import { Button, Chip, InlineInput, SectionTitle } from './ui';
import { ImageLightbox } from './ImageLightbox';
import { useSettings } from '../useSettings';
import { vocabularyExercisesByText } from '../data/vocabularyExercises';

/** Lower-case, single-spaced, hyphens treated as spaces, so "rip-off" and "Rip off" both match. */
const normalise = (s: string) => s.toLowerCase().replace(/[-‐-―]/g, ' ').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

const isGapCorrect = (item: GapFillItem, value: string) => {
  const v = normalise(value);
  return v.length > 0 && [item.answer, ...(item.alternatives ?? [])].some((a) => normalise(a) === v);
};

/** Gap-fill sentences under a text: type the key word, check, see the answers, try again. */
const GapFillExercise: React.FC<{ textId: string; items: GapFillItem[] }> = ({ textId, items }) => {
  const { t } = useSettings();
  const [values, setValues] = useState<string[]>(() => items.map(() => ''));
  const [checked, setChecked] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);

  const correctCount = items.filter((item, i) => isGapCorrect(item, values[i])).length;
  const wordBank = [...new Set(items.map((item) => item.answer))].sort((a, b) => a.localeCompare(b));

  const check = () => setChecked(true);
  const reset = () => {
    setValues(items.map(() => ''));
    setChecked(false);
  };
  const reveal = () => {
    setValues(items.map((item) => item.answer));
    setChecked(true);
  };

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
                onChange={(e) => setValues((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
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
  texts: VocabularyText[];
  vocabulary: VocabularyItem[];
  moduleTitle: string;
}

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

/** Renders a paragraph, turning **term** into a highlighted key word. */
const Paragraph: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split('**');
  return (
    <p className="text-base leading-7 text-ink">
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

const TextCard: React.FC<{ text: VocabularyText; showTranslations: boolean }> = ({ text, showTranslations }) => {
  const { tr } = useSettings();
  const [lightbox, setLightbox] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <Illustration src={text.image.src} alt={text.image.alt} onOpen={() => setLightbox(true)} />
      <ImageLightbox isOpen={lightbox} src={text.image.src} alt={text.image.alt} caption={text.image.alt} onClose={() => setLightbox(false)} />

      <div className="grid gap-5 p-6 sm:p-8">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm leading-5 text-ink-2">
            <Chip size="sm" tone="primary">{text.subtopic}</Chip>
            <span>Level {text.level === 'R' ? 'B2 (rozszerzony)' : 'B1+ (podstawowy)'}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl leading-8 font-semibold">{text.title}</h3>
            <Button variant="secondary" size="sm" onClick={() => speak(text.paragraphs.join(' '))} title="Listen to the text">
              <Volume2 className="h-4 w-4" />
              Listen
            </Button>
          </div>
        </div>

        <div className="grid max-w-[72ch] gap-4">
          {text.paragraphs.map((p, i) => (
            <Paragraph key={i} text={p} />
          ))}
        </div>

        <section className="grid gap-3 border-t border-line-soft pt-5">
          <h4 className="text-base leading-6 font-semibold">Key vocabulary</h4>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {text.glossary.map((g) => (
              <div key={g.term} className="grid grid-cols-[auto_1fr] items-start gap-x-2 border-b border-line-soft py-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <button
                  type="button"
                  onClick={() => speak(g.term)}
                  className="mt-0.5 grid h-6 w-6 cursor-pointer place-items-center rounded text-ink-3 hover:bg-primary-tint hover:text-primary"
                  title="Listen"
                  aria-label={`Listen: ${g.term}`}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <dt className="text-base leading-6 font-semibold text-ink">{g.term}</dt>
                  <dd className="text-sm leading-5 text-ink-2">{g.definition}</dd>
                  {showTranslations && tr(g.polish, g.russian) && (
                    <dd className="text-sm leading-5 text-ink-3 italic">{tr(g.polish, g.russian)}</dd>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </section>

        {vocabularyExercisesByText[text.id] && (
          <GapFillExercise textId={text.id} items={vocabularyExercisesByText[text.id].items} />
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

export const VocabularyView: React.FC<VocabularyViewProps> = ({ texts, vocabulary, moduleTitle }) => {
  const { tr, t } = useSettings();
  const [showTranslations, setShowTranslations] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const sortedList = [...vocabulary].sort((a, b) => a.english.localeCompare(b.english));

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-6">
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

      {texts.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="text-base leading-6 font-semibold text-ink">Texts for this module are coming soon.</p>
          <p className="mt-1 text-sm leading-5 text-ink-2">Use the flashcards and the word list below in the meantime.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {texts.map((t) => (
            <TextCard key={t.id} text={t} showTranslations={showTranslations} />
          ))}
        </div>
      )}

      {sortedList.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
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
              {sortedList.map((item) => (
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
                    </div>
                    <p className="text-sm leading-5 text-ink-2 italic">"{item.example}"</p>
                    {showTranslations && <p className="text-sm leading-5 text-ink-3">{tr(item.polish, item.russian)}</p>}
                  </div>
                  <span className="text-xs leading-4 text-ink-3">{item.category}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};
