import { allModules } from './data/modulesData';
import { vocabularyExercisesByText } from './data/vocabularyExercises';
import { autoCounted, parseTarget, targetKind, type CourseTarget } from './courseTargets';
import { EXERCISE_PASS_SCORE, GRAMMAR_PASS_SCORE, type ProgressState } from './progress-context';
import { countWords } from './progressSummary';
import type { Homework, HomeworkItem, Lesson, MyHomework, Tick } from './schedule';
import { byStart } from './schedule';
import { addDays, dayOf, fromWarsaw } from './time';

export type ItemState = 'todo' | 'done' | 'earlier';

/** What the site found for the item: the saved work, or nothing. */
export interface ItemEvidence {
  kind: 'gap' | 'exercise' | 'test' | 'essay' | 'deck' | 'none';
  /** When the work was saved. */
  at?: string;
  /** "8/10", "72%", "140 słów" — built by the component from these parts. */
  score?: { value: number; of?: number; unit: 'count' | 'percent' | 'words' };
  /** Below the pass mark. */
  warn?: boolean;
  /** The key was shown, so the answers are not the learner's own. */
  revealed?: boolean;
}

export interface ItemStatus {
  state: ItemState;
  evidence: ItemEvidence;
  tick?: Tick;
}

const NONE: ItemEvidence = { kind: 'none' };

const evidenceFor = (target: CourseTarget, state: ProgressState | undefined): ItemEvidence => {
  const p = state?.modules[target.moduleId];
  switch (targetKind(target)) {
    case 'gap': {
      const work = p?.gapWork?.[target.item as string];
      const total = vocabularyExercisesByText[target.item as string]?.items.length ?? 0;
      if (!work?.checked) return { kind: 'gap' };
      return { kind: 'gap', at: work.at, score: { value: work.best ?? 0, of: total, unit: 'count' }, revealed: !!work.revealed };
    }
    case 'exercise': {
      const result = p?.exercises?.[target.item as string];
      if (!result) return { kind: 'exercise' };
      return { kind: 'exercise', at: result.lastAt, score: { value: result.best, unit: 'percent' }, warn: result.best < EXERCISE_PASS_SCORE, revealed: !!p?.exerciseWork?.[target.item as string]?.revealed };
    }
    case 'test': {
      const test = p?.test;
      if (!test) return { kind: 'test' };
      return { kind: 'test', at: test.lastAt, score: { value: test.last, unit: 'percent' }, warn: test.last < GRAMMAR_PASS_SCORE };
    }
    case 'essay': {
      const essay = p?.essay;
      if (!essay?.text.trim()) return { kind: 'essay' };
      return { kind: 'essay', at: essay.at, score: { value: countWords(essay.text), unit: 'words' } };
    }
    case 'deck': {
      const module = allModules.find((m) => m.id === target.moduleId);
      const size = (module?.flashcards.length ?? 0) + (state?.cards?.[target.moduleId]?.length ?? 0);
      return { kind: 'deck', score: { value: p?.mastered.length ?? 0, of: size, unit: 'count' } };
    }
    default:
      return NONE;
  }
};

/**
 * One homework item for one learner. A tick by anyone settles it; otherwise work the site saved after the item
 * was given counts, work from before is shown as "done earlier" for the teacher to accept.
 */
export const homeworkItemStatus = (item: HomeworkItem, state: ProgressState | undefined, assignedAt: string, tick?: Tick): ItemStatus => {
  const target = item.kind === 'link' && item.target ? parseTarget(item.target) : undefined;
  const evidence = target ? evidenceFor(target, state) : NONE;
  if (tick) return { state: 'done', evidence, tick };
  if (!target || !autoCounted(target) || !evidence.at) return { state: 'todo', evidence };
  return { state: evidence.at >= assignedAt ? 'done' : 'earlier', evidence };
};

/** Whether the learner may tick this item by hand: text tasks and pages the site cannot count. */
export const selfTickable = (item: HomeworkItem): boolean => {
  if (item.kind === 'text') return true;
  const target = item.target ? parseTarget(item.target) : undefined;
  return !target || !autoCounted(target);
};

/** The moment an item counts from for a learner: the later of the homework being given and the item being added. */
export const assignedAtOf = (hw: { students: { id: string; assignedAt: string }[] }, item: HomeworkItem, studentId: string): string => {
  const given = hw.students.find((s) => s.id === studentId)?.assignedAt ?? item.createdAt;
  return given > item.createdAt ? given : item.createdAt;
};

export interface HomeworkProgress {
  done: number;
  total: number;
  complete: boolean;
  overdue: boolean;
}

/** A learner's standing on a homework, as the teacher's views count it. */
export const homeworkProgress = (hw: Homework, studentId: string, state: ProgressState | undefined, now = Date.now()): HomeworkProgress => {
  const done = hw.items.filter((item) => homeworkItemStatus(item, state, assignedAtOf(hw, item, studentId), hw.ticks[item.id]?.[studentId]).state === 'done').length;
  const complete = done === hw.items.length;
  return { done, total: hw.items.length, complete, overdue: !complete && new Date(hw.dueAt).getTime() < now };
};

/** The same for the learner's own copy. */
export const myHomeworkProgress = (hw: MyHomework, state: ProgressState | undefined, now = Date.now()): HomeworkProgress => {
  const done = hw.items.filter((item) => homeworkItemStatus(item, state, hw.assignedAt > item.createdAt ? hw.assignedAt : item.createdAt, item.tick).state === 'done').length;
  const complete = done === hw.items.length;
  return { done, total: hw.items.length, complete, overdue: !complete && new Date(hw.dueAt).getTime() < now };
};

/**
 * The deadline a new homework gets: the next planned lesson with the same learners, else a week from the lesson
 * at 23:59 Warsaw time.
 */
export const defaultDueAt = (lesson: Lesson, lessons: Lesson[]): string => {
  const ids = new Set(lesson.participants.map((p) => p.id));
  const next = lessons
    .filter((l) => l.id !== lesson.id && l.status === 'planned' && l.startsAt > lesson.startsAt && lesson.participants.every((p) => l.participants.some((q) => q.id === p.id)))
    .sort(byStart)[0];
  if (next) return next.startsAt;
  const single = ids.size === 1 ? [...ids][0] : undefined;
  const own = single ? lessons.filter((l) => l.id !== lesson.id && l.status === 'planned' && l.startsAt > lesson.startsAt && l.participants.some((q) => q.id === single)).sort(byStart)[0] : undefined;
  return own?.startsAt ?? fromWarsaw(addDays(dayOf(lesson.startsAt), 7), '23:59');
};
