import { db } from './http.js';

export const clientIp = (req: Request): string => (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown').trim();

export const hitCount = async (key: string, windowMinutes: number): Promise<number> => {
  const [{ hits }] = await db()`select count(*)::int as hits from rate_limits where key = ${key} and at > now() - make_interval(mins => ${windowMinutes})`;
  return hits as number;
};

export const addHit = async (key: string): Promise<void> => {
  await db()`insert into rate_limits (key) values (${key})`;
};

export const clearHits = async (key: string): Promise<void> => {
  await db()`delete from rate_limits where key = ${key}`;
};

/** Run from registration, like the session cleanup: no cron is needed. */
export const dropOldHits = async (): Promise<void> => {
  await db()`delete from rate_limits where at < now() - interval '1 day'`;
};
