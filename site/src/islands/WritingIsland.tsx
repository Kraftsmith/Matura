import { GuestProviders } from '@app/guest/GuestProviders';
import { WritingTrainerView } from '@app/components/WritingTrainerView';
import { allModules } from '@app/data/modulesData';

export interface WritingIslandProps {
  moduleId: string;
  allowedModules: string[];
}

/** Wypowiedź pisemna of a topic, for a guest on the public site. */
export default function WritingIsland({ moduleId, allowedModules }: WritingIslandProps) {
  const module = allModules.find((m) => m.id === moduleId);
  if (!module) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <WritingTrainerView moduleId={moduleId} prompt={module.writingPrompt} moduleTitle={module.titlePl} />
    </GuestProviders>
  );
}
