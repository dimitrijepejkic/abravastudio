import { expect, test } from '@playwright/test';
import { trackProblems } from './helpers';

const PLAY_BASE = 'https://play.google.com/store/apps/details?id=com.leapup';

test.describe('visitor journeys', () => {
  test('home → games → Leap UP → Serbian → back to English', async ({ page, isMobile }) => {
    const problems = trackProblems(page);

    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Abrava Studio');
    await expect(page).toHaveTitle(/Abrava Studio/);

    // Navigate through the header (via the menu button on phones).
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Games' }).click();
    await expect(page).toHaveURL(/\/games\/$/);
    await expect(page.locator('h1')).toHaveText('Our games');

    await page.getByRole('link', { name: 'Leap UP: Pixel Jump Game', exact: true }).first().click();
    await expect(page).toHaveURL(/\/games\/leap-up\/$/);
    await expect(page.locator('h1')).toHaveText('Leap UP: Pixel Jump Game');

    // Switch language: must land on the same game, in Serbian.
    if (isMobile) await page.getByRole('button', { name: 'Menu' }).click();
    await page.locator('header [data-lang-switch="sr"]').click();
    await expect(page).toHaveURL(/\/sr\/igre\/leap-up\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Latn');
    await expect(page.locator('h1')).toHaveText('Leap UP: Pixel Jump Game');
    await expect(page.getByText('Sasvim običan dan… valjda.')).toBeVisible();

    if (isMobile) await page.getByRole('button', { name: 'Meni' }).click();
    await page.locator('header [data-lang-switch="en"]').click();
    await expect(page).toHaveURL(/\/games\/leap-up\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    expect(problems).toEqual([]);
  });

  test('the language switcher maps every page to its equivalent', async ({ page }) => {
    const pairs: Array<[string, string]> = [
      ['/', '/sr/'],
      ['/games/', '/sr/igre/'],
      ['/games/leap-up/', '/sr/igre/leap-up/'],
      ['/about/', '/sr/o-nama/'],
      ['/contact/', '/sr/kontakt/'],
      ['/press/', '/sr/za-medije/'],
      ['/privacy/', '/sr/privatnost/'],
    ];
    for (const [en, sr] of pairs) {
      await page.goto(en);
      await expect(page.locator('header [data-lang-switch="sr"]')).toHaveAttribute('href', sr);
      await page.goto(sr);
      await expect(page.locator('header [data-lang-switch="en"]')).toHaveAttribute('href', en);
    }
  });
});

test.describe('store links', () => {
  test('Google Play buttons point to the verified listing with UTM tags', async ({ page }) => {
    for (const path of ['/', '/games/', '/games/leap-up/', '/sr/igre/leap-up/']) {
      await page.goto(path);
      const badges = page.locator('a[data-store="google-play"]');
      expect(await badges.count(), path).toBeGreaterThan(0);
      for (const href of await badges.evaluateAll((els) => els.map((el) => el.getAttribute('href')!))) {
        const url = new URL(href);
        expect(url.host).toBe('play.google.com');
        expect(`${url.origin}${url.pathname}?id=${url.searchParams.get('id')}`).toBe(PLAY_BASE);
        expect(url.searchParams.get('utm_source')).toBe('abravastudio.com');
        expect(url.searchParams.get('utm_campaign')).toBeTruthy();
      }
    }
  });

  test('following the Google Play button opens the official listing', async ({ page }) => {
    // Intercept so the test never depends on (or loads) the real store page.
    let requested = '';
    await page.route('https://play.google.com/**', (route) => {
      requested = route.request().url();
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Play</title>' });
    });
    await page.goto('/games/leap-up/');
    await page.locator('main a[data-store="google-play"]').first().click();
    await expect.poll(() => requested).toContain('play.google.com/store/apps/details?id=com.leapup');
  });

  test('no App Store button exists while Leap UP is Android-only', async ({ page }) => {
    for (const path of ['/', '/games/', '/games/leap-up/', '/sr/igre/leap-up/', '/press/']) {
      await page.goto(path);
      await expect(page.locator('a[data-store="app-store"]')).toHaveCount(0);
      await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(0);
    }
  });
});

test.describe('studio content', () => {
  test('about page lists the founders in both languages', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.getByText('Dimitrije Pejkić')).toBeVisible();
    await expect(page.getByText('Founder', { exact: true })).toBeVisible();
    await expect(page.getByText('Aleksa Dinić')).toBeVisible();
    await expect(page.getByText('Co-founder', { exact: true })).toBeVisible();
    // The founding year is intentionally not published yet.
    await expect(page.getByText('Founded', { exact: true })).toHaveCount(0);

    await page.goto('/sr/o-nama/');
    await expect(page.getByText('Osnivač', { exact: true })).toBeVisible();
    await expect(page.getByText('Suosnivač', { exact: true })).toBeVisible();
  });

  test('home shows the unnamed upcoming project and every community channel', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'A new project' })).toBeVisible();
    for (const href of [
      'https://discord.gg/Pe43a2wpKr',
      'https://www.youtube.com/@AbravaStudio',
      'https://www.tiktok.com/@abravastudio',
      'https://www.instagram.com/abravastudio/',
    ]) {
      await expect(page.locator(`main a[href="${href}"]`)).toHaveCount(1);
      await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
    }
  });
});

test.describe('contact', () => {
  test('every topic opens a prefilled email to contact@abravastudio.com', async ({ page }) => {
    await page.goto('/contact/');
    const topics = page.locator('[data-topic]');
    await expect(topics).toHaveCount(4);
    const hrefs = await topics.locator('a[href^="mailto:"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')!));
    expect(hrefs).toHaveLength(4);
    for (const href of hrefs) {
      expect(href).toMatch(/^mailto:contact@abravastudio\.com\?subject=.+/);
    }
    // No fake form: contact is email-only by design.
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('Serbian topics use Serbian subjects', async ({ page }) => {
    await page.goto('/sr/kontakt/');
    const href = await page.locator('[data-topic="support"] a[href^="mailto:"]').getAttribute('href');
    expect(decodeURIComponent(href!)).toContain('subject=Podrška za igrače');
  });
});

test.describe('interactive components', () => {
  test('screenshot lightbox opens, navigates and returns focus', async ({ page }) => {
    await page.goto('/games/leap-up/');
    const first = page.locator('[data-gallery-index="0"]');
    await first.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[data-lightbox]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-lightbox-counter]')).toHaveText('1 / 8');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-lightbox-counter]')).toHaveText('2 / 8');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
  });

  test('YouTube loads only after the visitor presses play', async ({ page }) => {
    const youtube: string[] = [];
    await page.route(/youtube(-nocookie)?\.com|ytimg\.com/, (route) => {
      youtube.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'text/html', body: '' });
    });
    await page.goto('/games/leap-up/');
    await page.locator('[data-youtube]').scrollIntoViewIfNeeded();
    expect(youtube).toEqual([]);
    await page.locator('[data-youtube] a').click();
    const iframe = page.locator('[data-youtube] iframe');
    await expect(iframe).toHaveAttribute('src', /^https:\/\/www\.youtube-nocookie\.com\/embed\/z6GkGEwe-8E/);
  });

  test('mobile menu is keyboard operable and closes with Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on small screens');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('skip link moves focus to the main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard-only check');
    await page.goto('/about/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});
