export const NOTE_TAGS = ['general', 'mistakes', 'homework', 'lesson', 'parents'] as const;
export type NoteTag = (typeof NOTE_TAGS)[number];

export interface TeacherNote {
  id: string;
  studentId: string;
  text: string;
  tag: NoteTag;
  moduleId?: string;
  /** The lesson the note is about, when it was written from the calendar. */
  lessonId?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDraft {
  text: string;
  tag: NoteTag;
  moduleId?: string;
  lessonId?: string;
}

export type NotePatch = Partial<Pick<TeacherNote, 'text' | 'tag' | 'pinned'>> & { moduleId?: string | null };

export interface NotesSummary {
  count: number;
  lastAt: string;
  pinnedText?: string;
}

/** The session ended on the server. Notes answer 404 to anyone who is not the teacher. */
export class SignedOutError extends Error {}

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  if (res.status === 404) throw new SignedOutError();
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
};

const jsonBody = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const listNotes = (studentId: string) => request<{ notes: TeacherNote[] }>(`/api/students/${studentId}/notes`).then((r) => r.notes);

export const createNote = (studentId: string, draft: NoteDraft) =>
  request<{ note: TeacherNote }>(`/api/students/${studentId}/notes`, jsonBody('POST', draft)).then((r) => r.note);

export const patchNote = (id: string, patch: NotePatch) => request<{ note: TeacherNote }>(`/api/notes/${id}`, jsonBody('PATCH', patch)).then((r) => r.note);

/** keepalive: the delayed delete must still go out when the teacher leaves the page. */
export const deleteNote = (id: string) => request<{ ok: boolean }>(`/api/notes/${id}`, { method: 'DELETE', keepalive: true });

export const fetchSummary = () => request<{ summary: Record<string, NotesSummary> }>('/api/notes-summary').then((r) => r.summary);
