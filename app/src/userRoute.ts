/** Ids that used to open every address. Only here so that old links keep working. */
const LEGACY_PROFILES = ['maria', 'evgeny', 'teacher'];

/** Pages that work without a session. */
const PUBLIC_PAGES = ['login', 'register', 'forgot', 'reset', 'verify', 'join', 'regulamin', 'prywatnosc'] as const;
export type PublicPage = (typeof PUBLIC_PAGES)[number];

const clean = (hash: string): string => decodeURIComponent(hash.replace(/^#\/?/, '')).replace(/\/$/, '');

/** The page route without a leading slash and without the profile segment of an old link. Who you are comes from the session. */
export const routeOf = (hash: string): string => {
  const raw = clean(hash);
  const [first, ...others] = raw.split('/');
  return LEGACY_PROFILES.includes(first) ? others.join('/') : raw;
};

export const publicPage = (hash: string): { page: PublicPage; param?: string } | undefined => {
  const [page, param] = clean(hash).split('/');
  return (PUBLIC_PAGES as readonly string[]).includes(page) ? { page: page as PublicPage, param } : undefined;
};

/** Full link to a page: whoever opens it lands on that page in their own account. */
export const shareLink = (rest: string): string => `${window.location.origin}${window.location.pathname}#${rest}`;
