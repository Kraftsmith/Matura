import { describe, expect, it } from 'vitest';
import { emptyProgressState, type ProgressState } from './progress-context';
import { countGuestWork, mergeGuestProgress, opSetCardStatus } from './progressOps';
import type { UserFlashcard } from './types';

const card = (front: string): UserFlashcard => ({
  id: `u-${front}`,
  front,
  partOfSpeech: 'noun',
  backMeaningPl: front,
  exampleSentence: '',
  category: 'x',
  source: 'manual',
  createdAt: '2026-01-01T00:00:00.000Z',
});

const guest = (): ProgressState => ({
  version: 1,
  modules: {
    czlowiek: {
      mastered: ['czl-1'],
      review: ['czl-2'],
      gapWork: { 'czl-txt-1': { values: ['a'], checked: true, at: 't' }, 'czl-txt-2': { values: ['b'], checked: true, revealed: true, at: 't' } },
      exerciseWork: { 'czl-sj-1': { answers: { a: 'b' }, checked: true, at: 't' } },
      test: { best: 90, last: 90, attempts: 1, lastAt: 't' },
    },
  },
  cards: { czlowiek: [card('scruffy'), card('stubborn')] },
});

describe('guest progress moving into an account', () => {
  it('counts what the guest checked and wrote, not what was revealed', () => {
    expect(countGuestWork(guest())).toEqual({ exercises: 3, cards: 2 });
    expect(countGuestWork(emptyProgressState())).toEqual({ exercises: 0, cards: 0 });
  });

  it('takes a whole topic the account has not touched', () => {
    const merged = mergeGuestProgress(emptyProgressState(), guest());
    expect(merged.modules.czlowiek.test?.best).toBe(90);
    expect(merged.cards?.czlowiek.map((c) => c.front)).toEqual(['scruffy', 'stubborn']);
  });

  it('keeps the account\'s work and adds only what it lacks', () => {
    const account: ProgressState = {
      version: 1,
      modules: {
        czlowiek: {
          mastered: ['czl-2'],
          review: [],
          gapWork: { 'czl-txt-1': { values: ['mine'], checked: true, at: 't' } },
          test: { best: 95, last: 95, attempts: 2, lastAt: 't' },
        },
      },
      cards: { czlowiek: [card('Scruffy')] },
    };
    const merged = mergeGuestProgress(account, guest());
    const m = merged.modules.czlowiek;
    expect(m.gapWork?.['czl-txt-1'].values).toEqual(['mine']);
    expect(m.gapWork?.['czl-txt-2']).toBeDefined();
    expect(m.exerciseWork?.['czl-sj-1']).toBeDefined();
    expect(m.test?.best).toBe(95);
    // The account already decided about czl-2; czl-1 is new.
    expect(m.mastered).toEqual(['czl-2', 'czl-1']);
    expect(m.review).toEqual([]);
    expect(merged.cards?.czlowiek.map((c) => c.front)).toEqual(['Scruffy', 'stubborn']);
  });

  it('card statuses move a card between the lists', () => {
    const s = opSetCardStatus(opSetCardStatus(emptyProgressState(), 'czlowiek', 'c1', 'review'), 'czlowiek', 'c1', 'mastered');
    expect(s.modules.czlowiek).toMatchObject({ mastered: ['c1'], review: [] });
  });
});
