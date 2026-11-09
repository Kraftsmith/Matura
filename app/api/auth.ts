import { randomUUID } from 'node:crypto';
import { TERMS_VERSION, issueToken, joinClass, loadAccount, normalizeEmail, takeToken, validName, validUiLang } from './_lib/account.js';
import { badRequest, clearSessionCookie, createSession, db, endAllSessions, endSession, guarded, json, notFound, requireUser, tokenHash, unauthorized } from './_lib/http.js';
import { sendMail } from './_lib/mail.js';
import { burnPasswordCheck, hashPassword, passwordProblem, verifyPassword } from './_lib/password.js';
import { addHit, clearHits, clientIp, dropOldHits, hitCount } from './_lib/rateLimit.js';

// Everything for signing up and in lives in one function: the Hobby plan allows 12 per deployment.
// POST /api/auth?action=register|resend|verify|login|logout|forgot|reset, GET /api/auth?invite=<code>

const WINDOW_MINUTES = 15;
const MAX_PAIR_FAILURES = 5;
/** A whole school can sit behind one address. */
const MAX_IP_FAILURES = 100;
const MAX_REGISTRATIONS_PER_HOUR = 20;
const MAX_TOKEN_FAILURES = 20;
const VERIFY_HOURS = 24;
const RESET_HOURS = 1;
const UNVERIFIED_DAYS = 7;

const tooMany = () => json({ error: 'too_many_attempts' }, 429);
/** The same 202 whatever happened: these forms must not reveal which addresses have accounts. */
const accepted = () => json({ ok: true }, 202);
const linkGone = () => json({ error: 'link_expired' }, 410);

const readBody = async (req: Request) => ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

const register = async (req: Request) => {
  const body = await readBody(req);
  // Hidden field: a person never fills it in.
  if (body.website) return accepted();

  const email = normalizeEmail(body.email);
  const { name, password, acceptedTerms, uiLang, inviteCode, role, src } = body;
  if (!email || !validName(name) || acceptedTerms !== true) return badRequest();
  // A teacher sees only learners who join their class, so anyone may sign up as one.
  if (role !== undefined && role !== 'student' && role !== 'teacher') return badRequest();
  const problem = passwordProblem(password, email);
  if (problem) return json({ error: 'bad_password', problem }, 400);

  const ip = clientIp(req);
  const ipKey = `register:${ip}`;
  if ((await hitCount(ipKey, 60)) >= MAX_REGISTRATIONS_PER_HOUR) return tooMany();
  await addHit(ipKey);

  const sql = db();
  await sql`delete from users where email_verified_at is null and password_hash is not null and created_at < now() - make_interval(days => ${UNVERIFIED_DAYS})`;
  await dropOldHits();

  const lang = validUiLang(uiLang) ? uiLang : 'pl';
  const isTeacher = role === 'teacher';
  const invite = !isTeacher && typeof inviteCode === 'string' && inviteCode.length <= 64 ? inviteCode : null;
  // Which page of the site the sign-up started on; a label, never free text.
  const source = typeof src === 'string' && /^[a-z0-9.-]{1,40}$/.test(src) ? src : null;
  const passwordHash = await hashPassword(password as string);
  const [existing] = await sql`select id, email_verified_at, ui_lang from users where email = ${email}`;

  if (existing?.email_verified_at) {
    sendMail('exists', email, existing.ui_lang as string, 'login');
    return accepted();
  }

  const id = (existing?.id as string | undefined) ?? randomUUID();
  // A second sign-up on an unconfirmed address replaces the first: whoever really owns the mailbox wins.
  await sql`
    insert into users (id, role, email, name, password_hash, ui_lang, pending_invite, terms_accepted_at, terms_version, signup_source)
    values (${id}, ${isTeacher ? 'teacher' : 'student'}, ${email}, ${name.trim()}, ${passwordHash}, ${lang}, ${invite}, now(), ${TERMS_VERSION}, ${source})
    on conflict (id) do update set role = excluded.role, name = excluded.name, password_hash = excluded.password_hash, ui_lang = excluded.ui_lang,
      pending_invite = excluded.pending_invite, terms_accepted_at = now(), terms_version = excluded.terms_version, signup_source = coalesce(excluded.signup_source, users.signup_source)`;

  sendMail('verify', email, lang, `verify/${await issueToken(id, 'verify_email', VERIFY_HOURS)}`);
  return accepted();
};

const resend = async (req: Request) => {
  const email = normalizeEmail((await readBody(req)).email);
  if (!email) return badRequest();
  const [user] = await db()`select id, ui_lang from users where email = ${email} and email_verified_at is null`;
  if (user) sendMail('verify', email, user.ui_lang as string, `verify/${await issueToken(user.id as string, 'verify_email', VERIFY_HOURS)}`);
  return accepted();
};

const tokenFailure = async (ipKey: string) => {
  await addHit(ipKey);
  return linkGone();
};

