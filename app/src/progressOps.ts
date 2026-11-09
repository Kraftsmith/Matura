import type { UserFlashcard } from './types';
import { emptyModuleProgress, emptyProgressState, type CardStatus, type ModuleProgress, type ProgressState } from './progress-context';
import { normalise } from './text';

/**
 * Pure operations on a learner's progress. The two providers (the account one, synced with the server,
 * and the guest one, kept in this browser) apply them through their own setState, so the rules of
 * "what a card status change means" live in one place.
 */

export const isProgressState = (v: unknown): v is ProgressState =>
  !!v && typeof v === 'object' && (v as ProgressState).version === 1 && typeof (v as ProgressState).modules === 'object';

export const newCardId = (moduleId: string) => `u-${moduleId}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 4)}`;

export const withStatus = (m: ModuleProgress, cardId: string, status: CardStatus): ModuleProgress => {
  const mastered = m.mastered.filter((id) => id !== cardId);
  const review = m.review.filter((id) => id !== cardId);
  if (status === 'mastered') mastered.push(cardId);
  if (status === 'review') review.push(cardId);
  return { ...m, mastered, review };
};

export const statusIn = (m: ModuleProgress | undefined, cardId: string): CardStatus =>
  m?.mastered.includes(cardId) ? 'mastered' : m?.review.includes(cardId) ? 'review' : 'none';

const clampScore = (scorePercent: number) => Math.max(0, Math.min(100, Math.round(scorePercent)));

export const opUpdateModule = (s: ProgressState, moduleId: string, fn: (m: ModuleProgress) => ModuleProgress): ProgressState => ({
  ...s,
  updatedAt: new Date().toISOString(),
  modules: { ...s.modules, [moduleId]: fn(s.modules[moduleId] ?? emptyModuleProgress()) },
});

export const opSetCardStatus = (s: ProgressState, moduleId: string, cardId: string, status: CardStatus) =>
  opUpdateModule(s, moduleId, (m) => withStatus(m, cardId, status));

export const opSaveTestResult = (s: ProgressState, moduleId: string, scorePercent: number) => {
  const score = clampScore(scorePercent);
  return opUpdateModule(s, moduleId, (m) => ({
    ...m,
    test: { best: Math.max(m.test?.best ?? 0, score), last: score, attempts: (m.test?.attempts ?? 0) + 1, lastAt: new Date().toISOString() },
  }));
};

export const opSaveExerciseResult = (s: ProgressState, moduleId: string, exerciseId: string, scorePercent: number) => {
  const score = clampScore(scorePercent);
  return opUpdateModule(s, moduleId, (m) => {
    const previous = m.exercises?.[exerciseId];
    return {
      ...m,
      exercises: {
        ...m.exercises,
        [exerciseId]: { best: Math.max(previous?.best ?? 0, score), last: score, attempts: (previous?.attempts ?? 0) + 1, lastAt: new Date().toISOString() },
      },
    };
  });
};

export const opTouchModule = (s: ProgressState, moduleId: string) => (s.lastModuleId === moduleId ? s : { ...s, lastModuleId: moduleId });
export const opTouchDeck = (s: ProgressState, moduleId: string) => (s.lastDeckId === moduleId ? s : { ...s, lastDeckId: moduleId });

export const opSetCards = (s: ProgressState, moduleId: string, fn: (cards: UserFlashcard[]) => UserFlashcard[]): ProgressState => ({
  ...s,
  updatedAt: new Date().toISOString(),
  cards: { ...s.cards, [moduleId]: fn(s.cards?.[moduleId] ?? []) },
});

export const makeCard = (moduleId: string, draft: Omit<UserFlashcard, 'id' | 'createdAt'>): UserFlashcard => ({
  ...draft,
  id: newCardId(moduleId),
  createdAt: new Date().toISOString(),
});

export const opAddCard = (s: ProgressState, moduleId: string, card: UserFlashcard) => opSetCards(s, moduleId, (cards) => [...cards, card]);

