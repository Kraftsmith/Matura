import { randomBytes } from 'node:crypto';
import { badRequest, db, guarded, json, notFound, requireTeacher } from './_lib/http.js';
import { dateOnly, initialsOf, normalizeEmail } from './_lib/account.js';
import { sendMail } from './_lib/mail.js';
import { toProgressState } from './_lib/progress.js';

// GET /api/class: the teacher's learners. GET /api/class?invite=1: the class link, created on first use.
// POST /api/class: replace it. POST /api/class with { email }: mail the link to one learner.

const newCode = () => randomBytes(12).toString('base64url');

export const GET = guarded(async (req) => {
  const teacher = await requireTeacher(req);
  if (!teacher) return notFound();
  const sql = db();

  if (new URL(req.url).searchParams.has('invite')) {
    const [row] = await sql`update users set invite_code = coalesce(invite_code, ${newCode()}) where id = ${teacher.id} returning invite_code`;
    return json({ code: row.invite_code });
  }

  const students = await sql`
    select u.id, u.name, u.email, u.exam_date, u.level, u.goal, u.progress_meta
    from teacher_students l join users u on u.id = l.student_id
    where l.teacher_id = ${teacher.id}
    order by l.joined_at`;
  const rows = await sql`
    select p.user_id, p.module_id, p.data from progress p
    join teacher_students l on l.student_id = p.user_id
    where l.teacher_id = ${teacher.id}`;

  return json({
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      initials: initialsOf(s.name as string),
      role: 'student',
      email: s.email,
      examDate: dateOnly(s.exam_date),
      level: s.level ?? undefined,
      goal: s.goal ?? undefined,
      progress: toProgressState(rows.filter((r) => r.user_id === s.id), s.progress_meta),
    })),
  });
});

export const POST = guarded(async (req) => {
  const teacher = await requireTeacher(req);
  if (!teacher) return notFound();
  const sql = db();
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;

  if (body?.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!email) return badRequest();
    const [me] = await sql`update users set invite_code = coalesce(invite_code, ${newCode()}) where id = ${teacher.id} returning name, invite_code, ui_lang`;
    // Whether this address has an account is not revealed: the same 202 and the same join link either way.
    const [known] = await sql`select ui_lang from users where email = ${email}`;
    sendMail('invite', email, (known?.ui_lang as string | undefined) ?? (me.ui_lang as string), `join/${me.invite_code}`, { teacher: me.name as string });
    return json({ ok: true }, 202);
  }

  const [row] = await sql`update users set invite_code = ${newCode()} where id = ${teacher.id} returning invite_code`;
  return json({ code: row.invite_code });
});
