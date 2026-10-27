/**
 * Single source of truth for every public page and its localized URL.
 * Navigation, the language switcher, canonical/hreflang tags, and the sitemap
 * are all derived from here, so a page cannot exist in one place and not the others.
 */
import { localeMeta, locales, type Locale, type Localized } from './locales';

export type StaticPageKey = 'home' | 'games' | 'about' | 'contact' | 'press' | 'privacy';
export type PageKey = StaticPageKey | 'game';

/** Localized first path segment per section. Game slugs are shared across locales. */
const segments: Record<Exclude<PageKey, 'home'>, Localized> = {
  games: { en: 'games', sr: 'igre' },
  game: { en: 'games', sr: 'igre' },
  about: { en: 'about', sr: 'o-nama' },
  contact: { en: 'contact', sr: 'kontakt' },
  press: { en: 'press', sr: 'za-medije' },
  privacy: { en: 'privacy', sr: 'privatnost' },
};

export const staticPageKeys: readonly StaticPageKey[] = ['home', 'games', 'about', 'contact', 'press', 'privacy'];

export interface PageRef {
  key: PageKey;
  /** Required when key is 'game'. */
  slug?: string;
}

/** Root-relative path with a trailing slash, e.g. `/sr/igre/leap-up/`. */
export function pathFor(page: PageRef, locale: Locale): string {
  const prefix = localeMeta[locale].prefix;
  if (page.key === 'home') return `${prefix}/`;
  const base = `${prefix}/${segments[page.key][locale]}/`;
  if (page.key === 'game') {
    if (!page.slug) throw new Error('pathFor: game pages need a slug');
    return `${base}${page.slug}/`;
  }
  return base;
}

export function alternatesFor(page: PageRef): Array<{ locale: Locale; path: string }> {
  return locales.map((locale) => ({ locale, path: pathFor(page, locale) }));
}

/** Every public page in every locale. `gameSlugs` comes from the games collection. */
export function allPages(gameSlugs: readonly string[]): Array<{ page: PageRef; locale: Locale; path: string }> {
  const pages: PageRef[] = [
    ...staticPageKeys.map((key) => ({ key })),
    ...gameSlugs.map((slug) => ({ key: 'game' as const, slug })),
  ];
  return pages.flatMap((page) => locales.map((locale) => ({ page, locale, path: pathFor(page, locale) })));
}
