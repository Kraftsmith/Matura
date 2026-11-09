import { GuestProviders } from '@app/guest/GuestProviders';
import { VocabularyView } from '@app/components/VocabularyView';
import { allModules } from '@app/data/modulesData';
import { vocabularyTextsByModule } from '@app/data/vocabularyTexts';

export interface VocabularyIslandProps {
  moduleId: string;
  /** One text on its own page. */
  textId?: string;
  allowedModules: string[];
}

/** The Słownictwo section of a topic, for a guest on the public site. */
export default function VocabularyIsland({ moduleId, textId, allowedModules }: VocabularyIslandProps) {
  const module = allModules.find((m) => m.id === moduleId);
  if (!module) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <VocabularyView
        moduleId={moduleId}
        textId={textId}
        texts={vocabularyTextsByModule[moduleId] ?? []}
        vocabulary={module.vocabularyList}
        moduleTitle={module.titlePl}
        teacherSignedIn={false}
      />
    </GuestProviders>
  );
}
