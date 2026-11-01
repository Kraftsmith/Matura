import React, { useState } from 'react';
import { CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import type { LanguageUseExercise } from '../../types';
import { EXERCISE_PASS_SCORE, type ExerciseResult } from '../../progress-context';
import { scoreOf, solvedAnswers, type ExerciseAnswers } from '../../languageUse';
import { useSettings } from '../../useSettings';
import { Button, Callout, Chip } from '../ui';
import { CopyLinkButton } from '../CopyLinkButton';
import { MatchingBody } from './MatchingBody';
import { MiniDialogueBody } from './MiniDialogueBody';
import { WordBankBody } from './WordBankBody';

/** idle: the learner is answering; checked: their answers are marked; revealed: the key is shown, nothing is saved. */
export type ExercisePhase = 'idle' | 'checked' | 'revealed';

export interface ExerciseBodyProps<E extends LanguageUseExercise> {
  exercise: E;
  answers: ExerciseAnswers;
  phase: ExercisePhase;
  onChange: (answers: ExerciseAnswers) => void;
  onCheck: () => void;
  showTranslations: boolean;
}

interface ExerciseCardProps {
  exercise: LanguageUseExercise;
  number: number;
  /** Route of the exercise without the profile. */
  route: string;
  result?: ExerciseResult;
  onResult: (scorePercent: number) => void;
  showTranslations: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, number, route, result, onResult, showTranslations }) => {
  const { t } = useSettings();
  const [answers, setAnswers] = useState<ExerciseAnswers>({});
  const [phase, setPhase] = useState<ExercisePhase>('idle');

  const score = scoreOf(exercise, answers);
  const passed = !!result && result.best >= EXERCISE_PASS_SCORE;

  const check = () => {
    setPhase('checked');
    // Pressing the button on an empty exercise shows the key's marks but is not an attempt.
    if (Object.values(answers).some((v) => v.trim())) onResult(score.percent);
  };
  const reset = () => {
    setAnswers({});
    setPhase('idle');
  };
  const reveal = () => {
    setAnswers(solvedAnswers(exercise));
    setPhase('revealed');
  };

  const bodyProps = { answers, phase, onChange: setAnswers, onCheck: check, showTranslations };

  return (
    <article className="grid gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-2">
          <h3 className="text-xl leading-7 font-semibold">
            <a href={`#${route}`} className="hover:text-primary hover:underline">
              {t('srodki.exercise')} {number}
            </a>
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Chip size="sm" tone="primary" className="whitespace-normal!">
              {exercise.functionLabel}
            </Chip>
            <Chip size="sm">{t(`srodki.type.${exercise.type}`)}</Chip>
            <Chip size="sm">{t(exercise.level === 'R' ? 'gram.levelR' : 'gram.levelP')}</Chip>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {phase === 'checked' ? (
            <Chip tone={score.percent >= EXERCISE_PASS_SCORE ? 'success' : 'primary'}>
              {score.correct} / {score.total}
            </Chip>
          ) : (
            result && !passed && (
              <Chip>
                {t('srodki.result')}: {result.best}%
              </Chip>
            )
          )}
          {passed && (
            <Chip tone="success">
              <CheckCircle2 className="h-4 w-4" />
              {t('srodki.passed')}
            </Chip>
          )}
          <CopyLinkButton rest={route} />
        </div>
      </header>

      {exercise.tip && <Callout>{exercise.tip}</Callout>}
      <p className="text-base leading-6 font-semibold text-ink">{exercise.instruction}</p>

      {exercise.type === 'matching' && <MatchingBody exercise={exercise} {...bodyProps} />}
      {exercise.type === 'word-bank' && <WordBankBody exercise={exercise} {...bodyProps} />}
      {exercise.type === 'mini-dialogue' && <MiniDialogueBody exercise={exercise} {...bodyProps} />}

      <div className="flex flex-wrap items-center gap-2 border-t border-line-soft pt-5">
        {phase === 'idle' ? (
          <Button size="sm" onClick={check}>
            {t('srodki.check')}
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            {t('srodki.tryAgain')}
          </Button>
        )}
        {phase !== 'revealed' && (
          <Button size="sm" variant="ghost" onClick={reveal} disabled={phase === 'checked' && score.correct === score.total}>
            <Eye className="h-4 w-4" />
            {t('srodki.showAnswers')}
          </Button>
        )}
      </div>
    </article>
  );
};
