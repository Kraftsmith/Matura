import React from 'react';
import { GuestProviders } from '@app/guest/GuestProviders';
import { LanguageUseView } from '@app/components/language-use/LanguageUseView';
import { allModules } from '@app/data/modulesData';
import { languageUseExercisesByModule } from '@app/data/languageUseExercises';
import { useProgress } from '@app/useProgress';

export interface LanguageUseIslandProps {
  moduleId: string;
  /** One exercise on its own page. */
  exerciseId?: string;
  allowedModules: string[];
}

const Inner: React.FC<{ moduleId: string; exerciseId?: string; moduleTitle: string }> = ({ moduleId, exerciseId, moduleTitle }) => {
  const { getModule, saveExerciseResult } = useProgress();
  return (
    <LanguageUseView
      moduleId={moduleId}
      exercises={languageUseExercisesByModule[moduleId] ?? []}
      exerciseId={exerciseId}
      moduleTitle={moduleTitle}
      results={getModule(moduleId).exercises}
      onResult={(id, score) => saveExerciseResult(moduleId, id, score)}
    />
  );
};

/** The Środki językowe section of a topic, for a guest on the public site. */
export default function LanguageUseIsland({ moduleId, exerciseId, allowedModules }: LanguageUseIslandProps) {
  const module = allModules.find((m) => m.id === moduleId);
  if (!module) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <Inner moduleId={moduleId} exerciseId={exerciseId} moduleTitle={module.titlePl} />
    </GuestProviders>
  );
}
