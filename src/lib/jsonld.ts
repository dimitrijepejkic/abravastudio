/**
 * Schema.org structured data. Everything here must also be visible on the page;
 * never add ratings, offers, download counts or dates that the page doesn't show.
 */
import { SITE_URL } from '@/config/site';
import { studio } from '@/data/studio';
import type { Locale } from '@/i18n/locales';
import { localeMeta } from '@/i18n/locales';
import { availableStores, platformNames, type Game } from './games';

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function organizationLd(logoUrl: string): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: studio.name,
    url: `${SITE_URL}/`,
    logo: absoluteUrl(logoUrl),
    email: studio.email,
    address: { '@type': 'PostalAddress', addressCountry: studio.countryCode },
    sameAs: [studio.social.youtube, studio.social.tiktok, studio.social.googlePlayDeveloper],
  };
}

export function websiteLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: studio.name,
    url: `${SITE_URL}/`,
    inLanguage: ['en', 'sr-Latn'],
    publisher: { '@id': ORG_ID },
  };
}

export function videoGameLd(game: Game, locale: Locale, pageUrl: string, imageUrl: string): JsonLd {
  const d = game.data;
  const stores = availableStores(game);
  const operatingSystems = stores.map((store) => platformNames[store.platform]);
  return {
    '@type': ['VideoGame', 'MobileApplication'],
    '@id': `${absoluteUrl(pageUrl)}#game`,
    name: d.name,
    ...(d.storeTitle && d.storeTitle !== d.name ? { alternateName: d.storeTitle } : {}),
    description: d.summary[locale],
    url: absoluteUrl(pageUrl),
    image: absoluteUrl(imageUrl),
    inLanguage: localeMeta[locale].lang,
    genre: d.genre[locale],
    applicationCategory: 'GameApplication',
    ...(operatingSystems.length
      ? { operatingSystem: operatingSystems.join(', '), gamePlatform: operatingSystems }
      : {}),
    ...(d.contentRating ? { contentRating: d.contentRating } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(stores.length ? { sameAs: stores.map((store) => store.url) } : {}),
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
