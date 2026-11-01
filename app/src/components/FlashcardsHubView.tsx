import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Flashcard, MaturaModule } from '../types';
import { deckCounts, deckOf, isOwnCard } from '../decks';
import { pluralForm } from '../i18n';
import { Button, Card, Chip, Meter, SectionTitle, buttonClass } from './ui';
import { CopyLinkButton } from './CopyLinkButton';
import { FlashcardsView } from './FlashcardsView';
import { useFlashcardDialog } from '../useAddFlashcard';
import { useProgress } from '../useProgress';
import { useSettings } from '../useSettings';
import { useTeacherCards } from '../useTeacherCards';
import { useUser } from '../useUser';
import { buildHash } from '../userRoute';

const FILTER_KEY = 'matura.fiszkiFilter';
const FILTERS = ['all', 'started', 'review', 'mine'] as const;
type HubFilter = (typeof FILTERS)[number];

const readFilter = (): HubFilter => {
  try {
    const saved = window.localStorage.getItem(FILTER_KEY);
    return FILTERS.find((f) => f === saved) ?? 'all';
  } catch {
    return 'all';
  }
};

const writeFilter = (filter: HubFilter) => {
  try {
    window.localStorage.setItem(FILTER_KEY, filter);
  } catch {
    /* storage unavailable: the choice lasts until reload */
  }
};

const useCardsLabel = () => {
  const { t } = useSettings();
  return (n: number) => `${n} ${t(`plural.card${pluralForm(n)}`)}`;
};

const useOwnLabel = () => {
  const { t } = useSettings();
  return (n: number) => (n === 1 ? t('fiszki.ownOne') : t('fiszki.ownMany', { n }));
};

const useHref = () => {
  const { user } = useUser();
  return (rest: string) => `#${buildHash(user.id, rest)}`;
};

/** Every deck of the signed-in user with its counts. */
const useDecks = (modules: MaturaModule[]) => {
  const { state, userId } = useProgress();
  const { cardsOf } = useTeacherCards();
  return useMemo(() => {
    const teacherCards = cardsOf(userId);
    return modules.map((module) => {
      const deck = deckOf(module, state, teacherCards);
      return { module, deck, own: deck.filter(isOwnCard).length, ...deckCounts(deck, state.modules[module.id]) };
    });
  }, [modules, state, userId, cardsOf]);
};

