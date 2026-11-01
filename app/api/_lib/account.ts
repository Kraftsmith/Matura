import { randomBytes } from 'node:crypto';
import { db, tokenHash } from './http.js';

/** Raised when the Regulamin changes: everyone is then asked to accept it again. */
export const TERMS_VERSION = '2026-11';

const MAX_NAME = 60;
const MAX_GOAL = 120;
const LEVELS = ['podstawowa', 'rozszerzona'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const normalizeEmail = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const email = v.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : undefined;
};

export const validName = (v: unknown): v is string => typeof v === 'string' && v.trim().length >= 1 && v.trim().length <= MAX_NAME;
export const validGoal = (v: unknown): v is string | null => v === null || (typeof v === 'string' && v.length <= MAX_GOAL);
export const validLevel = (v: unknown): v is string | null => v === null || (typeof v === 'string' && LEVELS.includes(v));
export const validDate = (v: unknown): v is string | null => v === null || (typeof v === 'string' && DATE.test(v) && !Number.isNaN(Date.parse(v)));
export const validUiLang = (v: unknown): v is string => v === 'pl' || v === 'en';
export const validTranslationLang = (v: unknown): v is string => v === 'pl' || v === 'ru';

/** The driver turns a `date` into local midnight, so the day has to be read back in local time too. */
export const dateOnly = (v: unknown): string | undefined => {
  if (!v) return undefined;
  if (!(v instanceof Date)) return String(v).slice(0, 10);
  return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`;
};

export const initialsOf = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = [...words[0]][0];
  const last = words.length > 1 ? [...words[words.length - 1]][0] : '';
  return `${first}${last}`.toUpperCase();
};

/** What the signed-in user learns about themselves. Never anything about notes. */
export const toAccount = (r: Record<string, unknown>, teacherName?: string) => ({
  id: r.id,
  name: r.name,
  initials: initialsOf(r.name as string),
  email: r.email,
  role: r.role,
  examDate: dateOnly(r.exam_date),
  level: r.level ?? undefined,
  goal: r.goal ?? undefined,
  uiLang: r.ui_lang,
  translationLang: r.translation_lang,
  onboarded: !!r.onboarded_at,
  termsAccepted: r.terms_version === TERMS_VERSION,
  teacher: teacherName ? { name: teacherName } : undefined,
});

export const loadAccount = async (userId: string) => {
  const sql = db();
  const [row] = await sql`select * from users where id = ${userId}`;
  if (!row) return null;
  const [teacher] = await sql`
    select t.name from teacher_students l join users t on t.id = l.teacher_id
    where l.student_id = ${userId} limit 1`;
  return toAccount(row, teacher?.name as string | undefined);
};

/** Only one link of one kind lives at a time. */
export const issueToken = async (userId: string, purpose: 'verify_email' | 'reset_password' | 'change_email', hours: number, newEmail?: string): Promise<string> => {
  const token = randomBytes(32).toString('base64url');
  const sql = db();
  await sql`delete from auth_tokens where user_id = ${userId} and purpose = ${purpose}`;
  await sql`
    insert into auth_tokens (token_hash, user_id, purpose, new_email, expires_at)
    values (${tokenHash(token)}, ${userId}, ${purpose}, ${newEmail ?? null}, now() + make_interval(hours => ${hours}))`;
  return token;
};

/** Deleting and reading in one statement makes a link work exactly once, even when opened twice at the same moment. */
export const takeToken = async (token: string, purposes: string[]) => {
  const [row] = await db()`
    delete from auth_tokens
    where token_hash = ${tokenHash(token)} and expires_at > now() and purpose = any(${purposes})
    returning user_id, purpose, new_email`;
  return row;
};

export const joinClass = async (studentId: string, code: string): Promise<boolean> => {
  const sql = db();
  const [teacher] = await sql`select id from users where invite_code = ${code} and role = 'teacher'`;
  if (!teacher) return false;
  await sql`insert into teacher_students (teacher_id, student_id) values (${teacher.id}, ${studentId}) on conflict do nothing`;
  return true;
};
