import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../types';
import { Volume2, RotateCw, Shuffle, ArrowLeft, ArrowRight, Sparkles, Pencil, Trash2 } from 'lucide-react';
import { Button, Chip } from './ui';
import { SaveStatus } from './SaveStatus';
import { useSettings } from '../useSettings';
import { isOwnCard, isTeacherCard } from '../decks';
import { useFlashcardDialog } from '../useAddFlashcard';
import { speak } from '../speech';
import confetti from 'canvas-confetti';

export type DeckFilter = 'all' | 'review' | 'mastered' | 'mine' | 'teacher';

interface FlashcardsViewProps {
  cards: Flashcard[];
  /** The deck's topic; shown above the title. */
  moduleTitle: string;
  moduleId?: string;
  /** Persisted learner status for this deck (owned by the progress store). */
  masteredIds: Set<string>;
  reviewIds: Set<string>;
  onCardStatus: (cardId: string, status: 'mastered' | 'review' | 'none') => void;
  /** Opens the deck on this card. */
  focusCardId?: string;
  initialFilter?: DeckFilter;
  /** The page has its own heading. */
  hideTitle?: boolean;
  /** Review across topics: names each card's home deck; a card leaves as soon as it is marked, and there are no filters. */
  homeOf?: (card: Flashcard) => { id: string; title: string };
}

/** Keeps the order the learner shuffled, the new cards go last and removed ones disappear. */
const syncDeck = (deck: Flashcard[], cards: Flashcard[]) => {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const known = new Set(deck.map((c) => c.id));
  return [...deck.flatMap((c) => byId.get(c.id) ?? []), ...cards.filter((c) => !known.has(c.id))];
};

