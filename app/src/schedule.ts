/** Lessons and homework as the browser sees them. The server decides who gets which shape (see api/_lib/scheduleShapes.ts). */

export type LessonStatus = 'planned' | 'held' | 'cancelled' | 'moved';
export type Attendance = 'present' | 'absent' | 'excused';
export type CancelledBy = 'student' | 'teacher';
export type TickBy = 'student' | 'teacher';

export interface Participant {
  id: string;
  name: string;
  attendance?: Attendance;
}

export interface HomeworkItem {
  id: string;
  position: number;
  kind: 'link' | 'text';
  /** Route of the course page for a link item. */
  target?: string;
  /** The task for a text item; a comment for a link item. */
  text: string;
  createdAt: string;
}

export interface Tick {
  by: TickBy;
  doneAt: string;
}

/** A homework as the teacher sees it: who got it and what every learner ticked. */
export interface Homework {
  id: string;
  lessonId?: string;
  dueAt: string;
  createdAt: string;
  items: HomeworkItem[];
  students: { id: string; assignedAt: string }[];
  /** item id → learner id → tick */
  ticks: Record<string, Record<string, Tick>>;
}

export interface Lesson {
  id: string;
  seriesId?: string;
  startsAt: string;
  durationMin: number;
  status: LessonStatus;
  cancelledBy?: CancelledBy;
  movedTo?: string;
  plan: string;
  summary: string;
  participants: Participant[];
  /** Homework given on this lesson. */
  homework: Homework[];
}

/** A lesson as one of its learners sees it: no names, no attendance of others. */
export interface MyLesson {
  id: string;
  startsAt: string;
  durationMin: number;
  status: LessonStatus;
  movedTo?: string;
  plan: string;
  summary: string;
  participantCount: number;
}

export interface MyHomeworkItem extends HomeworkItem {
  tick?: Tick;
}

export interface MyHomework {
  id: string;
  lessonId?: string;
  dueAt: string;
  assignedAt: string;
  items: MyHomeworkItem[];
}

export interface NewLesson {
  studentIds: string[];
  date: string;
  time: string;
  durationMin: number;
  plan: string;
  repeat?: 'weekly';
  until?: string;
}

export interface LessonPatch {
  date?: string;
  time?: string;
  durationMin?: number;
  studentIds?: string[];
  plan?: string;
  summary?: string;
  /** For a lesson of a series: this one, or this and the following ones. */
  scope?: 'one' | 'following';
}

export interface ItemDraft {
  /** Set for an item that already exists; its ticks are kept. */
  id?: string;
  kind: 'link' | 'text';
  target?: string;
  text: string;
}

export interface HomeworkDraft {
  lessonId?: string;
  studentIds: string[];
  dueAt: string;
  items: ItemDraft[];
}

export const lessonEnd = (l: { startsAt: string; durationMin: number }): number => new Date(l.startsAt).getTime() + l.durationMin * 60_000;

export const byStart = <T extends { startsAt: string }>(a: T, b: T) => a.startsAt.localeCompare(b.startsAt);

/** A lesson still waiting for the teacher's word after it should have ended. */
export const needsUpdate = (l: Lesson, now = Date.now()): boolean => l.status === 'planned' && lessonEnd(l) < now;

/** How long after the end the lesson still counts as "going on" in the lesson bar. */
const GRACE_MS = 15 * 60_000;

export const inProgress = (l: { startsAt: string; durationMin: number; status: LessonStatus }, now = Date.now()): boolean =>
  l.status === 'planned' && new Date(l.startsAt).getTime() <= now && lessonEnd(l) + GRACE_MS >= now;
