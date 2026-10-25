import React, { useState, useEffect } from 'react';
import type { Flashcard } from '../types';
import { Volume2, RotateCw, Shuffle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Chip } from './ui';
import { useSettings } from '../useSettings';
import confetti from 'canvas-confetti';

interface FlashcardsViewProps {
  cards: Flashcard[];
  moduleTitle: string;
  /** Persisted learner status for this deck (owned by the progress store). */
  masteredIds: Set<string>;
  reviewIds: Set<string>;
  onCardStatus: (cardId: string, status: 'mastered' | 'review' | 'none') => void;
}

type Filter = 'all' | 'review' | 'mastered';

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, moduleTitle, masteredIds, reviewIds, onCardStatus }) => {
  const { tr, t } = useSettings();
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const [prevCards, setPrevCards] = useState<Flashcard[]>(cards);
  if (cards !== prevCards) {
    setPrevCards(cards);
    setDeck(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  const filteredDeck = deck.filter((card) => {
    if (filter === 'mastered') return masteredIds.has(card.id);
    if (filter === 'review') return reviewIds.has(card.id);
    return true;
  });

  const currentCard = filteredDeck[currentIndex] || filteredDeck[0];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(currentIndex < filteredDeck.length - 1 ? currentIndex + 1 : 0);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : filteredDeck.length - 1);
  };

  const markMastered = () => {
    if (!currentCard) return;
    const wasMastered = masteredIds.has(currentCard.id);
    onCardStatus(currentCard.id, 'mastered');
    const masteredAfter = masteredIds.size + (wasMastered ? 0 : 1);
    if (!wasMastered && masteredAfter === cards.length) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    handleNext();
  };

  const markForReview = () => {
    if (!currentCard) return;
    onCardStatus(currentCard.id, 'review');
    handleNext();
  };

  const handleShuffle = () => {
    setDeck([...deck].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const selectFilter = (f: Filter) => {
    setFilter(f);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playPronunciation = (text: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const progressPercent = Math.round((masteredIds.size / cards.length) * 100);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: t('cards.all'), count: cards.length },
    { id: 'review', label: t('cards.review'), count: reviewIds.size },
    { id: 'mastered', label: t('cards.mastered'), count: masteredIds.size },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <span className="text-xs font-semibold text-primary">{t('cards.kicker')}</span>
          <h2 className="text-xl font-semibold text-ink">
            {t('cards.title')}: {moduleTitle}
          </h2>
        </div>

        <div className="flex items-center space-x-1.5 rounded-lg bg-line-soft p-1 text-xs font-semibold">
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

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-ink-2">
          <span>
            {t('cards.deckMastery')}: {progressPercent}%
          </span>
          <span>{t('cards.cardOf', { i: currentIndex + 1, n: filteredDeck.length })}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-line-soft">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="perspective-1000 min-h-[360px] cursor-pointer" onClick={handleFlip}>
        <div className={`transform-style-3d relative min-h-[360px] w-full rounded-2xl border border-line/80 transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="backface-hidden absolute inset-0 flex h-full w-full flex-col justify-between rounded-2xl bg-surface p-8">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-primary-tint bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-hover">{currentCard.category}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-ink-3 capitalize">{currentCard.partOfSpeech.replace('_', ' ')}</span>
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
                <div className="text-2xl leading-8 font-semibold text-ink">{tr(currentCard.backMeaningPl, currentCard.backMeaningRu)}</div>
                <div className="text-base leading-6 text-ink-2">{currentCard.backMeaningEn}</div>
              </div>

              <div className="mb-3 rounded-lg border border-line bg-surface p-3.5">
                <div className="mb-1 text-base leading-6 text-ink italic">"{currentCard.exampleSentence}"</div>
                {tr(currentCard.exampleTranslation, currentCard.exampleTranslationRu) && (
                  <div className="text-sm leading-5 text-ink-2">{tr(currentCard.exampleTranslation, currentCard.exampleTranslationRu)}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-ink-2">
              <span>{t('cards.backHint')}</span>
              <span>{t('cards.rateHint')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="secondary" size="icon" onClick={handlePrev} title={`${t('cards.prev')} (←)`} aria-label={t('cards.prev')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex w-full max-w-md items-center justify-center gap-3">
          <Button variant="secondary" full onClick={markForReview}>
            {t('cards.review')}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFlip} title={`${t('cards.flip')} (Space)`} aria-label={t('cards.flip')}>
            <RotateCw className="h-5 w-5" />
          </Button>
          <Button full onClick={markMastered}>
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
