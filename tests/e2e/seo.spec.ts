import { expect, test } from '@playwright/test';
import { headLinks, sitemapPaths, SITE, trackProblems } from './helpers';

test.describe('SEO and metadata (production build)', () => {
  test('every sitemap page is indexable, unique and correctly localized', async ({ page, request }) => {
    const paths = await sitemapPaths(request);
    expect(paths).toHaveLength(14);

    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const path of paths) {
      const problems = trackProblems(page);
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);

      const head = await headLinks(page);
      const isSr = path.startsWith('/sr/');
      expect(head.lang, path).toBe(isSr ? 'sr-Latn' : 'en');
      expect(head.robots, path).toContain('index');
      expect(head.robots, path).not.toContain('noindex');
      expect(head.canonical, path).toBe(`${SITE}${path}`);
      expect(head.title.length, path).toBeGreaterThan(10);
      expect(head.description.length, path).toBeGreaterThan(50);
      titles.add(head.title);
      descriptions.add(head.description);

      // Reciprocal hreflang: en + sr-Latn + x-default, and this page is one of them.
      const langs = head.alternates.map((a) => a.hreflang).sort();
      expect(langs, path).toEqual(['en', 'sr-Latn', 'x-default']);
      expect(head.alternates.map((a) => a.href), path).toContain(`${SITE}${path}`);
      const xDefault = head.alternates.find((a) => a.hreflang === 'x-default')!.href;
      expect(xDefault, path).toBe(head.alternates.find((a) => a.hreflang === 'en')!.href);

      // The alternate page must link back to this one.
      const otherHref = head.alternates.find((a) => a.hreflang === (isSr ? 'en' : 'sr-Latn'))!.href;
      await page.goto(new URL(otherHref).pathname);
      const other = await headLinks(page);
      expect(other.alternates.map((a) => a.href), `${path} ↔ ${otherHref}`).toContain(`${SITE}${path}`);

      // Social image exists.
      const og = await request.get(new URL(head.ogImage!).pathname);
      expect(og.status(), head.ogImage!).toBe(200);

      // No visible placeholders may ever ship in production.
      await page.goto(path);
      await expect(page.locator('[data-placeholder]'), path).toHaveCount(0);

      expect(problems, path).toEqual([]);
    }

    expect(titles.size).toBe(paths.length);
    expect(descriptions.size).toBe(paths.length);
  });

  test('structured data parses and matches the visible page', async ({ page }) => {
    await page.goto('/');
    const home = (await headLinks(page)).jsonLd.map((s) => JSON.parse(s));
    const homeTypes = home.flatMap((g) => g['@graph'].map((n: { '@type': string }) => n['@type']));
    expect(homeTypes).toEqual(['Organization', 'WebSite']);
    const org = home[0]['@graph'][0];
    expect(org.name).toBe('Abrava Studio');
    expect(org.email).toBe('contact@abravastudio.com');
    expect((await page.request.get(new URL(org.logo).pathname)).status()).toBe(200);

    for (const [path, lang] of [['/games/leap-up/', 'en'], ['/sr/igre/leap-up/', 'sr-Latn']] as const) {
      await page.goto(path);
      const [ld] = (await headLinks(page)).jsonLd.map((s) => JSON.parse(s));
      const [game, crumbs] = ld['@graph'];
      expect(game['@type']).toEqual(['VideoGame', 'MobileApplication']);
      expect(game.name).toBe(await page.locator('h1').innerText());
      expect(game.inLanguage).toBe(lang);
      expect(game.operatingSystem).toBe('Android');
      expect(game.sameAs).toEqual(['https://play.google.com/store/apps/details?id=com.leapup']);
      // Never fabricate ratings, offers or download counts.
      for (const forbidden of ['aggregateRating', 'review', 'offers', 'interactionStatistic', 'datePublished']) {
        expect(game).not.toHaveProperty(forbidden);
      }
      expect(crumbs['@type']).toBe('BreadcrumbList');
      expect(crumbs.itemListElement).toHaveLength(3);
    }
  });

  test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    expect(robots).not.toContain('Disallow: /');
  });

  test('sitemap lists hreflang alternates for every URL', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml.match(/<url>/g)).toHaveLength(14);
    expect(xml.match(/hreflang="x-default"/g)).toHaveLength(14);
    expect(xml).toContain(`<loc>${SITE}/sr/igre/leap-up/</loc>`);
    expect(xml).not.toContain('unsubscribe');
    expect(xml).not.toContain('newsletter');
  });
});
