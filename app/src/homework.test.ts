import { describe, expect, it } from 'vitest';
import { vocabularyExercisesByText } from './data/vocabularyExercises';
import { assignedAtOf, defaultDueAt, homeworkItemStatus, homeworkProgress, myHomeworkProgress, selfTickable } from './homework';
import { emptyModuleProgress, type ModuleProgress, type ProgressState } from './progress-context';
import type { Homework, HomeworkItem, Lesson } from './schedule';

const GIVEN = '2026-11-10T00:00:00.000Z';
const BEFORE = '2026-11-09T10:00:00.000Z';
const AFTER = '2026-11-11T10:00:00.000Z';

const item = (target: string | undefined, text = ''): HomeworkItem => ({ id: `item-${target ?? text}`, position: 0, kind: target ? 'link' : 'text', target, text, createdAt: GIVEN });

const state = (module: Partial<ModuleProgress>, cards = 0): ProgressState => ({
  version: 1,
  modules: { czlowiek: { ...emptyModuleProgress(), ...module } },
  cards: { czlowiek: Array.from({ length: cards }, (_, i) => ({ id: `u-${i}`, front: '', partOfSpeech: 'noun', backMeaningPl: '', exampleSentence: '', category: '', source: 'manual', createdAt: GIVEN })) },
});

describe('homeworkItemStatus', () => {
  it('a text task is to do until someone ticks it', () => {
    const task = item(undefined, 'Przeczytaj rozdział 3');
    expect(homeworkItemStatus(task, undefined, GIVEN).state).toBe('todo');
    expect(homeworkItemStatus(task, undefined, GIVEN, { by: 'student', doneAt: AFTER }).state).toBe('done');
    expect(selfTickable(task)).toBe(true);
  });

  it('a Słownictwo text counts once its gap-fill was checked after it was given', () => {
    const task = item('czlowiek/slownictwo/czl-txt-1');
    const total = vocabularyExercisesByText['czl-txt-1'].items.length;
    expect(homeworkItemStatus(task, state({}), GIVEN).state).toBe('todo');
    expect(homeworkItemStatus(task, state({ gapWork: { 'czl-txt-1': { values: [], checked: false, at: AFTER } } }), GIVEN).state).toBe('todo');
    const done = homeworkItemStatus(task, state({ gapWork: { 'czl-txt-1': { values: [], checked: true, best: 8, at: AFTER } } }), GIVEN);
    expect(done.state).toBe('done');
    expect(done.evidence).toMatchObject({ kind: 'gap', score: { value: 8, of: total, unit: 'count' }, revealed: false });
    const earlier = homeworkItemStatus(task, state({ gapWork: { 'czl-txt-1': { values: [], checked: true, best: 8, at: BEFORE } } }), GIVEN);
    expect(earlier.state).toBe('earlier');
    expect(earlier.evidence.at).toBe(BEFORE);
    const peeked = homeworkItemStatus(task, state({ gapWork: { 'czl-txt-1': { values: [], checked: true, revealed: true, at: AFTER } } }), GIVEN);
    expect(peeked.state).toBe('done');
    expect(peeked.evidence.revealed).toBe(true);
    expect(selfTickable(task)).toBe(false);
  });

  it('a Środki językowe exercise counts from its last check and warns below the pass mark', () => {
    const task = item('czlowiek/srodki/czl-sj-1');
    const low = homeworkItemStatus(task, state({ exercises: { 'czl-sj-1': { best: 70, last: 70, attempts: 1, lastAt: AFTER } } }), GIVEN);
    expect(low.state).toBe('done');
    expect(low.evidence).toMatchObject({ kind: 'exercise', score: { value: 70, unit: 'percent' }, warn: true });
    const high = homeworkItemStatus(task, state({ exercises: { 'czl-sj-1': { best: 90, last: 90, attempts: 2, lastAt: AFTER } } }), GIVEN);
    expect(high.evidence.warn).toBe(false);
    expect(selfTickable(task)).toBe(false);
  });

  it('the grammar test counts from its last run', () => {
    const task = item('czlowiek/gramatyka/test');
    const s = state({ test: { best: 85, last: 60, attempts: 2, lastAt: AFTER } });
    const status = homeworkItemStatus(task, s, GIVEN);
    expect(status.state).toBe('done');
    expect(status.evidence).toMatchObject({ kind: 'test', score: { value: 60, unit: 'percent' }, warn: true });
    expect(homeworkItemStatus(task, state({ test: { best: 85, last: 85, attempts: 1, lastAt: BEFORE } }), GIVEN).state).toBe('earlier');
    expect(selfTickable(task)).toBe(false);
  });

  it('the essay counts when there is text saved after it was given', () => {
    const task = item('czlowiek/pisanie');
    expect(homeworkItemStatus(task, state({ essay: { text: '   ', at: AFTER } }), GIVEN).state).toBe('todo');
    const status = homeworkItemStatus(task, state({ essay: { text: 'Dear Sir, I am writing', at: AFTER } }), GIVEN);
    expect(status.state).toBe('done');
    expect(status.evidence.score).toEqual({ value: 5, unit: 'words' });
    expect(selfTickable(task)).toBe(false);
  });

  it('a grammar rule, the picture page and a deck are ticked by hand', () => {
    for (const target of ['czlowiek/gramatyka/gram-1', 'czlowiek/opis-foto', 'czlowiek/slownictwo', 'fiszki/czlowiek']) {
      const task = item(target);
      expect(homeworkItemStatus(task, state({ mastered: ['a', 'b'], test: { best: 100, last: 100, attempts: 1, lastAt: AFTER } }), GIVEN).state).toBe('todo');
      expect(selfTickable(task)).toBe(true);
    }
    const deck = homeworkItemStatus(item('fiszki/czlowiek'), state({ mastered: ['a', 'b', 'c'] }, 2), GIVEN);
    expect(deck.evidence.kind).toBe('deck');
    expect(deck.evidence.score?.value).toBe(3);
    expect(deck.evidence.score?.of).toBeGreaterThan(2);
  });

  it('the teacher\'s tick wins over missing work', () => {
    const status = homeworkItemStatus(item('czlowiek/srodki/czl-sj-1'), state({}), GIVEN, { by: 'teacher', doneAt: AFTER });
    expect(status.state).toBe('done');
    expect(status.tick?.by).toBe('teacher');
  });

  it('a page that no longer exists is just a manual item', () => {
    const task = item('czlowiek/slownictwo/gone-text');
    expect(homeworkItemStatus(task, state({}), GIVEN).state).toBe('todo');
    expect(selfTickable(task)).toBe(true);
  });
});