/** The main page of the Fiszki module: every deck, and what to do next. */
export const FlashcardsHubView: React.FC<{ modules: MaturaModule[] }> = ({ modules }) => {
  const { t } = useSettings();
  const { state } = useProgress();
  const { open } = useFlashcardDialog();
  const href = useHref();
  const cardsLabel = useCardsLabel();
  const ownLabel = useOwnLabel();
  const decks = useDecks(modules);
  const [filter, setFilter] = useState<HubFilter>(readFilter);

  const sum = (pick: (d: (typeof decks)[number]) => number) => decks.reduce((n, d) => n + pick(d), 0);
  const total = sum((d) => d.deck.length);
  const mastered = sum((d) => d.mastered);
  const review = sum((d) => d.review);
  const own = sum((d) => d.own);
  const lastDeck = modules.find((m) => m.id === state.lastDeckId);

  const shown = decks.filter((d) => {
    if (filter === 'started') return d.mastered + d.review > 0;
    if (filter === 'review') return d.review > 0;
    if (filter === 'mine') return d.own > 0;
    return true;
  });

  const selectFilter = (next: HubFilter) => {
    writeFilter(next);
    setFilter(next);
  };

  const filterLabels: Record<HubFilter, string> = {
    all: t('fiszki.filter.all', { n: decks.length }),
    started: t('fiszki.filter.started'),
    review: t('fiszki.filter.review'),
    mine: t('fiszki.filter.mine'),
  };

  return (
    <div className="grid gap-6">
      <div className="-mx-4 -mt-4 bg-hero px-4 pt-6 pb-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <h1 className="text-3xl leading-10 font-semibold sm:text-4xl sm:leading-12">{t('fiszki.title')}</h1>
        <p className="mt-2 max-w-[72ch] text-base leading-6 text-ink-2">{t('fiszki.subtitle')}</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
          <span>
            <b className="font-semibold text-ink">{cardsLabel(total)}</b>
          </span>
          <span>
            <b className="font-semibold text-ink">{mastered}</b> {t('fiszki.metaMastered')}
          </span>
          <span>
            <b className="font-semibold text-ink">{review}</b> {t('fiszki.metaReview')}
          </span>
          <span>
            <b className="font-semibold text-ink">{own}</b> {t('fiszki.metaOwn')}
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {review > 0 ? (
            <a href={href('fiszki/powtorka')} className={buttonClass()}>
              {t('fiszki.reviewAll', { n: review })}
            </a>
          ) : (
            <Button disabled>{t('fiszki.nothingToReview')}</Button>
          )}
          {lastDeck && (
            <a href={href(`fiszki/${lastDeck.id}`)} className={buttonClass('secondary')}>
              {t('fiszki.continue', { deck: lastDeck.titlePl })}
            </a>
          )}
          <Button variant="secondary" onClick={() => open({})}>
            <Plus className="h-4 w-4" />
            {t('fiszki.addCard')}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'primary' : 'secondary'} aria-pressed={filter === f} onClick={() => selectFilter(f)}>
            {filterLabels[f]}
          </Button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="mb-4 text-base leading-6 font-semibold text-ink">{t('fiszki.filterEmpty')}</p>
          <Button variant="secondary" onClick={() => selectFilter('all')}>
            {t('fiszki.showAll')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ module: m, deck, own: ownCards, mastered: done, review: toReview }) => {
            const touched = done + toReview > 0;
            return (
              <a key={m.id} href={href(`fiszki/${m.id}`)} className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <Card className="grid h-full content-start gap-3 group-hover:border-primary">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 text-base leading-6 font-semibold text-ink">
                      {m.number}. {m.titlePl} <span className="font-normal text-ink-2">{m.titleEn}</span>
                    </p>
                    <Chip size="sm">{m.badge}</Chip>
                  </div>
                  <p className="text-sm leading-5 text-ink-2">
                    {cardsLabel(deck.length)}
                    {ownCards > 0 && ` · ${ownLabel(ownCards)}`}
                  </p>
                  <div className="grid gap-1">
                    <Meter value={deck.length ? (done / deck.length) * 100 : 0} tone="primary" label={m.titlePl} />
                    <p className="text-sm leading-5 text-ink-2">{touched ? t('fiszki.stats', { m: done, r: toReview }) : t('fiszki.notStarted')}</p>
                  </div>
                  <span className={`${buttonClass(toReview > 0 ? 'primary' : 'secondary', 'sm')} justify-self-start`}>{touched ? t('fiszki.learn') : t('fiszki.start')}</span>
                </Card>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BackToDecks: React.FC = () => {
  const { t } = useSettings();
  const href = useHref();
  return (
    <a href={href('fiszki')} className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-primary hover:underline">
      <ArrowLeft className="h-4 w-4" />
      {t('fiszki.allDecks')}
    </a>
  );
};

interface DeckPageProps {
  module: MaturaModule;
  cards: Flashcard[];
  children: React.ReactNode;
}

/** One deck inside the Fiszki module: the same cards as the topic's tab, under the module's own heading. */
export const DeckPage: React.FC<DeckPageProps> = ({ module, cards, children }) => {
  const { t } = useSettings();
  const { touchDeck } = useProgress();
  const { open } = useFlashcardDialog();
  const href = useHref();
  const cardsLabel = useCardsLabel();
  const ownLabel = useOwnLabel();
  const own = cards.filter(isOwnCard).length;

  useEffect(() => touchDeck(module.id), [module.id, touchDeck]);

  const description = t('fiszki.deckDesc', { n: cardsLabel(cards.length), b: module.flashcards.length });

  return (
    <div className="grid gap-4">
      <BackToDecks />
      <SectionTitle
        title={t('fiszki.deckTitle', { deck: module.titlePl })}
        description={own > 0 ? `${description} · ${ownLabel(own)}` : description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => open({ moduleId: module.id })}>
              <Plus className="h-4 w-4" />
              {t('fiszki.addCard')}
            </Button>
            <CopyLinkButton rest={`fiszki/${module.id}`} />
            <a href={href(`${module.id}/opis-foto`)} className="inline-flex items-center gap-1 px-3 py-2 text-sm leading-5 font-semibold text-primary hover:underline">
              {t('fiszki.openModule')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        }
      />
      {children}
    </div>
  );
};

/** Above the deck in a topic's tab: the same deck, and the way to the module. */
export const DeckTabActions: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const { t } = useSettings();
  const { open } = useFlashcardDialog();
  const href = useHref();
  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4">
      <a href={href('fiszki')} className="inline-flex items-center gap-1 text-sm leading-5 font-semibold text-primary hover:underline">
        {t('fiszki.allDecks')}
        <ArrowRight className="h-4 w-4" />
      </a>
      <Button size="sm" variant="secondary" onClick={() => open({ moduleId })}>
        <Plus className="h-4 w-4" />
        {t('fiszki.addCard')}
      </Button>
    </div>
  );
};

