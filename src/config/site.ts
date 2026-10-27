/**
 * Build-time environment resolution.
 *
 * Fail-safe by design: anything that is not explicitly production is built as
 * `noindex` with a `Disallow: /` robots.txt, so previews can never be indexed.
 */
export type SiteEnv = 'production' | 'staging' | 'development';

function resolveSiteEnv(): SiteEnv {
  const explicit = import.meta.env.PUBLIC_SITE_ENV as string | undefined;
  if (explicit === 'production' || explicit === 'staging' || explicit === 'development') {
    return explicit;
  }
  // Set by Cloudflare Workers Builds.
  const branch = process.env.WORKERS_CI_BRANCH;
  if (branch) return branch === 'main' ? 'production' : 'staging';
  if (import.meta.env.DEV) return 'development';
  return 'staging';
}

export const SITE_ENV: SiteEnv = resolveSiteEnv();
export const IS_PRODUCTION = SITE_ENV === 'production';

export const SITE_URL = 'https://abravastudio.com';

/** Cloudflare Web Analytics beacon token; public by design, rendered only in production. */
export const CF_ANALYTICS_TOKEN =
  (import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN as string | undefined)?.trim() || undefined;

/** Existing Google Search Console HTML-tag verification (also verified via DNS TXT). */
export const GOOGLE_SITE_VERIFICATION = '0D7fX-FABBsAbKcizjknBjjTlo7DCY9p9ReYR4rPC20';
