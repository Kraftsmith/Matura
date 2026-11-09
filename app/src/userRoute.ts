/** Ids that used to open every address. Only here so that old links keep working. */
const LEGACY_PROFILES = ['maria', 'evgeny', 'teacher'];

/** Pages that work without a session. */
const PUBLIC_PAGES = ['login', 'register', 'forgot', 'reset', 'verify', 'join', 'regulamin', 'prywatnosc'] as const;
export type PublicPage = (typeof PUBLIC_PAGES)[number];

/** The part after "?" in a hash such as "#register?src=landing&next=czlowiek/srodki": parameters for the public pages. */
const splitQuery = (hash: string): [string, string] => {
  const raw = hash.replace(/^#\/?/, '');
  const at = raw.indexOf('?');
  return at === -1 ? [raw, ''] : [raw.slice(0, at), raw.slice(at + 1)];
};

const clean = (hash: string): string => decodeURIComponent(splitQuery(hash)[0]).replace(/\/$/, '');

/** Parameters of a public page: src (where the visitor came from), next (the app address to open after signing in), role. */
export const publicQuery = (hash: string): URLSearchParams => new URLSearchParams(splitQuery(hash)[1]);

/** An app address a public page may send the user to afterwards: no scheme, no host, no second hash. */
export const safeNext = (value: string | null): string | undefined =>
  value && /^[a-z0-9][a-z0-9/_-]{0,120}$/i.test(value) ? value : undefined;

/** The source label sent with a registration: short, lowercase, no free text. */
export const safeSource = (value: string | null): string | undefined => (value && /^[a-z0-9.-]{1,40}$/.test(value) ? value : undefined);

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
export const shareLink = (rest: string): string =>
  // Rendered to HTML without a browser (public site): a relative link, replaced on the client.
  typeof window === 'undefined' ? `#${rest}` : `${window.location.origin}${window.location.pathname}#${rest}`;
