import React from 'react';
import type { MiniDialogueExercise } from '../../types';
import { useSettings } from '../../useSettings';
import { OptionCard, type OptionState } from '../ui';
import type { ExerciseBodyProps } from './ExerciseCard';
import { Explanation } from './Explanation';

/** Dialogues with one missing line and three options; the whole exercise is checked at once. */
export const MiniDialogueBody: React.FC<ExerciseBodyProps<MiniDialogueExercise>> = ({ exercise, answers, phase, onChange, showTranslations }) => {
  const { t } = useSettings();
  const locked = phase !== 'idle';

  return (
    <ol className="grid gap-6">
      {exercise.items.map((item, n) => {
        const chosen = answers[item.id] === undefined ? undefined : Number(answers[item.id]);
        const optionState = (index: number): OptionState => {
          if (!locked) return chosen === index ? 'selected' : 'idle';
          if (index === item.correctIndex) return 'correct';
          return chosen === index ? 'wrong' : 'idle';
        };
        return (
          <li key={item.id} className="grid gap-3">
            <div className="grid grid-cols-[auto_1fr] gap-x-2 text-base leading-6 text-ink">
              <span className="tabular-nums text-ink-3">{n + 1}.</span>
              <div className="grid min-w-0 gap-1">
                {item.lines.map((line, i) => (
                  <p key={i}>
                    <span className="mr-1 text-ink-3">{line.speaker}:</span>
                    {line.text ?? (
                      <>
                        <span className="font-semibold text-primary">______</span>
                        {line.after && ` ${line.after}`}
                      </>
                    )}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-2" role="radiogroup" aria-label={`${t('srodki.exercise')} ${n + 1}`}>
              {item.options.map((option, i) => (
                <OptionCard
                  key={option}
                  letter={String.fromCharCode(65 + i)}
                  state={optionState(i)}
                  disabled={locked}
                  onSelect={() => onChange({ ...answers, [item.id]: String(i) })}
                >
                  {option}
                </OptionCard>
              ))}
            </div>
            {locked && (
              <div className="grid gap-1">
                {phase === 'checked' && chosen === undefined && <p className="text-sm leading-5 font-semibold text-error">{t('srodki.noAnswer')}</p>}
                <Explanation text={item.explanation} showTranslations={showTranslations} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};
