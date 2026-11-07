import React from 'react';
import { CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import type { LanguageUseExercise } from '../../types';
import { EXERCISE_PASS_SCORE, type ExerciseResult, type LanguageWork } from '../../progress-context';
import { scoreOf, solvedAnswers, type ExerciseAnswers } from '../../languageUse';
import { useProgress } from '../../useProgress';
import { useSettings } from '../../useSettings';
import { Button, Callout, Chip } from '../ui';
import { CopyLinkButton } from '../CopyLinkButton';
import { SaveWork } from '../SaveWork';
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

const NO_ANSWERS: ExerciseAnswers = {};

interface ExerciseCardProps {
  moduleId: string;
  exercise: LanguageUseExercise;
  number: number;
  /** Route of the exercise without the profile. */
  route: string;
  result?: ExerciseResult;
  onResult: (scorePercent: number) => void;
  showTranslations: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ moduleId, exercise, number, route, result, onResult, showTranslations }) => {
  const { t } = useSettings();
  const { getModule, updateModule } = useProgress();
  // The answers live in the progress, so they survive a reload and the teacher can read them.
  const work = getModule(moduleId).exerciseWork?.[exercise.id];
  const answers = work?.answers ?? NO_ANSWERS;
  const phase: ExercisePhase = work?.revealed ? 'revealed' : work?.checked ? 'checked' : 'idle';

  const score = scoreOf(exercise, answers);
  const passed = !!result && result.best >= EXERCISE_PASS_SCORE;
  const typed = Object.values(answers).some((v) => v.trim());

  const saveWork = (patch: Partial<LanguageWork> | undefined) =>
    updateModule(moduleId, (m) => {
      const next = { ...m.exerciseWork };
      if (patch) next[exercise.id] = { ...(next[exercise.id] ?? { answers: {}, checked: false }), ...patch, at: new Date().toISOString() };
      else delete next[exercise.id];
      return { ...m, exerciseWork: next };
    });

  const setAnswers = (next: ExerciseAnswers) => saveWork({ answers: next });
  const check = () => {
    saveWork({ checked: true });
    // Pressing the button on an empty exercise shows the key's marks but is not an attempt.
    if (typed) onResult(score.percent);
  };
  const reset = () => saveWork(undefined);
  const reveal = () => saveWork({ answers: solvedAnswers(exercise), checked: true, revealed: true });

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
        <SaveWork active={typed && phase !== 'revealed'} className="ml-auto" />
      </div>
    </article>
  );
};
