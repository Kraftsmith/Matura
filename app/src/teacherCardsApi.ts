import type { TeacherFlashcard } from './types';

/** What the dialog fills in; the server adds the id, the learner and the dates. */
export type CardDraft = Pick<
  TeacherFlashcard,
  'front' | 'partOfSpeech' | 'backMeaningPl' | 'backMeaningRu' | 'backMeaningEn' | 'exampleSentence' | 'exampleTranslation' | 'exampleTranslationRu' | 'category' | 'sourceRef'
>;

/** The session ended on the server: writes answer 404 to anyone who is not the teacher. */
export class CardsSignedOutError extends Error {}
/** The word is already in this learner's deck. */
export class DuplicateCardError extends Error {}

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  if (res.status === 404) throw new CardsSignedOutError();
  if (res.status === 409) throw new DuplicateCardError();
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
};

const jsonBody = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const listCards = (studentId: string) => request<{ cards: TeacherFlashcard[] }>(`/api/students/${studentId}/cards`).then((r) => r.cards);

export const createCard = (studentId: string, moduleId: string, draft: CardDraft) =>
  request<{ card: TeacherFlashcard }>(`/api/students/${studentId}/cards`, jsonBody('POST', { ...draft, moduleId })).then((r) => r.card);

export const patchCard = (id: string, draft: CardDraft) => request<{ card: TeacherFlashcard }>(`/api/cards/${id}`, jsonBody('PATCH', draft)).then((r) => r.card);

/** keepalive: the delayed delete must still go out when the teacher leaves the page. */
export const deleteCard = (id: string) => request<{ ok: boolean }>(`/api/cards/${id}`, { method: 'DELETE', keepalive: true });
