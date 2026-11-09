import { ApiError } from './accountApi';
import type { Homework, HomeworkDraft, Lesson, LessonPatch, MyHomework, MyLesson, NewLesson, Attendance, CancelledBy, LessonStatus } from './schedule';

// Everything lives behind /api/schedule?resource=…: the Hobby plan allows twelve functions and this is the twelfth.

const request = async <T>(method: string, resource: string, params: Record<string, string | undefined> = {}, body?: unknown): Promise<T> => {
  const query = new URLSearchParams({ resource });
  for (const [k, v] of Object.entries(params)) if (v !== undefined) query.set(k, v);
  const res = await fetch(`/api/schedule?${query}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new ApiError(res.status, data?.error);
  return data as T;
};

// Teacher

export interface Overview {
  lessons: Lesson[];
  homework: Homework[];
}

export const fetchLessons = (from: string, to: string) => request<{ lessons: Lesson[] }>('GET', 'lessons', { from, to }).then((r) => r.lessons);
/** Lessons around today and the recent homework of the class, for the class page, the lesson bar and the "Zadaj" dialog. */
export const fetchOverview = () => request<Overview>('GET', 'overview');
export const fetchLesson = (id: string) => request<{ lesson: Lesson }>('GET', 'lesson', { id }).then((r) => r.lesson);
export const fetchStudentSchedule = (studentId: string) => request<{ lessons: Lesson[]; homework: Homework[] }>('GET', 'student', { id: studentId });
export const createLesson = (draft: NewLesson) => request<{ lesson: Lesson }>('POST', 'lessons', {}, draft).then((r) => r.lesson);
export const patchLesson = (id: string, patch: LessonPatch) => request<{ lesson: Lesson; kept: Lesson[] }>('PATCH', 'lesson', { id }, patch);
export const setLessonStatus = (id: string, body: { status: LessonStatus; cancelledBy?: CancelledBy; attendance?: Record<string, Attendance> }) =>
  request<{ lesson: Lesson }>('POST', 'lesson-status', { id }, body).then((r) => r.lesson);
export const moveLesson = (id: string, date: string, time: string) => request<{ lesson: Lesson; moved: Lesson }>('POST', 'lesson-move', { id }, { date, time });
export const deleteLesson = (id: string) => request<{ ok: true }>('DELETE', 'lesson', { id });
export const createHomework = (draft: HomeworkDraft) => request<{ homework: Homework }>('POST', 'homework', {}, draft).then((r) => r.homework);
export const patchHomework = (id: string, patch: Partial<HomeworkDraft>) => request<{ homework: Homework }>('PATCH', 'homework', { id }, patch).then((r) => r.homework);
export const deleteHomework = (id: string) => request<{ ok: true }>('DELETE', 'homework', { id });
export const addTick = (itemId: string, studentId: string) => request<{ ok: true }>('POST', 'tick', { item: itemId, student: studentId });
export const removeTick = (itemId: string, studentId: string) => request<{ ok: true }>('DELETE', 'tick', { item: itemId, student: studentId });
/** "Zadaj" from a course page: the server picks or creates the homework for each learner. */
export const assignFromCourse = (body: { studentIds: string[]; target?: string; text: string; where: 'last' | 'next' }) =>
  request<{ homework: Homework[] }>('POST', 'assign', {}, body).then((r) => r.homework);

// Learner

export const fetchMyLessons = (from?: string, to?: string) => request<{ lessons: MyLesson[] }>('GET', 'my-lessons', { from, to }).then((r) => r.lessons);
export const fetchMyHomework = () => request<{ homework: MyHomework[] }>('GET', 'my-homework').then((r) => r.homework);
export const addMyTick = (itemId: string) => request<{ ok: true }>('POST', 'my-tick', { item: itemId });
export const removeMyTick = (itemId: string) => request<{ ok: true }>('DELETE', 'my-tick', { item: itemId });