describe('homework progress', () => {
  const hw: Homework = {
    id: 'hw',
    dueAt: '2026-11-13T16:00:00.000Z',
    createdAt: GIVEN,
    items: [item('czlowiek/gramatyka/test'), item(undefined, 'Rozdział 3')],
    students: [
      { id: 'maria', assignedAt: GIVEN },
      { id: 'evgeny', assignedAt: '2026-11-12T00:00:00.000Z' },
    ],
    ticks: { 'item-Rozdział 3': { maria: { by: 'student', doneAt: AFTER } } },
  };

  it('counts each learner separately and from their own assignment', () => {
    const s = state({ test: { best: 90, last: 90, attempts: 1, lastAt: AFTER } });
    expect(homeworkProgress(hw, 'maria', s, Date.parse('2026-11-12T00:00:00Z'))).toEqual({ done: 2, total: 2, complete: true, overdue: false });
    // Evgeny got it after his test run, so the test does not count for him.
    expect(homeworkProgress(hw, 'evgeny', s, Date.parse('2026-11-12T00:00:00Z'))).toEqual({ done: 0, total: 2, complete: false, overdue: false });
    expect(homeworkProgress(hw, 'evgeny', s, Date.parse('2026-11-14T00:00:00Z')).overdue).toBe(true);
    expect(assignedAtOf(hw, hw.items[0], 'evgeny')).toBe('2026-11-12T00:00:00.000Z');
  });

  it('does the same for the learner\'s own copy', () => {
    const mine = { id: 'hw', dueAt: hw.dueAt, assignedAt: GIVEN, items: [{ ...hw.items[0] }, { ...hw.items[1], tick: { by: 'student' as const, doneAt: AFTER } }] };
    expect(myHomeworkProgress(mine, state({}), Date.parse('2026-11-12T00:00:00Z'))).toEqual({ done: 1, total: 2, complete: false, overdue: false });
  });
});

describe('defaultDueAt', () => {
  const lesson = (id: string, startsAt: string, ids: string[], status: Lesson['status'] = 'planned'): Lesson => ({
    id,
    startsAt,
    durationMin: 60,
    status,
    plan: '',
    summary: '',
    participants: ids.map((x) => ({ id: x, name: x })),
    homework: [],
  });

  it('is the next lesson of the same learners', () => {
    const now = lesson('a', '2026-11-10T16:00:00Z', ['maria']);
    const next = lesson('b', '2026-11-17T16:00:00Z', ['maria']);
    const other = lesson('c', '2026-11-12T16:00:00Z', ['evgeny']);
    expect(defaultDueAt(now, [other, next, now])).toBe(next.startsAt);
  });

  it('skips cancelled lessons and falls back to a week later at 23:59 Warsaw time', () => {
    const now = lesson('a', '2026-11-10T16:00:00Z', ['maria']);
    const cancelled = lesson('b', '2026-11-17T16:00:00Z', ['maria'], 'cancelled');
    expect(defaultDueAt(now, [now, cancelled])).toBe('2026-11-17T22:59:00.000Z');
  });
});
