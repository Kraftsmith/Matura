import { SITE_NAME, SITE_URL } from '../../site.config';

export const absolute = (path: string): string => new URL(path, SITE_URL).toString();

/** "<title> | <Nazwa>", trimmed so the whole thing stays readable in a result (Spec - Landing §9.1). */
export const pageTitle = (title: string): string => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);

export const clamp = (s: string, max: number): string => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export interface Crumb {
  name: string;
  href: string;
}

export const organization = () => ({
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: absolute('/favicon.svg'),
});

export const webSite = () => ({
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'pl-PL',
});

export const breadcrumbList = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.href) })),
});

export const softwareApplication = (priceFree = true) => ({
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  url: SITE_URL,
  ...(priceFree ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' } } : {}),
});

export const faqPage = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const article = (o: { title: string; description: string; url: string; datePublished?: string; dateModified?: string; author?: string }) => ({
  '@type': 'Article',
  headline: o.title,
  description: o.description,
  url: absolute(o.url),
  inLanguage: 'pl-PL',
  ...(o.datePublished ? { datePublished: o.datePublished } : {}),
  ...(o.dateModified ? { dateModified: o.dateModified } : {}),
  author: { '@type': 'Organization', name: o.author ?? SITE_NAME },
  publisher: organization(),
});

/**
 * Learning material behind a paywall or open: Google's paywall markup (Spec - Landing §8.6).
 * The teaser carries class "paywall-teaser"; the rest of the content is not in the HTML at all.
 */
export const learningResource = (o: { title: string; description: string; url: string; free: boolean }) => ({
  '@type': 'LearningResource',
  name: o.title,
  description: o.description,
  url: absolute(o.url),
  inLanguage: 'en',
  educationalLevel: 'Matura (B1–B2)',
  isAccessibleForFree: o.free,
  ...(o.free ? {} : { hasPart: { '@type': 'WebPageElement', isAccessibleForFree: false, cssSelector: '.paywall-teaser' } }),
  publisher: organization(),
});