export const opUpdateCard = (s: ProgressState, moduleId: string, cardId: string, patch: Partial<UserFlashcard>) =>
  opSetCards(s, moduleId, (cards) => cards.map((c) => (c.id === cardId ? { ...c, ...patch, id: cardId, updatedAt: new Date().toISOString() } : c)));

/** Drops the card and its status. */
export const opRemoveCard = (s: ProgressState, moduleId: string, cardId: string) =>
  opUpdateModule(
    opSetCards(s, moduleId, (cards) => cards.filter((c) => c.id !== cardId)),
    moduleId,
    (m) => withStatus(m, cardId, 'none'),
  );

export const findCard = (s: ProgressState, moduleId: string, cardId: string): { card: UserFlashcard; status: CardStatus } | undefined => {
  const card = s.cards?.[moduleId]?.find((c) => c.id === cardId);
  return card ? { card, status: statusIn(s.modules[moduleId], cardId) } : undefined;
};

export const opRestoreCard = (s: ProgressState, moduleId: string, card: UserFlashcard, status: CardStatus) =>
  opUpdateModule(
    opSetCards(s, moduleId, (cards) => [...cards, card]),
    moduleId,
    (m) => withStatus(m, card.id, status),
  );

/** Statuses and results go; the learner's own cards are their writing and stay. */
export const opReset = (s: ProgressState): ProgressState => (s.cards ? { ...emptyProgressState(), cards: s.cards } : emptyProgressState());

/* ---------- Guest progress: counting and merging into an account ---------- */

/** What the guest did: checked gap-fills and exercises, finished tests; and how many cards they wrote. */
export const countGuestWork = (guest: ProgressState): { exercises: number; cards: number } => {
  let exercises = 0;
  for (const m of Object.values(guest.modules)) {
    exercises += Object.values(m.gapWork ?? {}).filter((w) => w.checked && !w.revealed).length;
    exercises += Object.values(m.exerciseWork ?? {}).filter((w) => w.checked && !w.revealed).length;
    if (m.test?.attempts) exercises += 1;
  }
  const cards = Object.values(guest.cards ?? {}).reduce((n, list) => n + list.length, 0);
  return { exercises, cards };
};

const mergeModule = (account: ModuleProgress, guest: ModuleProgress): ModuleProgress => {
  const known = new Set([...account.mastered, ...account.review]);
  const merged: ModuleProgress = {
    ...account,
    mastered: [...account.mastered, ...guest.mastered.filter((id) => !known.has(id))],
    review: [...account.review, ...guest.review.filter((id) => !known.has(id))],
    gapWork: { ...guest.gapWork, ...account.gapWork },
    exerciseWork: { ...guest.exerciseWork, ...account.exerciseWork },
    exercises: { ...guest.exercises, ...account.exercises },
  };
  if (guest.test && (!account.test || guest.test.best > account.test.best)) merged.test = guest.test;
  if (!account.testWork && guest.testWork) merged.testWork = guest.testWork;
  if (!account.essay && guest.essay) merged.essay = guest.essay;
  if (!account.pictureNotes && guest.pictureNotes) merged.pictureNotes = guest.pictureNotes;
  return merged;
};

/**
 * The account's progress with the guest's on top: a module the account lacks comes whole; otherwise the
 * account's work wins and only what it lacks is added. Cards join unless the front already exists in that deck.
 */
export const mergeGuestProgress = (account: ProgressState, guest: ProgressState): ProgressState => {
  const modules = { ...account.modules };
  for (const [id, m] of Object.entries(guest.modules)) modules[id] = modules[id] ? mergeModule(modules[id], m) : m;
  const cards = { ...account.cards };
  for (const [id, list] of Object.entries(guest.cards ?? {})) {
    const existing = cards[id] ?? [];
    const fronts = new Set(existing.map((c) => normalise(c.front)));
    const fresh = list.filter((c) => !fronts.has(normalise(c.front)));
    if (fresh.length) cards[id] = [...existing, ...fresh];
  }
  return { ...account, modules, cards, updatedAt: new Date().toISOString() };
};
