import { randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

/** No 0/O or 1/I/L: the code gets typed by hand. */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const GROUPS = 3;
const GROUP_LENGTH = 4;
const KEY_LENGTH = 32;

/** Case, spaces and dashes do not matter when the code is typed in. */
export const normalizeCode = (code: string): string => code.toUpperCase().replace(/[\s-]/g, '');

export const generateCode = (): string =>
  Array.from({ length: GROUPS }, () => Array.from({ length: GROUP_LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')).join('-');

export const hashCode = async (code: string): Promise<string> => {
  const salt = randomBytes(16);
  const key = await scryptAsync(normalizeCode(code), salt, KEY_LENGTH);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
};

export const verifyCode = async (code: string, stored: string): Promise<boolean> => {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const actual = await scryptAsync(normalizeCode(code), Buffer.from(salt, 'hex'), KEY_LENGTH);
  return timingSafeEqual(actual, Buffer.from(key, 'hex'));
};
