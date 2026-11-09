import { describe, expect, it } from 'vitest';
import { toHomework, toLesson, toMyHomework, toMyLesson } from './scheduleShapes.js';

const at = new Date('2026-11-11T16:00:00Z');

// Rows carry more than the learner may see; the mappers must drop it even when a column is added later.
const lessonRow = {
  id: 'l1',
  teacher_id: 't1',
  series_id: 's1',
  occurrence_date: new Date('2026-11-11T00:00:00Z'),
  starts_at: at,
  duration_min: 60,
  status: 'planned',
  cancelled_by: null,
  moved_to: null,
  plan: 'Plan',
  summary: '',
  created_at: at,
  updated_at: at,
  participant_count: '2',
  secret_column: 'never',
};

describe('what a learner is told about a lesson', () => {
  it('has only the fields of the spec: no teacher, no names, no attendance', () => {
    const mine = toMyLesson(lessonRow);
    expect(Object.keys(mine).sort()).toEqual(['durationMin', 'id', 'movedTo', 'participantCount', 'plan', 'startsAt', 'status', 'summary']);
    expect(mine.participantCount).toBe(2);
    expect(mine.startsAt).toBe('2026-11-11T16:00:00.000Z');
    expect(mine.movedTo).toBeUndefined();
    expect(JSON.stringify(mine)).not.toContain('t1');
    expect(JSON.stringify(mine)).not.toContain('never');
  });
});

describe('what a learner is told about a homework', () => {
  const hwRow = { id: 'h1', teacher_id: 't1', lesson_id: 'l1', due_at: at, created_at: at, updated_at: at, assigned_at: at };
  const items = [
    { id: 'i1', homework_id: 'h1', position: 0, kind: 'link', target: 'czlowiek/pisanie', text: '', created_at: at },
    { id: 'i2', homework_id: 'h1', position: 1, kind: 'text', target: null, text: 'Rozdział 3', created_at: at },
  ];

  it('keeps the learner\'s own ticks only and nothing about other learners', () => {
    const mine = toMyHomework(hwRow, items, [{ item_id: 'i2', student_id: 'me', by: 'student', done_at: at }]);
    expect(Object.keys(mine).sort()).toEqual(['assignedAt', 'dueAt', 'id', 'items', 'lessonId']);
    expect(mine.items.map((i) => Object.keys(i).sort())).toEqual([
      ['createdAt', 'id', 'kind', 'position', 'target', 'text', 'tick'],
      ['createdAt', 'id', 'kind', 'position', 'target', 'text', 'tick'],
    ]);
    expect(mine.items[0].tick).toBeUndefined();
    expect(mine.items[1].tick).toEqual({ by: 'student', doneAt: '2026-11-11T16:00:00.000Z' });
    expect(JSON.stringify(mine)).not.toContain('t1');
    expect(JSON.stringify(mine)).not.toContain('student_id');
  });

  it('gives the teacher every learner and every tick', () => {
    const full = toHomework(
      hwRow,
      items,
      [
        { homework_id: 'h1', student_id: 'maria', assigned_at: at },
        { homework_id: 'h1', student_id: 'evgeny', assigned_at: at },
      ],
      [
        { item_id: 'i2', student_id: 'maria', by: 'student', done_at: at },
        { item_id: 'i1', student_id: 'evgeny', by: 'teacher', done_at: at },
      ],
    );
    expect(full.students.map((s) => s.id)).toEqual(['maria', 'evgeny']);
    expect(full.ticks).toEqual({
      i2: { maria: { by: 'student', doneAt: '2026-11-11T16:00:00.000Z' } },
      i1: { evgeny: { by: 'teacher', doneAt: '2026-11-11T16:00:00.000Z' } },
    });
  });
});

describe('what the teacher is told about a lesson', () => {
  it('includes names and attendance', () => {
    const lesson = toLesson(lessonRow, [{ lesson_id: 'l1', student_id: 'maria', name: 'Maria', attendance: null }], []);
    expect(lesson.participants).toEqual([{ id: 'maria', name: 'Maria', attendance: undefined }]);
    expect(lesson.seriesId).toBe('s1');
    expect(lesson.homework).toEqual([]);
  });
});
