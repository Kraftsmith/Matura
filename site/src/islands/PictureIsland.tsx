import { GuestProviders } from '@app/guest/GuestProviders';
import { PictureDescriptionView } from '@app/components/PictureDescriptionView';
import { allModules } from '@app/data/modulesData';

export interface PictureIslandProps {
  moduleId: string;
  allowedModules: string[];
}

/** Opis ilustracji of a topic, for a guest on the public site. */
export default function PictureIsland({ moduleId, allowedModules }: PictureIslandProps) {
  const module = allModules.find((m) => m.id === moduleId);
  if (!module) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <PictureDescriptionView moduleId={moduleId} data={module.pictureDescription} moduleTitle={module.titlePl} />
    </GuestProviders>
  );
}
