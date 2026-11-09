import { randomBytes } from 'node:crypto';
import { issueToken, joinClass, loadAccount, normalizeEmail } from './_lib/account.js';
import { badRequest, clearSessionCookie, db, endOtherSessions, guarded, json, notFound, requireUser, tokenHash, unauthorized, type SessionUser } from './_lib/http.js';
import { sendMail } from './_lib/mail.js';
import { hashPassword, passwordProblem, verifyPassword } from './_lib/password.js';
import { addHit, clientIp, hitCount } from './_lib/rateLimit.js';

// POST /api/account?action=change-password|change-email|join|leave, GET /api/account (own data as a file), DELETE /api/account
// Without a session (the public site's forms, Spec - Landing §10): POST /api/account?action=lead-subscribe|lead-confirm|lead-unsubscribe|contact
// They share this file because the Hobby plan allows 12 functions and all 12 exist.

const EMAIL_HOURS = 24;
const LEAD_TOKEN_HOURS = 24;
const LEAD_PENDING_DAYS = 7;
const LEAD_IP_PER_HOUR = 5;
const LEAD_EMAIL_PER_DAY = 3;
const CONTACT_IP_PER_HOUR = 3;
const TOKEN_WINDOW_MINUTES = 15;
const MAX_TOKEN_FAILURES = 20;
const MAX_MESSAGE = 2000;
const MAX_SOURCE = 80;
const LEAD_ROLES = ['student', 'parent', 'teacher'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const readBody = async (req: Request) => ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

const passwordMatches = async (userId: string, password: unknown) => {
  if (typeof password !== 'string' || password.length > 256) return null;
  const [row] = await db()`select email, ui_lang, password_hash from users where id = ${userId}`;
  return row?.password_hash && (await verifyPassword(password, row.password_hash as string)) ? row : null;
};

const wrongPassword = () => json({ error: 'wrong_password' }, 403);
/** The same answer whatever happened: the forms of the site must not reveal which addresses are on the list. */
const accepted = () => json({ ok: true }, 202);
const newToken = () => randomBytes(32).toString('base64url');

/** Only the utm_* keys, as short strings: the address bar is not a place to store free text. */
const pickUtm = (v: unknown): string | null => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = (v as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.length > 0) utm[key] = value.slice(0, 100);
  }
  return Object.keys(utm).length > 0 ? JSON.stringify(utm) : null;
};

const leadSubscribe = async (req: Request) => {
  const body = await readBody(req);
  // Hidden field: a person never fills it in.
  if (body.website) return accepted();
  const email = normalizeEmail(body.email);
  if (!email) return badRequest();
  const role = typeof body.role === 'string' && LEAD_ROLES.includes(body.role) ? body.role : null;
  const source = typeof body.source === 'string' && body.source.length > 0 ? body.source.slice(0, MAX_SOURCE) : null;
  const utm = pickUtm(body.utm);
  const lang = body.lang === 'en' ? 'en' : 'pl';

  const ipKey = `lead:ip:${clientIp(req)}`;
  const emailKey = `lead:email:${email}`;
  const [ipHits, emailHits] = await Promise.all([hitCount(ipKey, 60), hitCount(emailKey, 24 * 60)]);
  if (ipHits >= LEAD_IP_PER_HOUR || emailHits >= LEAD_EMAIL_PER_DAY) return accepted();
  await Promise.all([addHit(ipKey), addHit(emailKey)]);

  const sql = db();
  // Like unconfirmed accounts: an address nobody confirmed is not kept. No cron needed.
  await sql`delete from leads where kind = 'subscribe' and status = 'pending' and created_at < now() - make_interval(days => ${LEAD_PENDING_DAYS})`;

  const token = newToken();
  const unsubscribe = newToken();
  // A confirmed address stays confirmed and gets no second mail; a pending or unsubscribed one gets a fresh link.
  const [row] = await sql`
    insert into leads (email, kind, role, status, source, utm, lang, token_hash, token_expires_at, unsubscribe_token_hash)
    values (${email}, 'subscribe', ${role}, 'pending', ${source}, ${utm}::jsonb, ${lang}, ${tokenHash(token)}, now() + make_interval(hours => ${LEAD_TOKEN_HOURS}), ${tokenHash(unsubscribe)})
    on conflict (lower(email)) where kind = 'subscribe' do update set
      role = coalesce(excluded.role, leads.role),
      source = coalesce(excluded.source, leads.source),
      utm = coalesce(excluded.utm, leads.utm),
      lang = excluded.lang,
      status = case when leads.status = 'confirmed' then 'confirmed' else 'pending' end,
      token_hash = case when leads.status = 'confirmed' then leads.token_hash else excluded.token_hash end,
      token_expires_at = case when leads.status = 'confirmed' then leads.token_expires_at else excluded.token_expires_at end,
      unsubscribe_token_hash = coalesce(leads.unsubscribe_token_hash, excluded.unsubscribe_token_hash)
    returning status`;
  if (row?.status !== 'confirmed') sendMail('leadConfirm', email, lang, `/potwierdz?token=${token}`);
  return accepted();
};

