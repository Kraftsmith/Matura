import { findUser } from './users';

/**
 * Every address starts with the profile: #maria, #maria/czlowiek/slownictwo, #teacher/dashboard/evgeny.
 * The part after the profile is the page route handled by App.
 */
export interface UserHash {
  /** Profile named in the address, if the first segment is a known user id. */
  userId?: string;
  /** The remaining route, without a leading slash (may be empty). */
  rest: string;
}

export const splitUserHash = (hash: string): UserHash => {
  const raw = decodeURIComponent(hash.replace(/^#\/?/, '')).replace(/\/$/, '');
  const [first, ...others] = raw.split('/');
  if (first && findUser(first)) return { userId: first, rest: others.join('/') };
  return { rest: raw };
};

export const buildHash = (userId: string, rest: string): string => (rest ? `${userId}/${rest}` : userId);

/**
 * Full link to a page without the profile segment, for homework: whoever opens it lands on that page
 * in their own profile (the last one used in their browser), not in the profile of the person who shared it.
 */
export const shareLink = (rest: string): string => `${window.location.origin}${window.location.pathname}#${rest}`;
