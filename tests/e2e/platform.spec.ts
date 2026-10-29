import { expect, test } from '@playwright/test';

/** Behaviour that depends on Cloudflare's asset handling: headers, redirects, status codes. */
test.describe('hosting behaviour', () => {
  test('app-ads.txt is served byte-for-byte unchanged (AdMob)', async ({ request }) => {
    const res = await request.get('/app-ads.txt');
    expect(res.status()).toBe(200);
    expect(await res.text()).toBe('google.com, pub-7347252425785032, DIRECT, f08c47fec0942fa0');
  });

  test('legacy URLs redirect permanently', async ({ request }) => {
    const newsletter = await request.get('/newsletter.html', { maxRedirects: 0 });
    expect(newsletter.status()).toBe(301);
    expect(new URL(newsletter.headers()['location']!, 'http://x').pathname).toBe('/');

    const unsubscribe = await request.get('/unsubscribe.html', { maxRedirects: 0 });
    expect(unsubscribe.status()).toBe(301);
    expect(new URL(unsubscribe.headers()['location']!, 'http://x').pathname).toBe('/unsubscribe/');
  });

  test('unknown URLs return a real 404 with the bilingual page', async ({ page }) => {
    for (const path of ['/does-not-exist/', '/sr/ne-postoji/', '/games/unknown-game/']) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(404);
      await expect(page.locator('h1')).toHaveText('Page not found');
      await expect(page.getByRole('heading', { name: 'Stranica nije pronađena' })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
  });

  test('the unsubscribe page still works and is not indexable', async ({ page }) => {
    const res = await page.goto('/unsubscribe/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('security headers are set', async ({ request }) => {
    const headers = (await request.get('/')).headers();
    const csp = headers['content-security-policy']!;
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' https://static.cloudflareinsights.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain('unsafe-inline');
    expect(headers['strict-transport-security']).toMatch(/max-age=\d+/);
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['access-control-allow-origin']).toBeUndefined();
  });

  test('fingerprinted assets are cached immutably', async ({ page, request }) => {
    await page.goto('/');
    const css = await page.locator('link[rel="stylesheet"][href^="/_astro/"]').first().getAttribute('href');
    const res = await request.get(css!);
    expect(res.headers()['cache-control']).toContain('immutable');
  });
});
