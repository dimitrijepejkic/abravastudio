import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { sitemapPaths } from './helpers';

test.describe('accessibility (axe, WCAG 2.2 AA)', () => {
  test('every page has no detectable WCAG A/AA violations', async ({ page, request }) => {
    const paths = [...(await sitemapPaths(request)), '/does-not-exist/', '/unsubscribe/'];
    const report: string[] = [];
    for (const path of paths) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      for (const v of results.violations) {
        report.push(`${path} [${v.impact}] ${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      }
    }
    expect(report).toEqual([]);
  });

  test('the open screenshot dialog has no violations', async ({ page }) => {
    await page.goto('/games/leap-up/');
    await page.locator('[data-gallery-index="0"]').click();
    await expect(page.locator('dialog[data-lightbox]')).toBeVisible();
    const results = await new AxeBuilder({ page }).include('dialog[data-lightbox]').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('heading levels never skip', async ({ page, request }) => {
    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      const levels = await page.locator('main h1, main h2, main h3, main h4').evaluateAll((els) =>
        els.map((el) => Number(el.tagName[1])),
      );
      expect(levels[0], path).toBe(1);
      expect(levels.filter((l) => l === 1), path).toHaveLength(1);
      levels.forEach((level, i) => {
        if (i > 0) expect(level - levels[i - 1]!, `${path} h${levels[i - 1]}→h${level}`).toBeLessThanOrEqual(1);
      });
    }
  });
});
