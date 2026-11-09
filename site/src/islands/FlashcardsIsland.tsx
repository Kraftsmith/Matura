import React, { useMemo } from 'react';
import { GuestProviders } from '@app/guest/GuestProviders';
import { FlashcardsView } from '@app/components/FlashcardsView';
import { allModules } from '@app/data/modulesData';
import { deckOf } from '@app/decks';
import { useProgress } from '@app/useProgress';

export interface FlashcardsIslandProps {
  moduleId: string;
  /** Opens the deck on this card. */
  focusCardId?: string;
  allowedModules: string[];
}

const Inner: React.FC<{ moduleId: string; focusCardId?: string }> = ({ moduleId, focusCardId }) => {
  const { state, getModule, setCardStatus } = useProgress();
  const module = allModules.find((m) => m.id === moduleId)!;
  const cards = useMemo(() => deckOf(module, state), [module, state]);
  const progress = getModule(moduleId);
  const masteredIds = useMemo(() => new Set(progress.mastered), [progress]);
  const reviewIds = useMemo(() => new Set(progress.review), [progress]);
  return (
    <FlashcardsView
      cards={cards}
      moduleTitle={module.titlePl}
      moduleId={moduleId}
      masteredIds={masteredIds}
      reviewIds={reviewIds}
      focusCardId={focusCardId}
      onCardStatus={(cardId, status) => setCardStatus(moduleId, cardId, status)}
    />
  );
};

/** The deck of a topic, for a guest on the public site; their own cards join it in this browser. */
export default function FlashcardsIsland({ moduleId, focusCardId, allowedModules }: FlashcardsIslandProps) {
  if (!allModules.some((m) => m.id === moduleId)) return null;
  return (
    <GuestProviders allowedModules={allowedModules}>
      <Inner moduleId={moduleId} focusCardId={focusCardId} />
    </GuestProviders>
  );
}
