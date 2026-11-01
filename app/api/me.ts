import { TERMS_VERSION, dateOnly, loadAccount, validDate, validGoal, validLevel, validName, validTranslationLang, validUiLang } from './_lib/account.js';
import { badRequest, db, guarded, json, renewSession, requireUser, unauthorized } from './_lib/http.js';

export const GET = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const renewed = await renewSession(req);
  return json({ user: await loadAccount(user.id) }, 200, renewed ? { 'set-cookie': renewed } : {});
});

/** Only the fields below can be changed here: role, email and the like are simply not read from the body. */
export const PATCH = guarded(async (req) => {
  const user = await requireUser(req);
  if (!user) return unauthorized();
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

  const sql = db();
  const [row] = await sql`select name, exam_date, level, goal, ui_lang, translation_lang from users where id = ${user.id}`;
  const pick = (key: string, column: string) => (key in body ? body[key] : row[column]);
  const name = pick('name', 'name');
  const examDate = 'examDate' in body ? body.examDate : (dateOnly(row.exam_date) ?? null);
  const level = pick('level', 'level');
  const goal = pick('goal', 'goal');
  const uiLang = pick('uiLang', 'ui_lang');
  const translationLang = pick('translationLang', 'translation_lang');
  if (!validName(name) || !validDate(examDate as string | null) || !validLevel(level) || !validGoal(goal) || !validUiLang(uiLang) || !validTranslationLang(translationLang)) {
    return badRequest();
  }

  await sql`
    update users
    set name = ${name.trim()}, exam_date = ${examDate as string | null}, level = ${level}, goal = ${goal}, ui_lang = ${uiLang}, translation_lang = ${translationLang}
    where id = ${user.id}`;
  if (body.acceptTerms === true) await sql`update users set terms_accepted_at = now(), terms_version = ${TERMS_VERSION} where id = ${user.id}`;
  if (body.onboarded === true) await sql`update users set onboarded_at = coalesce(onboarded_at, now()) where id = ${user.id}`;

  return json({ user: await loadAccount(user.id) });
});
