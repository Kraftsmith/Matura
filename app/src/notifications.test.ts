import { describe, expect, it } from 'vitest';
import { dictionaries, format, type I18nKey } from './i18n';
import { arrivedSince, dayHeading, formatAgo, groupByDay, notificationHref, notificationText, titleWithCount, type AppNotification } from './notifications';

const t = (key: I18nKey, vars?: Record<string, string | number>) => format(dictionaries.pl[key], vars);
const tEn = (key: I18nKey, vars?: Record<string, string | number>) => format(dictionaries.en[key], vars);

const make = (over: Partial<AppNotification>): AppNotification => ({ id: 'n1', kind: 'message', createdAt: '2026-11-11T10:00:00Z', data: {}, ...over });

describe('notification text', () => {
  it('names the learner and the deadline when homework is done', () => {
    const n = make({ kind: 'homework_done', actor: { id: 'maria', name: 'Maria' }, data: { dueAt: '2026-11-13T16:00:00Z' } });
    expect(notificationText(n, t, 'pl-PL')).toBe('Maria: zadanie domowe zrobione · do pt., 13.11, 17:00');
    expect(notificationHref(n)).toBe('#dashboard/maria/zadania');
  });

  it('falls back to the role when the account is gone', () => {
    expect(notificationText(make({ kind: 'student_joined' }), t, 'pl-PL')).toBe('Nowy uczeń w klasie: Uczeń');
    expect(notificationHref(make({ kind: 'student_joined' }))).toBe('#dashboard');
  });

  it('declines the items of a new homework in Polish and follows the interface language', () => {
    const n = make({ kind: 'homework_assigned', data: { dueAt: '2026-11-13T16:00:00Z', itemCount: 3 } });
    expect(notificationText(n, t, 'pl-PL')).toContain('3 punkty');
    expect(notificationText({ ...n, data: { ...n.data, itemCount: 5 } }, t, 'pl-PL')).toContain('5 punktów');
    expect(notificationText(n, tEn, 'en-GB')).toBe('New homework: 3 items · due Fri 13/11, 17:00');
    expect(notificationHref(n)).toBe('#zajecia');
  });

  it('shows both times of a moved lesson and the span of tomorrow’s', () => {
    expect(notificationText(make({ kind: 'lesson_moved', data: { oldStartsAt: '2026-11-10T16:00:00Z', startsAt: '2026-11-12T17:00:00Z' } }), t, 'pl-PL')).toBe('Zajęcia przeniesione: wt., 10.11, 17:00 → czw., 12.11, 18:00');
    expect(notificationText(make({ kind: 'lesson_tomorrow', data: { startsAt: '2026-11-12T16:00:00Z', durationMin: 60 } }), t, 'pl-PL')).toBe('Jutro zajęcia: 17:00–18:00');
  });

  it('keeps a message as the teacher wrote it', () => {
    expect(notificationText(make({ kind: 'message', text: '<b>Jutro</b> o 17:30' }), t, 'pl-PL')).toBe('<b>Jutro</b> o 17:30');
  });
});

describe('time words', () => {
  const now = Date.parse('2026-11-11T12:00:00Z');
  it('counts minutes and hours today, names yesterday, then dates', () => {
    expect(formatAgo('2026-11-11T11:59:40Z', now, t, 'pl-PL')).toBe('teraz');
    expect(formatAgo('2026-11-11T11:55:00Z', now, t, 'pl-PL')).toBe('5 min temu');
    expect(formatAgo('2026-11-11T09:30:00Z', now, t, 'pl-PL')).toBe('2 godz. temu');
    expect(formatAgo('2026-11-10T20:00:00Z', now, t, 'pl-PL')).toBe('Wczoraj, 21:00');
    expect(formatAgo('2026-11-02T20:00:00Z', now, t, 'pl-PL')).toBe('02.11');
  });

  it('heads the day groups', () => {
    expect(dayHeading('2026-11-11', now, t, 'pl-PL')).toBe('Dziś');
    expect(dayHeading('2026-11-10', now, t, 'pl-PL')).toBe('Wczoraj');
    expect(dayHeading('2026-11-05', now, t, 'pl-PL')).toBe('czwartek, 5 listopada');
  });
});

describe('lists', () => {
  it('groups by Warsaw day in the given order', () => {
    const list = [make({ id: 'a', createdAt: '2026-11-11T10:00:00Z' }), make({ id: 'b', createdAt: '2026-11-10T23:30:00Z' }), make({ id: 'c', createdAt: '2026-11-10T08:00:00Z' })];
    expect(groupByDay(list).map((g) => [g.day, g.items.map((n) => n.id)])).toEqual([
      ['2026-11-11', ['a', 'b']],
      ['2026-11-10', ['c']],
    ]);
  });

  it('picks the unread newcomers and counts them in the title', () => {
    const list = [make({ id: 'new' }), make({ id: 'old' }), make({ id: 'newRead', readAt: '2026-11-11T10:01:00Z' })];
    expect(arrivedSince(list, new Set(['old'])).map((n) => n.id)).toEqual(['new']);
    expect(titleWithCount('Matura English', 3)).toBe('(3) Matura English');
    expect(titleWithCount('Matura English', 0)).toBe('Matura English');
  });
});
