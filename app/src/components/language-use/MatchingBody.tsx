import React from 'react';
import type { MatchingExercise } from '../../types';
import { useSettings } from '../../useSettings';
import type { ExerciseBodyProps } from './ExerciseCard';
import { Explanation } from './Explanation';

const letterOf = (index: number) => String.fromCharCode(97 + index);

const chipBase =
  'grid h-10 w-10 place-items-center rounded-lg border text-base leading-6 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** Sentences 1–n with a row of letter chips each; a letter stands at one sentence at a time. */
export const MatchingBody: React.FC<ExerciseBodyProps<MatchingExercise>> = ({ exercise, answers, phase, onChange, showTranslations }) => {
  const { t } = useSettings();
  const locked = phase !== 'idle';
  const { prompts, replies } = exercise;

  const pick = (promptId: string, replyId: string) => {
    const next = Object.fromEntries(Object.entries(answers).filter(([, r]) => r !== replyId));
    if (answers[promptId] !== replyId) next[promptId] = replyId;
    onChange(next);
  };

  const chipTone = (promptId: string, replyId: string) => {
    const chosen = answers[promptId] === replyId;
    if (locked) {
      if (!chosen) return 'border-line-soft text-ink-3';
      return exercise.answers[promptId] === replyId ? 'border-success bg-success-tint text-success' : 'border-error bg-error-tint text-error';
    }
    if (chosen) return 'cursor-pointer border-primary bg-primary-tint text-primary';
    const taken = Object.values(answers).includes(replyId);
    return taken ? 'cursor-pointer border-line-soft text-ink-3 hover:border-ink-2' : 'cursor-pointer border-line text-ink hover:border-ink-2';
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ol className="grid content-start gap-5">
        {prompts.map((prompt, i) => {
          const chosenIndex = replies.findIndex((r) => r.id === answers[prompt.id]);
          const rightIndex = replies.findIndex((r) => r.id === exercise.answers[prompt.id]);
          const wrong = phase === 'checked' && chosenIndex !== rightIndex;
          return (
            <li key={prompt.id} className="grid gap-2">
              <p className="text-base leading-6 text-ink">
                <span className="mr-1.5 tabular-nums text-ink-3">{i + 1}.</span>
                {prompt.text}
              </p>
              <div role="group" aria-label={`${t('srodki.chooseReply')} ${i + 1}`} className="flex flex-wrap gap-1.5">
                {replies.map((reply, r) => (
                  <button
                    key={reply.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={answers[prompt.id] === reply.id}
                    aria-label={`${t('srodki.reply')} ${letterOf(r)}: ${reply.text}`}
                    onClick={() => pick(prompt.id, reply.id)}
                    className={`${chipBase} ${chipTone(prompt.id, reply.id)}`}
                  >
                    {letterOf(r)}
                  </button>
                ))}
              </div>
              {wrong && (
                <p className="text-sm leading-5 font-semibold text-success">
                  {chosenIndex < 0 && <span className="font-normal text-error">{t('srodki.noAnswer')}. </span>}
                  {t('srodki.answer')}: {letterOf(rightIndex)}
                </p>
              )}
              {locked && (wrong || phase === 'revealed') && <Explanation text={exercise.explanations?.[prompt.id]} showTranslations={showTranslations} />}
            </li>
          );
        })}
      </ol>

      {/* On a phone the replies come first, so they are on screen while choosing. */}
      <ol className="order-first grid content-start gap-2 rounded-lg bg-hero p-4 sm:order-none">
        {replies.map((reply, r) => {
          const promptIndex = prompts.findIndex((p) => exercise.answers[p.id] === reply.id);
          return (
            <li key={reply.id} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2 text-base leading-6 text-ink">
              <span className="font-semibold">{letterOf(r)}.</span>
              <span className="min-w-0">{reply.text}</span>
              {locked && <span className="text-sm leading-6 font-semibold text-success tabular-nums">{promptIndex + 1}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
