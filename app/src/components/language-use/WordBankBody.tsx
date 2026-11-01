import React, { useRef } from 'react';
import type { WordBankExercise } from '../../types';
import { isItemCorrect } from '../../languageUse';
import { normalise } from '../../text';
import { useSettings } from '../../useSettings';
import { InlineInput } from '../ui';
import type { ExerciseBodyProps } from './ExerciseCard';
import { Explanation } from './Explanation';

/** Sentences with a gap and a frame of words: type a word or press it to put it in a gap. */
export const WordBankBody: React.FC<ExerciseBodyProps<WordBankExercise>> = ({ exercise, answers, phase, onChange, onCheck, showTranslations }) => {
  const { t } = useSettings();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const locked = phase !== 'idle';
  const { bank, items } = exercise;
  const used = new Set(Object.values(answers).map(normalise));

  const insert = (word: string) => {
    const focused = inputs.current.findIndex((el) => el === document.activeElement);
    const target = focused >= 0 ? focused : items.findIndex((_, i) => !answers[String(i)]?.trim());
    if (target >= 0) onChange({ ...answers, [String(target)]: word });
  };

  return (
    <div className="grid gap-4">
      <div role="group" aria-label={t('srodki.bank')} className="flex flex-wrap gap-2 rounded-lg bg-hero p-4">
        {bank.map((word) => {
          const isUsed = used.has(normalise(word));
          return (
            <button
              key={word}
              type="button"
              disabled={locked || isUsed}
              onMouseDown={(e) => e.preventDefault() /* keeps the focus in the gap */}
              onClick={() => insert(word)}
              className={`rounded-full border px-3 py-1 text-base leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isUsed || locked ? 'border-line-soft text-ink-3' : 'cursor-pointer border-line bg-surface text-ink hover:border-ink-2'
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      <ol className="grid gap-3">
        {items.map((item, i) => {
          const key = String(i);
          const [before, after] = item.sentence.split('___');
          const correct = isItemCorrect(exercise, key, answers[key]);
          const wrong = phase === 'checked' && !correct;
          return (
            <li key={item.sentence} className="grid gap-1">
              <p className="text-base leading-7 text-ink">
                <span className="mr-1.5 tabular-nums text-ink-3">{i + 1}.</span>
                {before}
                <InlineInput
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={answers[key] ?? ''}
                  state={!locked ? 'idle' : correct ? 'correct' : 'wrong'}
                  disabled={locked}
                  aria-label={`${t('srodki.gap')} ${i + 1}`}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="mx-1 my-0.5 align-baseline"
                  onChange={(e) => onChange({ ...answers, [key]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onCheck();
                  }}
                />
                {after}
                {wrong && (
                  <span className="ml-2 text-sm font-semibold text-success">
                    {t('srodki.answer')}: {item.answer}
                  </span>
                )}
              </p>
              {(wrong || phase === 'revealed') && <Explanation text={item.explanation} showTranslations={showTranslations} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
