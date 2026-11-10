import type { I18nKey } from './i18n';
import { pluralForm } from './i18n';
import { clockOf, dayOf, formatDate, formatDayLong, formatMoment, formatSpan } from './time';

/** Notifications as the browser sees them (Spec - Powiadomienia). The text is built here from kind and data. */

export type NotificationKind = 'homework_done' | 'student_joined' | 'message' | 'homework_assigned' | 'lesson_added' | 'lesson_moved' | 'lesson_cancelled' | 'homework_due' | 'lesson_tomorrow';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  createdAt: string;
  readAt?: string;
  /** Only a teacher's message carries its own text. */
  text?: string;
  data: Record<string, unknown>;
  homeworkId?: string;
  lessonId?: string;
  /** Who caused it: the learner for homework_done, the teacher for message. Empty name once the account is gone. */
  actor?: { id: string; name: string };
}

export type Translate = (key: I18nKey, vars?: Record<string, string | number>) => string;

const str = (data: Record<string, unknown>, key: string): string | undefined => (typeof data[key] === 'string' ? (data[key] as string) : undefined);
const num = (data: Record<string, unknown>, key: string): number => (typeof data[key] === 'number' ? (data[key] as number) : 0);

/** Address inside the app the notification leads to: the learner's own lessons, or the learner's page for the teacher. */
export const notificationHref = (n: AppNotification): string => {
  switch (n.kind) {
    case 'homework_done':
      return n.actor ? `#dashboard/${n.actor.id}/zadania` : '#dashboard';
    case 'student_joined':
      return n.actor ? `#dashboard/${n.actor.id}` : '#dashboard';
    default:
      return '#zajecia';
  }
};

/** "Maria: zadanie domowe zrobione · do czw. 13.11", in the current interface language. */
export const notificationText = (n: AppNotification, t: Translate, locale: string): string => {
  const d = n.data;
  const name = n.actor?.name || t(n.kind === 'message' ? 'role.teacher' : 'role.student');
  const dueAt = str(d, 'dueAt');
  const startsAt = str(d, 'startsAt');
  switch (n.kind) {
    case 'homework_done':
      return t('ntf.homeworkDone', { name, date: dueAt ? formatMoment(dueAt, locale) : '' });
    case 'student_joined':
      return t('ntf.studentJoined', { name });
    case 'message':
      return n.text ?? '';
    case 'homework_assigned': {
      const n2 = num(d, 'itemCount');
      return t('ntf.homeworkAssigned', { items: t(`ntf.items${pluralForm(n2)}` as I18nKey, { n: n2 }), date: dueAt ? formatMoment(dueAt, locale) : '' });
    }
    case 'lesson_added':
      return t(d.weekly ? 'ntf.lessonAddedWeekly' : 'ntf.lessonAdded', { when: startsAt ? formatMoment(startsAt, locale) : '' });
    case 'lesson_moved': {
      const from = str(d, 'oldStartsAt');
      return t('ntf.lessonMoved', { from: from ? formatMoment(from, locale) : '', to: startsAt ? formatMoment(startsAt, locale) : '' });
    }
    case 'lesson_cancelled':
      return t('ntf.lessonCancelled', { when: startsAt ? formatMoment(startsAt, locale) : '' });
    case 'homework_due':
      return t('ntf.homeworkDue', { done: num(d, 'done'), total: num(d, 'total') });
    case 'lesson_tomorrow':
      return t('ntf.lessonTomorrow', { time: startsAt ? formatSpan(startsAt, num(d, 'durationMin')) : '' });
    default:
      return '';
  }
};

/** Second line under a message: "Nauczyciel · Anna Kowalska". Nothing for the other kinds. */
export const notificationByline = (n: AppNotification, t: Translate): string | undefined => (n.kind === 'message' ? t('ntf.fromTeacher', { name: n.actor?.name || t('role.teacher') }) : undefined);

/** "teraz", "5 min temu", "2 godz. temu", "wczoraj", then the date. */
export const formatAgo = (iso: string, now: number, t: Translate, locale: string): string => {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return t('ntf.now');
  if (minutes < 60) return t('ntf.minAgo', { n: minutes });
  const today = dayOf(new Date(now));
  const day = dayOf(iso);
  if (day === today) return t('ntf.hAgo', { n: Math.floor(minutes / 60) });
  if (day === dayOf(new Date(now - 86_400_000))) return `${t('ntf.yesterday')}, ${clockOf(iso)}`;
  return formatDate(day, locale);
};

/** Heading of a day group on the notifications page: "Dziś", "Wczoraj", "wtorek, 11 listopada". */
export const dayHeading = (day: string, now: number, t: Translate, locale: string): string => {
  if (day === dayOf(new Date(now))) return t('ntf.today');
  if (day === dayOf(new Date(now - 86_400_000))) return t('ntf.yesterday');
  return formatDayLong(day, locale);
};

/** Notifications in order, split by Warsaw day. */
export const groupByDay = (list: AppNotification[]): { day: string; items: AppNotification[] }[] => {
  const groups: { day: string; items: AppNotification[] }[] = [];
  for (const n of list) {
    const day = dayOf(n.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(n);
    else groups.push({ day, items: [n] });
  }
  return groups;
};

/** The ones that arrived since the last look: new ids that are unread. */
export const arrivedSince = (list: AppNotification[], known: Set<string>): AppNotification[] => list.filter((n) => !n.readAt && !known.has(n.id));

/** "(3) Matura English" while something is unread. */
export const titleWithCount = (base: string, unread: number): string => (unread > 0 ? `(${unread}) ${base}` : base);
