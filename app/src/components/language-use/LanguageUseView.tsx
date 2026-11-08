import React, { useEffect, useState } from 'react';
import { ArrowLeft, Languages } from 'lucide-react';
import type { LanguageUseExercise } from '../../types';
import type { ExerciseResult } from '../../progress-context';
import { pluralForm } from '../../i18n';
import { useSettings } from '../../useSettings';
import { Button, SectionTitle } from '../ui';
import { ExerciseCard } from './ExerciseCard';

interface LanguageUseViewProps {
  moduleId: string;
  exercises: LanguageUseExercise[];
  /** When set, only this exercise is shown: its own page, the one to send as homework. */
  exerciseId?: string;
  moduleTitle: string;
  results?: Record<string, ExerciseResult>;
  onResult: (exerciseId: string, scorePercent: number) => void;
}

export const LanguageUseView: React.FC<LanguageUseViewProps> = ({ moduleId, exercises, exerciseId, moduleTitle, results, onResult }) => {
  const { t, translationLang } = useSettings();
  const [showTranslations, setShowTranslations] = useState(false);
  const sectionRoute = `${moduleId}/srodki`;
  const focused = exercises.find((e) => e.id === exerciseId);

  // Opening a single exercise (or going back to all of them) starts at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [exerciseId]);

  const card = (exercise: LanguageUseExercise) => (
    <ExerciseCard
      key={exercise.id}
      moduleId={moduleId}
      exercise={exercise}
      number={exercises.indexOf(exercise) + 1}
      route={`${sectionRoute}/${exercise.id}`}
      result={results?.[exercise.id]}
      onResult={(score) => onResult(exercise.id, score)}
      showTranslations={showTranslations}
    />
  );

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-6">
      <SectionTitle
        title={`${t('srodki.title')}: ${moduleTitle}`}
        description={t('srodki.desc', { n: exercises.length, word: t(`plural.exercise${pluralForm(exercises.length)}`) })}
        action={
          translationLang === 'ru' && (
            <Button
              variant={showTranslations ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowTranslations((v) => !v)}
              aria-pressed={showTranslations}
              title={t('srodki.translationsHint')}
            >
              <Languages className="h-4 w-4" />
              {t('vocab.translations')}
            </Button>
          )
        }
      />

      {focused ? (
        <div className="grid gap-4">
          <a href={`#${sectionRoute}`} className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            {t('srodki.allExercises')} ({exercises.length})
          </a>
          {card(focused)}
        </div>
      ) : exercises.length === 0 ? (
        <p className="card p-10 text-center text-base leading-6 font-semibold text-ink">{t('srodki.empty')}</p>
      ) : (
        <div className="grid gap-8">{exercises.map(card)}</div>
      )}
    </div>
  );
};
