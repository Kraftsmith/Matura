import { ApiError } from './accountApi';
import type { AppNotification } from './notifications';

// The bell lives behind /api/me?resource=…, the learner's "done" behind /api/schedule, messages behind /api/students/<id>.

const request = async <T>(method: string, url: string, body?: unknown): Promise<T> => {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new ApiError(res.status, data?.error);
  return data as T;
};

export interface NotificationsPage {
  notifications: AppNotification[];
  unread: number;
}

export const fetchNotifications = (before?: string, limit?: number) => {
  const query = new URLSearchParams({ resource: 'notifications' });
  if (before) query.set('before', before);
  if (limit) query.set('limit', String(limit));
  return request<NotificationsPage>('GET', `/api/me?${query}`);
};

export const markNotificationsRead = (ids: string[]) => request<{ ok: true }>('POST', '/api/me?resource=notifications-read', { ids });
export const markAllNotificationsRead = () => request<{ ok: true }>('POST', '/api/me?resource=notifications-read', { all: true });

/** The learner's browser reports a finished homework; 409 means the server does not see the work yet. */
export const reportHomeworkDone = (homeworkId: string) => request<{ created: boolean }>('POST', `/api/schedule?resource=my-done&homework=${encodeURIComponent(homeworkId)}`);

export interface TeacherMessage {
  id: string;
  text: string;
  createdAt: string;
  readAt?: string;
  homeworkId?: string;
  lessonId?: string;
}

export const fetchMessages = (studentId: string) => request<{ messages: TeacherMessage[] }>('GET', `/api/students/${encodeURIComponent(studentId)}?what=messages`).then((r) => r.messages);
export const sendMessage = (studentId: string, body: { text: string; homeworkId?: string; lessonId?: string }) =>
  request<{ message: TeacherMessage }>('POST', `/api/students/${encodeURIComponent(studentId)}`, body).then((r) => r.message);
export const withdrawMessage = (studentId: string, messageId: string) =>
  request<{ ok: true }>('DELETE', `/api/students/${encodeURIComponent(studentId)}?message=${encodeURIComponent(messageId)}`);
