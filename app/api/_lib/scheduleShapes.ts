/**
 * Rows → JSON. The learner's shapes are built from their own field lists on purpose: a column added to the
 * teacher's answer tomorrow must not reach a learner by accident (spec §9.3).
 */

export type Row = Record<string, unknown>;

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : String(v));
const orUndefined = <T>(v: T | null | undefined): T | undefined => (v === null || v === undefined ? undefined : v);

export const toItem = (r: Row) => ({
  id: r.id as string,
  position: r.position as number,
  kind: r.kind as 'link' | 'text',
  target: orUndefined(r.target as string | null),
  text: r.text as string,
  createdAt: iso(r.created_at),
});

/** The teacher's homework: every learner it went to and every tick. */
export const toHomework = (r: Row, items: Row[], students: Row[], ticks: Row[]) => {
  const byItem: Record<string, Record<string, { by: string; doneAt: string }>> = {};
  for (const t of ticks) (byItem[t.item_id as string] ??= {})[t.student_id as string] = { by: t.by as string, doneAt: iso(t.done_at) };
  return {
    id: r.id as string,
    lessonId: orUndefined(r.lesson_id as string | null),
    dueAt: iso(r.due_at),
    createdAt: iso(r.created_at),
    items: items.map(toItem),
    students: students.map((s) => ({ id: s.student_id as string, assignedAt: iso(s.assigned_at) })),
    ticks: byItem,
  };
};

export const toLesson = (r: Row, participants: Row[], homework: ReturnType<typeof toHomework>[]) => ({
  id: r.id as string,
  seriesId: orUndefined(r.series_id as string | null),
  startsAt: iso(r.starts_at),
  durationMin: r.duration_min as number,
  status: r.status as string,
  cancelledBy: orUndefined(r.cancelled_by as string | null),
  movedTo: orUndefined(r.moved_to as string | null),
  plan: r.plan as string,
  summary: r.summary as string,
  participants: participants.map((p) => ({ id: p.student_id as string, name: p.name as string, attendance: orUndefined(p.attendance as string | null) })),
  homework,
});

/** A lesson for one of its learners: how many came, never who, and nobody's attendance. */
export const toMyLesson = (r: Row) => ({
  id: r.id as string,
  startsAt: iso(r.starts_at),
  durationMin: r.duration_min as number,
  status: r.status as string,
  movedTo: orUndefined(r.moved_to as string | null),
  plan: r.plan as string,
  summary: r.summary as string,
  participantCount: Number(r.participant_count),
});

/** A homework for one learner: their items and their own ticks only. */
export const toMyHomework = (r: Row, items: Row[], ticks: Row[]) => {
  const mine = new Map(ticks.map((t) => [t.item_id as string, { by: t.by as string, doneAt: iso(t.done_at) }]));
  return {
    id: r.id as string,
    lessonId: orUndefined(r.lesson_id as string | null),
    dueAt: iso(r.due_at),
    assignedAt: iso(r.assigned_at),
    items: items.map((i) => ({ ...toItem(i), tick: mine.get(i.id as string) })),
  };
};
