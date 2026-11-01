import { verifyCode } from './_lib/accessCode.js';
import { badRequest, createSession, db, guarded, json } from './_lib/http.js';

const MAX_FAILURES = 10;
const WINDOW_MINUTES = 15;

export const POST = guarded(async (req) => {
  const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
  if (typeof body?.code !== 'string' || !body.code || body.code.length > 64) return badRequest();

  const ip = (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim();
  const sql = db();

  await sql`delete from login_attempts where at < now() - make_interval(mins => ${WINDOW_MINUTES})`;
  const [{ failures }] = await sql`select count(*)::int as failures from login_attempts where ip = ${ip}`;
  if (failures >= MAX_FAILURES) return json({ error: 'too_many_attempts' }, 429);

  const [teacher] = await sql`select id, access_code_hash from users where role = 'teacher' limit 1`;
  if (!teacher?.access_code_hash || !(await verifyCode(body.code, teacher.access_code_hash))) {
    await sql`insert into login_attempts (ip) values (${ip})`;
    return json({ error: 'wrong_code' }, 401);
  }

  await sql`delete from login_attempts where ip = ${ip}`;
  return json({ ok: true }, 200, { 'set-cookie': await createSession(teacher.id) });
});
