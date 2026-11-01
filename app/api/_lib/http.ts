import { createHash, randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export const db = () => neon(process.env.DATABASE_URL as string);

const COOKIE = 'matura_session';
const SESSION_DAYS = 90;
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;

/** Nothing from this API may be stored by a browser or a proxy. */
export const json = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });

/** Also the answer to anyone who is not the teacher: the notes API does not admit that it exists. */
export const notFound = (): Response => json({ error: 'not_found' }, 404);

export const badRequest = (): Response => json({ error: 'bad_request' }, 400);

export const unauthorized = (): Response => json({ error: 'unauthorized' }, 401);

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/** A browser always sends Origin on a write, so a page on another site cannot act with the learner's cookie. */
const foreignOrigin = (req: Request): boolean => {
  const origin = req.headers.get('origin');
  if (!origin || SAFE_METHODS.includes(req.method)) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
};

/** Logs only the error code: a driver message could quote the text of a note. */
export const guarded =
  (fn: (req: Request) => Promise<Response>) =>
  async (req: Request): Promise<Response> => {
    try {
      if (foreignOrigin(req)) return json({ error: 'forbidden' }, 403);
      return await fn(req);
    } catch (e) {
      console.error('api_error', (e as { code?: string }).code ?? 'unknown');
      return json({ error: 'server_error' }, 500);
    }
  };

export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

const readToken = (req: Request): string | undefined => {
  const cookies = req.headers.get('cookie') ?? '';
  return cookies
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
};

const cookie = (value: string, maxAge: number) => `${COOKIE}=${value}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

export const clearSessionCookie = () => cookie('', 0);

/** Starts a session and returns the Set-Cookie value. Only a hash of the token is stored. */
export const createSession = async (userId: string): Promise<string> => {
  const token = randomBytes(32).toString('base64url');
  const sql = db();
  await sql`delete from sessions where expires_at < now()`;
  await sql`
    insert into sessions (token_hash, user_id, expires_at)
    values (${tokenHash(token)}, ${userId}, now() + make_interval(days => ${SESSION_DAYS}))`;
  return cookie(token, SESSION_SECONDS);
};

export const endSession = async (req: Request): Promise<void> => {
  const token = readToken(req);
  if (token) await db()`delete from sessions where token_hash = ${tokenHash(token)}`;
};

/** Everywhere but here: changing the password or email must end the sessions an intruder may hold. */
export const endOtherSessions = async (req: Request, userId: string): Promise<void> => {
  await db()`delete from sessions where user_id = ${userId} and token_hash <> ${tokenHash(readToken(req) ?? '')}`;
};

export const endAllSessions = async (userId: string): Promise<void> => {
  await db()`delete from sessions where user_id = ${userId}`;
};

/** A session with less than this left is renewed, so nobody is signed out in the middle of the school year. */
const RENEW_DAYS = 30;

/** Returns a new Set-Cookie value when the session was renewed. */
export const renewSession = async (req: Request): Promise<string | undefined> => {
  const token = readToken(req);
  if (!token) return undefined;
  const rows = await db()`
    update sessions set expires_at = now() + make_interval(days => ${SESSION_DAYS})
    where token_hash = ${tokenHash(token)} and expires_at < now() + make_interval(days => ${RENEW_DAYS})
    returning 1`;
  return rows.length > 0 ? cookie(token, SESSION_SECONDS) : undefined;
};

export interface SessionUser {
  id: string;
  role: 'student' | 'teacher';
}

/** The identity and the role come from the session in the database, never from the request itself. */
export const requireUser = async (req: Request): Promise<SessionUser | null> => {
  const token = readToken(req);
  if (!token) return null;
  const [row] = await db()`
    select u.id, u.role from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${tokenHash(token)} and s.expires_at > now()`;
  return (row as SessionUser | undefined) ?? null;
};

export const requireTeacher = async (req: Request): Promise<SessionUser | null> => {
  const user = await requireUser(req);
  return user?.role === 'teacher' ? user : null;
};

/** The teacher, but only of a learner who joined their class. Anything else gets the same 404. */
export const requireStudentOf = async (req: Request, studentId: string | undefined): Promise<SessionUser | null> => {
  const teacher = await requireTeacher(req);
  if (!teacher || !studentId) return null;
  const rows = await db()`select 1 from teacher_students where teacher_id = ${teacher.id} and student_id = ${studentId}`;
  return rows.length > 0 ? teacher : null;
};
