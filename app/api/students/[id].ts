import { validDate, validGoal, validLevel } from '../_lib/account.js';
import { badRequest, db, guarded, json, notFound, requireStudentOf } from '../_lib/http.js';
import { sendMail } from '../_lib/mail.js';
import { MAX_MESSAGE, notify } from '../_lib/notify.js';
import { addHit, hitCount } from '../_lib/rateLimit.js';
import { isUuid } from '../_lib/schedule.js';

// /api/students/<id>: only for the teacher of this learner, everyone else gets 404.
// GET ?what=messages lists the teacher's messages to the learner; POST sends one; DELETE ?message=<id> withdraws an unread one.
const studentIdOf = (req: Request) => new URL(req.url).pathname.split('/')[3];

/** Messages a teacher may send in a day: enough for a class, too few to flood anyone's inbox. */
const MAX_MESSAGES_PER_DAY = 30;

const toMessage = (r: Record<string, unknown>) => ({
  id: r.id as string,
  text: r.text as string,
  createdAt: (r.created_at as Date).toISOString(),
  readAt: r.read_at ? (r.read_at as Date).toISOString() : undefined,
  homeworkId: (r.homework_id as string | null) ?? undefined,
  lessonId: (r.lesson_id as string | null) ?? undefined,
});

/** Only the teacher's own messages: nothing else from the learner's notifications is ever listed here. */
export const GET = guarded(async (req) => {
  const studentId = studentIdOf(req);
  const teacher = await requireStudentOf(req, studentId);
  if (!teacher) return notFound();
  if (new URL(req.url).searchParams.get('what') !== 'messages') return notFound();
  const rows = await db()`
    select id, text, created_at, read_at, homework_id, lesson_id from notifications
    where user_id = ${studentId} and kind = 'message' and actor_id = ${teacher.id}
    order by created_at desc limit 100`;
  return json({ messages: rows.map(toMessage) });
});

/** A short message to the learner: on the site at once, by mail if they want it (Spec - Powiadomienia §7.3). */
export const POST = guarded(async (req) => {
  const studentId = studentIdOf(req);
  const teacher = await requireStudentOf(req, studentId);
  if (!teacher) return notFound();
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const { homeworkId, lessonId } = body;
  if (text.length < 1 || text.length > MAX_MESSAGE) return badRequest();
  if (homeworkId !== undefined && !isUuid(homeworkId)) return badRequest();
  if (lessonId !== undefined && !isUuid(lessonId)) return badRequest();

  const sql = db();
  if (homeworkId) {
    const [own] = await sql`
      select 1 from homework h join homework_students s on s.homework_id = h.id
      where h.id = ${homeworkId} and h.teacher_id = ${teacher.id} and s.student_id = ${studentId}`;
    if (!own) return badRequest();
  }
  if (lessonId) {
    const [own] = await sql`
      select 1 from lessons l join lesson_participants p on p.lesson_id = l.id
      where l.id = ${lessonId} and l.teacher_id = ${teacher.id} and p.student_id = ${studentId}`;
    if (!own) return badRequest();
  }

  const key = `msg:${teacher.id}`;
  if ((await hitCount(key, 24 * 60)) >= MAX_MESSAGES_PER_DAY) return json({ error: 'too_many' }, 429);
  await addHit(key);

  const [id] = await notify([studentId], 'message', { actorId: teacher.id, homeworkId: homeworkId as string | undefined, lessonId: lessonId as string | undefined, text });
  const [student] = await sql`select email, ui_lang, notify_mail_message from users where id = ${studentId}`;
  const [me] = await sql`select name from users where id = ${teacher.id}`;
  if (student?.email && student.notify_mail_message !== false) {
    sendMail('teacherMessage', student.email as string, student.ui_lang as string, 'powiadomienia', { teacher: me.name as string, text });
    await sql`update notifications set mailed_at = now() where id = ${id}`;
  }
  const [row] = await sql`select id, text, created_at, read_at, homework_id, lesson_id from notifications where id = ${id}`;
  return json({ message: toMessage(row) }, 201);
});

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
 * ?message=<id> withdraws a message the learner has not read yet (a read one answers 409).
 * ?what=progress clears the learner's results; their own flashcards and the notes stay.
 * Otherwise the learner leaves the class. Notes stay too and come back if they return.
 */
export const DELETE = guarded(async (req) => {
  const studentId = studentIdOf(req);
  const teacher = await requireStudentOf(req, studentId);
  if (!teacher) return notFound();
  const sql = db();
  const params = new URL(req.url).searchParams;

  const messageId = params.get('message');
  if (messageId !== null) {
    if (!isUuid(messageId)) return notFound();
    const [row] = await sql`select read_at from notifications where id = ${messageId} and user_id = ${studentId} and kind = 'message' and actor_id = ${teacher.id}`;
    if (!row) return notFound();
    if (row.read_at) return json({ error: 'conflict' }, 409);
    await sql`delete from notifications where id = ${messageId}`;
    return json({ ok: true });
  }

  if (params.get('what') === 'progress') {
    await sql`update progress set data = data - 'module', updated_at = now() where user_id = ${studentId}`;
    await sql`update users set progress_meta = '{}' where id = ${studentId}`;
  } else {
    await sql`delete from teacher_students where teacher_id = ${teacher.id} and student_id = ${studentId}`;
    // The learner leaves the lessons still ahead and the weekly series; past lessons and homework stay in the record.
    await sql`
      delete from lesson_participants p using lessons l
      where p.lesson_id = l.id and p.student_id = ${studentId} and l.teacher_id = ${teacher.id} and l.status = 'planned' and l.starts_at > now()`;
    await sql`
      delete from lesson_series_students ss using lesson_series s
      where ss.series_id = s.id and ss.student_id = ${studentId} and s.teacher_id = ${teacher.id}`;
  }
  return json({ ok: true });
});