/** Every card marked "Do powtórki", from all topics. A status always goes to the card's home deck. */
export const ReviewSession: React.FC<{ modules: MaturaModule[] }> = ({ modules }) => {
  const { t } = useSettings();
  const { state, setCardStatus } = useProgress();
  const decks = useDecks(modules);
  const href = useHref();
  const cardsLabel = useCardsLabel();

  const { cards, homes, reviewIds, masteredIds } = useMemo(() => {
    const homes = new Map<string, MaturaModule>();
    const cards: Flashcard[] = [];
    for (const { module, deck } of decks) {
      const review = new Set(state.modules[module.id]?.review ?? []);
      for (const card of deck) {
        if (!review.has(card.id)) continue;
        homes.set(card.id, module);
        cards.push(card);
      }
    }
    return { cards, homes, reviewIds: new Set(cards.map((c) => c.id)), masteredIds: new Set<string>() };
  }, [decks, state]);

  const [startedWith] = useState(cards.length);
  const finished = cards.length === 0 && startedWith > 0;

  useEffect(() => {
    if (finished) void confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }, [finished]);

  const heading = <SectionTitle title={t('fiszki.mixedTitle')} description={t('fiszki.mixedDesc')} />;

  if (cards.length === 0) {
    return (
      <div className="grid gap-4">
        <BackToDecks />
        {heading}
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <p className="mx-auto mb-6 max-w-[48ch] text-base leading-6 font-semibold text-ink">{finished ? t('fiszki.mixedDone', { n: cardsLabel(startedWith) }) : t('fiszki.mixedEmpty')}</p>
          <a href={href('fiszki')} className={buttonClass()}>
            {t('fiszki.allDecks')}
          </a>
        </div>
      </div>
    );
  }

  const homeOf = (card: Flashcard) => {
    const home = homes.get(card.id);
    return { id: home?.id ?? '', title: home?.titlePl ?? '' };
  };

  return (
    <div className="grid gap-4">
      <BackToDecks />
      {heading}
      <FlashcardsView
        cards={cards}
        moduleTitle={t('fiszki.mixedTitle')}
        masteredIds={masteredIds}
        reviewIds={reviewIds}
        homeOf={homeOf}
        onCardStatus={(cardId, status) => {
          const home = homes.get(cardId);
          if (home) setCardStatus(home.id, cardId, status);
        }}
      />
    </div>
  );
};
