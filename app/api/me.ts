import { TERMS_VERSION, dateOnly, loadAccount, validDate, validGoal, validLevel, validName, validTranslationLang, validUiLang } from './_lib/account.js';
import { runDigest } from './_lib/digest.js';
import { badRequest, db, guarded, json, renewSession, requireUser, unauthorized } from './_lib/http.js';
import { listNotifications, markRead } from './_lib/notify.js';
import { isUuid, validInstant } from './_lib/schedule.js';

// GET /api/me: the account. GET /api/me?resource=notifications, POST /api/me?resource=notifications-read: the bell.
// The daily digest also comes in here: Vercel Cron calls GET /api/me with the CRON_SECRET (Spec - Powiadomienia §10).

const DEFAULT_PAGE = 20;
const MAX_PAGE = 50;
const MAX_READ_IDS = 100;

/** The cron sends only this header and no cookie; without the secret in the environment the branch never opens. */
const fromCron = (req: Request): boolean => {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get('authorization') === `Bearer ${secret}`;
};

export const GET = guarded(async (req) => {
  if (fromCron(req)) return json(await runDigest());
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const params = new URL(req.url).searchParams;

  if (params.get('resource') === 'notifications') {
    const before = params.get('before') ?? undefined;
    if (before !== undefined && !validInstant(before)) return badRequest();
    const limit = Math.min(MAX_PAGE, Math.max(1, Number(params.get('limit') ?? DEFAULT_PAGE) || DEFAULT_PAGE));
    return json(await listNotifications(user.id, before, limit));
  }

  const renewed = await renewSession(req);
  return json({ user: await loadAccount(user.id) }, 200, renewed ? { 'set-cookie': renewed } : {});
});

export const POST = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  if (new URL(req.url).searchParams.get('resource') !== 'notifications-read') return badRequest();
  const body = ((await req.json().catch(() => null)) ?? {}) as { ids?: unknown; all?: unknown };
  if (body.all === true) {
    await markRead(user.id, 'all');
    return json({ ok: true });
  }
  // Someone else's ids change nothing and get the same answer: the list does not say whose a notification is.
  if (!Array.isArray(body.ids) || body.ids.length > MAX_READ_IDS || !body.ids.every(isUuid)) return badRequest();
  await markRead(user.id, body.ids);
  return json({ ok: true });
});

/** Only the fields below can be changed here: role, email and the like are simply not read from the body. */
export const PATCH = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

  const sql = db();
  const [row] = await sql`select name, exam_date, level, goal, ui_lang, translation_lang, notify_mail_message, notify_mail_digest from users where id = ${user.id}`;
  const pick = (key: string, column: string) => (key in body ? body[key] : row[column]);
  const name = pick('name', 'name');
  const examDate = 'examDate' in body ? body.examDate : (dateOnly(row.exam_date) ?? null);
  const level = pick('level', 'level');
  const goal = pick('goal', 'goal');
  const uiLang = pick('uiLang', 'ui_lang');
  const translationLang = pick('translationLang', 'translation_lang');
  const mailMessage = pick('notifyMailMessage', 'notify_mail_message');
  const mailDigest = pick('notifyMailDigest', 'notify_mail_digest');
  if (
    !validName(name) ||
    !validDate(examDate as string | null) ||
    !validLevel(level) ||
    !validGoal(goal) ||
    !validUiLang(uiLang) ||
    !validTranslationLang(translationLang) ||
    typeof mailMessage !== 'boolean' ||
    typeof mailDigest !== 'boolean'
  ) {
    return badRequest();
  }

  await sql`
    update users
    set name = ${name.trim()}, exam_date = ${examDate as string | null}, level = ${level}, goal = ${goal}, ui_lang = ${uiLang}, translation_lang = ${translationLang},
        notify_mail_message = ${mailMessage}, notify_mail_digest = ${mailDigest}
    where id = ${user.id}`;
  if (body.acceptTerms === true) await sql`update users set terms_accepted_at = now(), terms_version = ${TERMS_VERSION} where id = ${user.id}`;
  if (body.onboarded === true) await sql`update users set onboarded_at = coalesce(onboarded_at, now()) where id = ${user.id}`;

  return json({ user: await loadAccount(user.id) });
});