const isTyping = (target: EventTarget | null) => target instanceof Element && !!target.closest('input, textarea, select, [role="dialog"]');

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, moduleTitle, moduleId, masteredIds, reviewIds, onCardStatus, focusCardId, initialFilter, hideTitle, homeOf }) => {
  const { tr, t } = useSettings();
  const { open, removeOwn } = useFlashcardDialog();
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<DeckFilter>(initialFilter ?? 'all');
  const [appliedFocus, setAppliedFocus] = useState<string>();

  const [prevCards, setPrevCards] = useState<Flashcard[]>(cards);
  if (cards !== prevCards) {
    setPrevCards(cards);
    setDeck(syncDeck(deck, cards));
  }

  if (focusCardId && focusCardId !== appliedFocus) {
    const index = deck.findIndex((c) => c.id === focusCardId);
    if (index >= 0) {
      setAppliedFocus(focusCardId);
      setFilter('all');
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  }

  const filteredDeck = deck.filter((card) => {
    if (filter === 'mastered') return masteredIds.has(card.id);
    if (filter === 'review') return reviewIds.has(card.id);
    if (filter === 'mine') return isOwnCard(card);
    if (filter === 'teacher') return isTeacherCard(card);
    return true;
  });

  const position = Math.min(currentIndex, Math.max(filteredDeck.length - 1, 0));
  const currentCard = filteredDeck[position];

  const masteredCount = cards.filter((c) => masteredIds.has(c.id)).length;
  const reviewCount = cards.filter((c) => reviewIds.has(c.id)).length;
  const ownCount = cards.filter(isOwnCard).length;
  const teacherCount = cards.filter(isTeacherCard).length;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(position < filteredDeck.length - 1 ? position + 1 : 0);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(position > 0 ? position - 1 : filteredDeck.length - 1);
  };

  const markMastered = () => {
    if (!currentCard) return;
    const wasMastered = masteredIds.has(currentCard.id);
    onCardStatus(currentCard.id, 'mastered');
    if (!homeOf && !wasMastered && masteredCount + 1 === cards.length) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    // The card leaves this list by itself, and the next one takes its place.
    if (homeOf || filter === 'review') setIsFlipped(false);
    else handleNext();
  };

  const markForReview = () => {
    if (!currentCard) return;
    onCardStatus(currentCard.id, 'review');
    if (filter === 'mastered') setIsFlipped(false);
    else handleNext();
  };

  const handleShuffle = () => {
    setDeck([...deck].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const selectFilter = (f: DeckFilter) => {
    setFilter(f);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playPronunciation = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    speak(text);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        setIsFlipped(false);
        setCurrentIndex((i) => (i < filteredDeck.length - 1 ? i + 1 : 0));
      } else if (e.code === 'ArrowLeft') {
        setIsFlipped(false);
        setCurrentIndex((i) => (i > 0 ? i - 1 : filteredDeck.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredDeck.length]);

  if (filteredDeck.length === 0) {
    return (
      <div className="mx-auto my-8 max-w-xl rounded-2xl border border-line bg-surface p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-tint text-primary">
          <Sparkles className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-ink">{t('cards.emptyTitle')}</h3>
        <p className="mb-6 text-sm text-ink-2">{filter === 'mastered' ? t('cards.emptyMastered') : t('cards.emptyReview')}</p>
        <Button onClick={() => selectFilter('all')}>
          {t('cards.showAll')} ({cards.length})
        </Button>
      </div>
    );
  }

  const progressPercent = Math.round((masteredCount / cards.length) * 100);

  const filters: { id: DeckFilter; label: string; count: number }[] = [
    { id: 'all', label: t('cards.all'), count: cards.length },
    { id: 'review', label: t('cards.review'), count: reviewCount },
    { id: 'mastered', label: t('cards.mastered'), count: masteredCount },
  ];
  if (teacherCount > 0) filters.push({ id: 'teacher', label: t('cards.fromTeacher'), count: teacherCount });
  if (ownCount > 0) filters.push({ id: 'mine', label: t('cards.mine'), count: ownCount });

  const home = homeOf?.(currentCard);
  const cardModuleId = home?.id ?? moduleId;
  const ownCard = isOwnCard(currentCard) ? currentCard : undefined;
  const meaning = tr(currentCard.backMeaningPl, currentCard.backMeaningRu) || currentCard.backMeaningPl || currentCard.backMeaningRu;
  const exampleTranslation = tr(currentCard.exampleTranslation, currentCard.exampleTranslationRu);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      {!homeOf && (
        <div className={`flex flex-col items-center gap-4 sm:flex-row ${hideTitle ? 'justify-center sm:justify-end' : 'justify-between'}`}>
          {!hideTitle && (
            <div>
              <span className="text-xs font-semibold text-primary">{moduleTitle}</span>
              <h2 className="text-xl font-semibold text-ink">{t('cards.title')}</h2>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-lg bg-line-soft p-1 text-xs font-semibold">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => selectFilter(f.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 transition ${filter === f.id ? 'bg-surface text-ink' : 'text-ink-2 hover:text-ink'}`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <div className={`flex text-xs font-medium text-ink-2 ${homeOf ? 'justify-end' : 'justify-between'}`}>
          {!homeOf && (
            <span>
              {t('cards.deckMastery')}: {progressPercent}%
            </span>
          )}
          <span>{t('cards.cardOf', { i: position + 1, n: filteredDeck.length })}</span>
        </div>
        {!homeOf && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-line-soft">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        )}
        <SaveStatus active={masteredCount + reviewCount > 0} />
      </div>

      <div className="perspective-1000 min-h-[360px] cursor-pointer" onClick={handleFlip}>
        <div className={`transform-style-3d relative min-h-[360px] w-full rounded-2xl border border-line/80 transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="backface-hidden absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl bg-surface p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                {home && <Chip size="sm">{home.title}</Chip>}
                <span className="rounded-full border border-primary-tint bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-hover">{currentCard.category}</span>
                {ownCard && <Chip size="sm">{t('cards.yourCard')}</Chip>}
                {isTeacherCard(currentCard) && <Chip size="sm">{t('cards.fromTeacher')}</Chip>}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-ink-3 capitalize">{currentCard.partOfSpeech.replace('_', ' ')}</span>
                {ownCard && cardModuleId && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        open({ editing: ownCard });
                      }}
                      className="cursor-pointer rounded-lg p-2 text-primary transition hover:bg-primary-tint"
                      title={t('cards.edit')}
                      aria-label={t('cards.edit')}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOwn(cardModuleId, ownCard);
                      }}
                      className="cursor-pointer rounded-lg p-2 text-primary transition hover:bg-primary-tint"
                      title={t('cards.delete')}
                      aria-label={t('cards.delete')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => playPronunciation(currentCard.front, e)}
                  className="cursor-pointer rounded-lg p-2 text-primary transition hover:bg-primary-tint"
                  title={t('cards.listen')}
                  aria-label={t('cards.listen')}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="my-auto py-6 text-center">
              <h3 className="mb-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{currentCard.front}</h3>
              {currentCard.phonetic && <div className="text-sm text-ink-3">{currentCard.phonetic}</div>}
            </div>

            <div className="flex items-center justify-between border-t border-line-soft pt-4 text-xs text-ink-3">
              <span className="flex items-center gap-1">
                <RotateCw className="h-3.5 w-3.5" /> {t('cards.flipHint')}
              </span>
              <span className="font-semibold text-primary">{t('cards.seeMeaning')} &rarr;</span>
            </div>
          </div>

          <div className="backface-hidden rotate-y-180 absolute inset-0 flex h-full w-full flex-col justify-between overflow-y-auto rounded-2xl border border-line bg-hero p-8 text-ink">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Chip size="sm">{currentCard.partOfSpeech.replace('_', ' ')}</Chip>
                <button
                  type="button"
                  onClick={(e) => playPronunciation(currentCard.front, e)}
                  className="cursor-pointer rounded-lg p-1.5 text-primary transition hover:bg-primary-tint"
                  title={t('cards.listen')}
                  aria-label={t('cards.listen')}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 space-y-1">
                {meaning && <div className="text-2xl leading-8 font-semibold text-ink">{meaning}</div>}
                {currentCard.backMeaningEn && <div className="text-base leading-6 text-ink-2">{currentCard.backMeaningEn}</div>}
              </div>

              {currentCard.exampleSentence && (
                <div className="mb-3 rounded-lg border border-line bg-surface p-3.5">
                  <div className="mb-1 text-base leading-6 text-ink italic">"{currentCard.exampleSentence}"</div>
                  {exampleTranslation && <div className="text-sm leading-5 text-ink-2">{exampleTranslation}</div>}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-ink-2">
              <span>{t('cards.backHint')}</span>
              <span>{t('cards.rateHint')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 sm:flex-nowrap">
        <Button variant="secondary" size="icon" onClick={handlePrev} title={`${t('cards.prev')} (←)`} aria-label={t('cards.prev')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex w-full max-w-md items-center justify-center gap-3 max-sm:order-first max-sm:max-w-none">
          <Button variant="secondary" full onClick={markForReview} className="max-sm:!px-3">
            {t('cards.review')}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFlip} title={`${t('cards.flip')} (Space)`} aria-label={t('cards.flip')} className="max-sm:!hidden">
            <RotateCw className="h-5 w-5" />
          </Button>
          <Button full onClick={markMastered} className="max-sm:!px-3">
            {t('cards.mastered')}
          </Button>
        </div>

        <Button variant="secondary" size="icon" onClick={handleNext} title={`${t('cards.next')} (→)`} aria-label={t('cards.next')}>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={handleShuffle} title={t('cards.shuffle')} aria-label={t('cards.shuffle')}>
          <Shuffle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
