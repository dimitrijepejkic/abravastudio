import { defineConfig, devices } from '@playwright/test';

const PORT = 8790;

/**
 * End-to-end tests run against a production-mode build served by `wrangler dev`, i.e. the same
 * static assets, _headers, _redirects and 404 handling that Cloudflare serves in production.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npx wrangler dev --port ${PORT} --ip 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PUBLIC_SITE_ENV: 'production',
      // Keep analytics out of tests even if a token is configured locally.
      PUBLIC_CF_ANALYTICS_TOKEN: '',
      WRANGLER_SEND_METRICS: 'false',
      CI: 'true',
    },
  },
});
