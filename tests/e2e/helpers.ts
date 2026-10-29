import { expect, type Page, type APIRequestContext } from '@playwright/test';

export const SITE = 'https://abravastudio.com';

/** Every public URL, read from the generated sitemap and mapped to the local server. */
export async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const res = await request.get('/sitemap.xml');
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
}

/** Collects console errors (including CSP violations) and failed requests on a page. */
export function trackProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Outbound navigations aborted by the test itself are not page problems.
    if (url.startsWith('http://127.0.0.1')) problems.push(`requestfailed: ${url} ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.url().startsWith('http://127.0.0.1') && res.status() >= 400) problems.push(`http ${res.status()}: ${res.url()}`);
  });
  return problems;
}

export async function headLinks(page: Page) {
  return page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({
      hreflang: l.getAttribute('hreflang')!,
      href: l.getAttribute('href')!,
    })),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ''),
  }));
}
