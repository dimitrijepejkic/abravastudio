import { describe, expect, it } from 'vitest';
import { locales } from '@/i18n/locales';
import { allPages, alternatesFor, pathFor, staticPageKeys } from '@/i18n/routes';

const slugs = ['leap-up'];

describe('route table', () => {
  it('keeps English at the root and Serbian under /sr/', () => {
    expect(pathFor({ key: 'home' }, 'en')).toBe('/');
    expect(pathFor({ key: 'home' }, 'sr')).toBe('/sr/');
    expect(pathFor({ key: 'games' }, 'sr')).toBe('/sr/igre/');
    expect(pathFor({ key: 'game', slug: 'leap-up' }, 'en')).toBe('/games/leap-up/');
    expect(pathFor({ key: 'game', slug: 'leap-up' }, 'sr')).toBe('/sr/igre/leap-up/');
  });

  it('produces one unique, trailing-slash path per page and locale', () => {
    const pages = allPages(slugs);
    expect(pages).toHaveLength((staticPageKeys.length + slugs.length) * locales.length);
    const paths = pages.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) expect(path).toMatch(/^\/([a-z0-9-]+\/)*$/);
  });

  it('lists an alternate for every locale', () => {
    const alts = alternatesFor({ key: 'about' });
    expect(alts.map((a) => a.locale)).toEqual([...locales]);
    expect(alts.map((a) => a.path)).toEqual(['/about/', '/sr/o-nama/']);
  });

  it('refuses a game page without a slug', () => {
    expect(() => pathFor({ key: 'game' }, 'en')).toThrow();
  });
});
