import { issueToken, joinClass, loadAccount, normalizeEmail } from './_lib/account.js';
import { badRequest, clearSessionCookie, db, endOtherSessions, guarded, json, notFound, requireUser, unauthorized, type SessionUser } from './_lib/http.js';
import { sendMail } from './_lib/mail.js';
import { hashPassword, passwordProblem, verifyPassword } from './_lib/password.js';

// POST /api/account?action=change-password|change-email|join|leave, GET /api/account (own data as a file), DELETE /api/account

const EMAIL_HOURS = 24;

const readBody = async (req: Request) => ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

const passwordMatches = async (userId: string, password: unknown) => {
  if (typeof password !== 'string' || password.length > 256) return null;
  const [row] = await db()`select email, ui_lang, password_hash from users where id = ${userId}`;
  return row?.password_hash && (await verifyPassword(password, row.password_hash as string)) ? row : null;
};

const wrongPassword = () => json({ error: 'wrong_password' }, 403);

const changePassword = async (req: Request, user: SessionUser) => {
  const { currentPassword, newPassword } = await readBody(req);
  const row = await passwordMatches(user.id, currentPassword);
  if (!row) return wrongPassword();
  const email = row.email as string;
  const problem = passwordProblem(newPassword, email);
  if (problem) return json({ error: 'bad_password', problem }, 400);

  await db()`update users set password_hash = ${await hashPassword(newPassword as string)} where id = ${user.id}`;
  await endOtherSessions(req, user.id);
  sendMail('passwordChanged', email, row.ui_lang as string);
  return json({ ok: true });
};

const changeEmail = async (req: Request, user: SessionUser) => {
  const { currentPassword, newEmail: rawEmail } = await readBody(req);
  const newEmail = normalizeEmail(rawEmail);
  if (!newEmail) return badRequest();
  const row = await passwordMatches(user.id, currentPassword);
  if (!row) return wrongPassword();
  const lang = row.ui_lang as string;

  const [taken] = await db()`select 1 from users where email = ${newEmail}`;
  // The same answer either way: this form must not tell whether the address has an account.
  if (taken) {
    sendMail('exists', newEmail, lang, 'login');
  } else {
    sendMail('newEmail', newEmail, lang, `verify/${await issueToken(user.id, 'change_email', EMAIL_HOURS, newEmail)}`);
    sendMail('emailChanging', row.email as string, lang);
  }
  return json({ ok: true }, 202);
};

const join = async (req: Request, user: SessionUser) => {
  const { code } = await readBody(req);
  if (user.role !== 'student' || typeof code !== 'string' || code.length > 64) return notFound();
  if (!(await joinClass(user.id, code))) return notFound();
  return json({ user: await loadAccount(user.id) });
};

const leave = async (_req: Request, user: SessionUser) => {
  await db()`delete from teacher_students where student_id = ${user.id}`;
  return json({ user: await loadAccount(user.id) });
};

const actions: Record<string, (req: Request, user: SessionUser) => Promise<Response>> = {
  'change-password': changePassword,
  'change-email': changeEmail,
  join,
  leave,
};

export const POST = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const action = actions[new URL(req.url).searchParams.get('action') ?? ''];
  return action ? action(req, user) : notFound();
});

/** The learner's own data. Notes are the teacher's records and are not part of this file (§13, question 4 of the spec). */
export const GET = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const sql = db();
  const progress = await sql`select module_id, data, updated_at from progress where user_id = ${user.id}`;
  return json({ exportedAt: new Date().toISOString(), profile: await loadAccount(user.id), progress }, 200, {
    'content-disposition': 'attachment; filename="matura-english-dane.json"',
  });
});

/** The teacher's account has a class hanging on it, so only a script can remove it. */
export const DELETE = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  if (user.role !== 'student') return notFound();
  const row = await passwordMatches(user.id, (await readBody(req)).password);
  if (!row) return wrongPassword();

  // Sessions, tokens, progress, the class link, notes and cards go with the account: every table cascades.
  await db()`delete from users where id = ${user.id}`;
  sendMail('accountDeleted', row.email as string, row.ui_lang as string);
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
});
