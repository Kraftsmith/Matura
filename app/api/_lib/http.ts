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

/** Logs only the error code: a driver message could quote the text of a note. */
export const guarded =
  (fn: (req: Request) => Promise<Response>) =>
  async (req: Request): Promise<Response> => {
    try {
      return await fn(req);
    } catch (e) {
      console.error('api_error', (e as { code?: string }).code ?? 'unknown');
      return json({ error: 'server_error' }, 500);
    }
  };

const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

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

/** The role comes from the session in the database, never from the request itself. */
export const isTeacher = async (req: Request): Promise<boolean> => {
  const token = readToken(req);
  if (!token) return false;
  const rows = await db()`
    select 1 from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${tokenHash(token)} and s.expires_at > now() and u.role = 'teacher'`;
  return rows.length > 0;
};