const readToken = async (req: Request): Promise<{ token: string; ipKey: string } | Response> => {
  const { token } = await readBody(req);
  if (typeof token !== 'string' || token.length > 128) return badRequest();
  const ipKey = `token:${clientIp(req)}`;
  if ((await hitCount(ipKey, TOKEN_WINDOW_MINUTES)) >= MAX_TOKEN_FAILURES) return json({ error: 'too_many_attempts' }, 429);
  return { token, ipKey };
};

const leadConfirm = async (req: Request) => {
  const read = await readToken(req);
  if (read instanceof Response) return read;
  const [row] = await db()`
    update leads set status = 'confirmed', confirmed_at = now(), token_hash = null, token_expires_at = null
    where kind = 'subscribe' and token_hash = ${tokenHash(read.token)} and token_expires_at > now()
    returning id`;
  if (!row) {
    await addHit(read.ipKey);
    return json({ error: 'invalid_token' }, 404);
  }
  return json({ ok: true });
};

/** The link in every mail to the list; it never expires, and no sign-in is needed. */
const leadUnsubscribe = async (req: Request) => {
  const read = await readToken(req);
  if (read instanceof Response) return read;
  const [row] = await db()`
    update leads set status = 'unsubscribed', token_hash = null, token_expires_at = null
    where kind = 'subscribe' and unsubscribe_token_hash = ${tokenHash(read.token)}
    returning id`;
  if (!row) {
    await addHit(read.ipKey);
    return json({ error: 'invalid_token' }, 404);
  }
  return json({ ok: true });
};

const contact = async (req: Request) => {
  const body = await readBody(req);
  if (body.website) return accepted();
  const email = normalizeEmail(body.email);
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!email || message.length === 0 || message.length > MAX_MESSAGE) return badRequest();

  const ipKey = `contact:ip:${clientIp(req)}`;
  if ((await hitCount(ipKey, 60)) >= CONTACT_IP_PER_HOUR) return accepted();
  await addHit(ipKey);

  await db()`insert into leads (email, kind, status, message, lang) values (${email}, 'contact', 'confirmed', ${message}, 'pl')`;
  const to = process.env.CONTACT_TO;
  if (to) sendMail('contactCopy', to, 'pl', undefined, { from: email, message }, { replyTo: email });
  return accepted();
};

const publicActions: Record<string, (req: Request) => Promise<Response>> = {
  'lead-subscribe': leadSubscribe,
  'lead-confirm': leadConfirm,
  'lead-unsubscribe': leadUnsubscribe,
  contact,
};

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
  const name = new URL(req.url).searchParams.get('action') ?? '';
  const open = publicActions[name];
  if (open) return open(req);
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const action = actions[name];
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

  // Sessions, tokens, progress, the class link, notes, cards, lesson seats and homework ticks go with the account: every table cascades.
  await db()`delete from users where id = ${user.id}`;
  // A future lesson left with nobody in it is not a lesson any more; past ones stay in the teacher's record.
  await db()`delete from lessons l where l.status = 'planned' and l.starts_at > now() and not exists (select 1 from lesson_participants p where p.lesson_id = l.id)`;
  sendMail('accountDeleted', row.email as string, row.ui_lang as string);
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie() });
});
