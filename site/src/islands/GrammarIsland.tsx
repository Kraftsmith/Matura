import React from 'react';
import { GuestProviders } from '@app/guest/GuestProviders';
import { GrammarSectionView } from '@app/components/GrammarSectionView';
import { allModules } from '@app/data/modulesData';
import { useProgress } from '@app/useProgress';

export interface GrammarIslandProps {
  moduleId: string;
  /** A rule id or "test": the page opens scrolled to it. */
  focusId?: string;
  allowedModules: string[];
}

const Inner: React.FC<{ moduleId: string; focusId?: string }> = ({ moduleId, focusId }) => {
  const { saveTestResult } = useProgress();
  const module = allModules.find((m) => m.id === moduleId)!;
  return (
    <GrammarSectionView
      moduleId={moduleId}
      focusId={focusId}
      rules={module.grammarRules}
      questions={module.testQuestions}
      moduleTitle={module.titlePl}
      onScoreSave={(score) => saveTestResult(moduleId, score)}
    />
  );
};

/** The Gramatyka section of a topic (rules and the test), for a guest on the public site. */
export default function GrammarIsland({ moduleId, focusId, allowedModules }: GrammarIslandProps) {
  if (!allModules.some((m) => m.id === moduleId)) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <Inner moduleId={moduleId} focusId={focusId} />
    </GuestProviders>
  );
}
