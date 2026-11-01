import { db, guarded, isTeacher, json, notFound } from './_lib/http.js';

/** One line per learner for the class page: how many notes, the latest date and the pinned note. */
export const GET = guarded(async (req) => {
  if (!(await isTeacher(req))) return notFound();

  const rows = await db()`
    select student_id, count(*)::int as count, max(created_at) as last_at,
           (array_agg(text order by created_at desc) filter (where pinned))[1] as pinned_text
    from teacher_notes
    group by student_id`;
  return json({
    summary: Object.fromEntries(rows.map((r) => [r.student_id, { count: r.count, lastAt: r.last_at, pinnedText: r.pinned_text ?? undefined }])),
  });
});
