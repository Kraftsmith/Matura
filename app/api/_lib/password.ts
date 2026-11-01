import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const LOG_N = 17;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
/** Node's default ceiling is too low for N = 2^17. */
const MAX_MEMORY = 256 * 1024 * 1024;

const MIN_LENGTH = 10;
const MAX_LENGTH = 128;

const COMMON = new Set([
  '1234567890', '12345678910', '0123456789', '0987654321', '1111111111', '1234512345', '1q2w3e4r5t', 'qwertyuiop', 'qwertyuiop1',
  'qwerty1234', 'qwerty12345', 'password12', 'password123', 'password1234', 'haslo12345', 'haslo123456', 'zaq12wsxcde', 'asdfghjkl1',
  'iloveyou12', 'matura2026', 'matura2027', 'angielski1', 'polska1234', 'kochamcie1',
]);

const derive = (password: string, salt: Buffer, logN: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, { N: 2 ** logN, r, p, maxmem: MAX_MEMORY }, (e, key) => (e ? reject(e) : resolve(key))),
  );

/** The parameters travel inside the hash, so they can be raised later without touching old accounts. */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const key = await derive(password, salt, LOG_N, R, P);
  return `scrypt$${LOG_N}$${R}$${P}$${salt.toString('hex')}$${key.toString('hex')}`;
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [scheme, logN, r, p, salt, key] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !key) return false;
  const actual = await derive(password, Buffer.from(salt, 'hex'), Number(logN), Number(r), Number(p));
  return timingSafeEqual(actual, Buffer.from(key, 'hex'));
};

/** Spends the same time as a real check, so an unknown address does not answer faster. */
export const burnPasswordCheck = async (password: string): Promise<void> => {
  await derive(password, Buffer.alloc(16), LOG_N, R, P);
};

export type PasswordProblem = 'too_short' | 'too_long' | 'too_common';

export const passwordProblem = (password: unknown, email: string): PasswordProblem | undefined => {
  if (typeof password !== 'string' || password.length < MIN_LENGTH) return 'too_short';
  if (password.length > MAX_LENGTH) return 'too_long';
  const lower = password.toLowerCase();
  return COMMON.has(lower) || lower === email ? 'too_common' : undefined;
};