const verify = async (req: Request) => {
  const { token } = await readBody(req);
  if (typeof token !== 'string') return badRequest();
  const ipKey = `token:${clientIp(req)}`;
  if ((await hitCount(ipKey, WINDOW_MINUTES)) >= MAX_TOKEN_FAILURES) return tooMany();

  const row = await takeToken(token, ['verify_email', 'change_email']);
  if (!row) return tokenFailure(ipKey);

  const sql = db();
  const userId = row.user_id as string;
  if (row.purpose === 'change_email') {
    const newEmail = row.new_email as string;
    const [taken] = await sql`select 1 from users where email = ${newEmail}`;
    if (taken) return linkGone();
    await sql`update users set email = ${newEmail} where id = ${userId}`;
    await endAllSessions(userId);
  } else {
    const [user] = await sql`update users set email_verified_at = now() where id = ${userId} returning pending_invite`;
    if (user?.pending_invite) {
      await joinClass(userId, user.pending_invite as string);
      await sql`update users set pending_invite = null where id = ${userId}`;
    }
  }
  return json({ user: await loadAccount(userId) }, 200, { 'set-cookie': await createSession(userId) });
};

const login = async (req: Request) => {
  const { email: rawEmail, password } = await readBody(req);
  const email = normalizeEmail(rawEmail);
  if (!email || typeof password !== 'string' || password.length > 256) return badRequest();

  const ip = clientIp(req);
  const pairKey = `login:${email}:${ip}`;
  const ipKey = `login-ip:${ip}`;
  const [pairFailures, ipFailures] = await Promise.all([hitCount(pairKey, WINDOW_MINUTES), hitCount(ipKey, WINDOW_MINUTES)]);
  if (pairFailures >= MAX_PAIR_FAILURES || ipFailures >= MAX_IP_FAILURES) return tooMany();

  const [user] = await db()`select id, password_hash, email_verified_at from users where email = ${email}`;
  const passwordOk = user?.password_hash ? await verifyPassword(password, user.password_hash as string) : false;
  if (!user?.password_hash) await burnPasswordCheck(password);
  if (!passwordOk) {
    await Promise.all([addHit(pairKey), addHit(ipKey)]);
    return json({ error: 'wrong_credentials' }, 401);
  }

  // Only someone who knows the password learns that the address is waiting for confirmation.
  if (!user.email_verified_at) return json({ error: 'email_not_verified' }, 403);

  await clearHits(pairKey);
  const userId = user.id as string;
  return json({ user: await loadAccount(userId) }, 200, { 'set-cookie': await createSession(userId) });
};

const logout = async (req: Request) => {
  const { everywhere } = await readBody(req);
  const user = everywhere === true ? await requireUser(req) : null;
  if (user) await endAllSessions(user.id);
  else await endSession(req);
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
};

const forgot = async (req: Request) => {
  const email = normalizeEmail((await readBody(req)).email);
  if (!email) return badRequest();
  const [user] = await db()`select id, ui_lang from users where email = ${email}`;
  if (user) sendMail('reset', email, user.ui_lang as string, `reset/${await issueToken(user.id as string, 'reset_password', RESET_HOURS)}`);
  return accepted();
};

const reset = async (req: Request) => {
  const { token, password } = await readBody(req);
  if (typeof token !== 'string') return badRequest();
  const ipKey = `token:${clientIp(req)}`;
  if ((await hitCount(ipKey, WINDOW_MINUTES)) >= MAX_TOKEN_FAILURES) return tooMany();

  const sql = db();
  // Looked at before it is spent: a password that fails the rules must not burn the link.
  const [pending] = await sql`
    select u.email from auth_tokens t join users u on u.id = t.user_id
    where t.token_hash = ${tokenHash(token)} and t.purpose = 'reset_password' and t.expires_at > now()`;
  if (!pending) return tokenFailure(ipKey);
  const email = pending.email as string;
  const problem = passwordProblem(password, email);
  if (problem) return json({ error: 'bad_password', problem }, 400);

  const row = await takeToken(token, ['reset_password']);
  if (!row) return tokenFailure(ipKey);

  const userId = row.user_id as string;
  // The link reached the mailbox, so the address is proven.
  await sql`update users set password_hash = ${await hashPassword(password as string)}, email_verified_at = coalesce(email_verified_at, now()) where id = ${userId}`;
  await endAllSessions(userId);
  const account = await loadAccount(userId);
  sendMail('passwordChanged', email, (account?.uiLang as string) ?? 'pl');
  return json({ user: account }, 200, { 'set-cookie': await createSession(userId) });
};

const actions: Record<string, (req: Request) => Promise<Response>> = { register, resend, verify, login, logout, forgot, reset };

export const POST = guarded(async (req) => {
  const action = actions[new URL(req.url).searchParams.get('action') ?? ''];
  return action ? action(req) : notFound();
});

/** Open on purpose: an invited person may have no account yet. Tells only the teacher's name. */
export const GET = guarded(async (req) => {
  const code = new URL(req.url).searchParams.get('invite');
  if (!code) return unauthorized();
  const [teacher] = await db()`select name from users where invite_code = ${code} and role = 'teacher'`;
  return teacher ? json({ teacher: { name: teacher.name } }) : notFound();
});
