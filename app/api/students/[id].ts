import { validDate, validGoal, validLevel } from '../_lib/account.js';
import { badRequest, db, guarded, json, notFound, requireStudentOf } from '../_lib/http.js';

// /api/students/<id>: only for the teacher of this learner, everyone else gets 404.
const studentIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

/** The teacher plans the exam with the learner. Name, email and password stay the learner's. */
export const PATCH = guarded(async (req) => {
  const studentId = studentIdOf(req);
  if (!(await requireStudentOf(req, studentId))) return notFound();

  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const examDate = body.examDate ?? null;
  const level = body.level ?? null;
  const goal = body.goal ?? null;
  if (!validDate(examDate) || !validLevel(level) || !validGoal(goal)) return badRequest();

  await db()`update users set exam_date = ${examDate}, level = ${level}, goal = ${goal} where id = ${studentId}`;
  return json({ ok: true });
});

/**
 * ?what=progress clears the learner's results; their own flashcards and the notes stay.
 * Otherwise the learner leaves the class. Notes stay too and come back if they return.
 */
export const DELETE = guarded(async (req) => {
  const studentId = studentIdOf(req);
  const teacher = await requireStudentOf(req, studentId);
  if (!teacher) return notFound();
  const sql = db();

  if (new URL(req.url).searchParams.get('what') === 'progress') {
    await sql`update progress set data = data - 'module', updated_at = now() where user_id = ${studentId}`;
    await sql`update users set progress_meta = '{}' where id = ${studentId}`;
  } else {
    await sql`delete from teacher_students where teacher_id = ${teacher.id} and student_id = ${studentId}`;
  }
  return json({ ok: true });
});
