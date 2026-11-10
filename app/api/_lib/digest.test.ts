import { describe, expect, it } from 'vitest';
import { unreadLine } from './digest.js';

describe('digest lines', () => {
  it('writes each kind in the person’s language', () => {
    expect(unreadLine({ kind: 'homework_done', data: {}, actorName: 'Maria' }, 'pl')).toBe('Maria: zadanie domowe zrobione');
    expect(unreadLine({ kind: 'student_joined', data: {}, actorName: 'Evgeny' }, 'en')).toBe('New student in your class: Evgeny');
    expect(unreadLine({ kind: 'message', text: 'Jutro 17:30', data: {} }, 'pl')).toBe('Wiadomość od nauczyciela: Jutro 17:30');
    expect(unreadLine({ kind: 'homework_assigned', data: { dueAt: '2026-11-13T16:00:00Z' } }, 'pl')).toBe('Nowe zadanie domowe · do pt., 13.11, 17:00');
    expect(unreadLine({ kind: 'lesson_moved', data: { startsAt: '2026-11-13T16:00:00Z' } }, 'en')).toBe('Lesson moved to Fri 13/11, 17:00');
  });

  it('survives missing data', () => {
    expect(unreadLine({ kind: 'lesson_cancelled', data: {} }, 'pl')).toBe('Zajęcia odwołane: ');
    expect(unreadLine({ kind: 'homework_done', data: {} }, 'pl')).toBe(': zadanie domowe zrobione');
  });
});
