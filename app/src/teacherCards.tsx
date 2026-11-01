import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TeacherFlashcard } from './types';
import type { TeacherCards } from './decks';
import { TeacherCardsContext, type TeacherCardsValue } from './teacher-cards-context';
import { createCard as postCard, deleteCard, listCards, patchCard } from './teacherCardsApi';
import { useUser } from './useUser';
import { students } from './users';

const STORAGE_KEY = 'matura.teacherCards.v1';
const POLL_MS = 20_000;
const UNDO_MS = 8000;
const NO_CARDS: TeacherCards = {};

type Stored = Record<string, TeacherFlashcard[]>;

/** The copy keeps decks and counters steady without a network and tells new cards from ones already seen. */
const readStored = (): Stored => {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Stored) : {};
  } catch {
    return {};
  }
};

const groupByModule = (cards: TeacherFlashcard[]): TeacherCards => {
  const grouped: TeacherCards = {};
  for (const card of cards) (grouped[card.moduleId] ??= []).push(card);
  return grouped;
};

interface PendingRemove {
  card: TeacherFlashcard;
  timer: ReturnType<typeof setTimeout>;
  onFailed: () => void;
}

export const TeacherCardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const isTeacher = user.role === 'teacher';
  const [stored, setStored] = useState<Stored>(readStored);
  const [arrived, setArrived] = useState<TeacherFlashcard[]>([]);
  const [hiddenId, setHiddenId] = useState<string>();
  const [live, setLive] = useState(false);
  const pending = useRef<PendingRemove>(undefined);
  const known = useRef<Stored>(undefined);

  const loadOne = useCallback((studentId: string, announce: boolean) => {
    listCards(studentId)
      .then((cards) => {
        known.current ??= readStored();
        const seen = new Set((known.current[studentId] ?? []).map((c) => c.id));
        const fresh = cards.filter((c) => !seen.has(c.id));
        known.current = { ...known.current, [studentId]: cards };
        if (announce && fresh.length > 0) setArrived((list) => [...list, ...fresh]);
        // The same answer every 20 seconds must not rebuild the open deck.
        setStored((prev) => (JSON.stringify(prev[studentId] ?? []) === JSON.stringify(cards) ? prev : { ...prev, [studentId]: cards }));
      })
      .catch(() => {
        /* offline, or the local dev server has no API: the saved copy stays in use */
      });
  }, []);

  const load = useCallback(() => {
    if (isTeacher) for (const s of students) loadOne(s.id, false);
    else loadOne(user.id, true);
  }, [isTeacher, user.id, loadOne]);

  useEffect(load, [load]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  // Only the learner waits for cards, and only where they matter: an open tab must not keep the database awake.
  useEffect(() => {
    if (!live || isTeacher) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [live, isTeacher, load]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable: the cards come from the server on the next visit */
    }
  }, [stored]);

  const put = useCallback((card: TeacherFlashcard) => {
    setStored((prev) => {
      const list = prev[card.studentId] ?? [];
      const next = list.some((c) => c.id === card.id) ? list.map((c) => (c.id === card.id ? card : c)) : [...list, card];
      return { ...prev, [card.studentId]: next };
    });
  }, []);

  const drop = useCallback((card: TeacherFlashcard) => {
    setStored((prev) => ({ ...prev, [card.studentId]: (prev[card.studentId] ?? []).filter((c) => c.id !== card.id) }));
  }, []);

  const createCard = useCallback<TeacherCardsValue['createCard']>(
    async (studentId, moduleId, draft) => {
      const card = await postCard(studentId, moduleId, draft);
      put(card);
      return card;
    },
    [put],
  );

  const updateCard = useCallback<TeacherCardsValue['updateCard']>(
    async (card, draft) => {
      const saved = await patchCard(card.id, draft);
      put(saved);
      return saved;
    },
    [put],
  );

  const flushRemove = useCallback(() => {
    const current = pending.current;
    if (!current) return;
    clearTimeout(current.timer);
    pending.current = undefined;
    setHiddenId(undefined);
    drop(current.card);
    deleteCard(current.card.id).catch(() => {
      put(current.card);
      current.onFailed();
    });
  }, [drop, put]);

  const removeCard = useCallback<TeacherCardsValue['removeCard']>(
    (card, onFailed) => {
      flushRemove();
      setHiddenId(card.id);
      pending.current = { card, onFailed, timer: setTimeout(flushRemove, UNDO_MS) };
    },
    [flushRemove],
  );

  const undoRemove = useCallback(() => {
    const current = pending.current;
    if (!current) return;
    clearTimeout(current.timer);
    pending.current = undefined;
    setHiddenId(undefined);
  }, []);

  // Leaving the page ends the undo window: the delete still has to happen.
  useEffect(() => {
    window.addEventListener('pagehide', flushRemove);
    return () => window.removeEventListener('pagehide', flushRemove);
  }, [flushRemove]);

  const grouped = useMemo(() => {
    const all: Record<string, TeacherCards> = {};
    for (const [id, cards] of Object.entries(stored)) all[id] = groupByModule(cards.filter((c) => c.id !== hiddenId));
    return all;
  }, [stored, hiddenId]);

  const cardsOf = useCallback((studentId: string) => grouped[studentId] ?? NO_CARDS, [grouped]);
  const clearArrived = useCallback(() => setArrived([]), []);

  const value = useMemo<TeacherCardsValue>(
    () => ({ cardsOf, arrived, clearArrived, setLive, createCard, updateCard, removeCard, undoRemove }),
    [cardsOf, arrived, clearArrived, createCard, updateCard, removeCard, undoRemove],
  );

  return <TeacherCardsContext.Provider value={value}>{children}</TeacherCardsContext.Provider>;
};
