/**
 * Production allows crawling and points to the sitemap. Every other build (Cloudflare previews,
 * local builds) disallows everything, as a second line of defence next to the noindex meta tag.
 */
import type { APIRoute } from 'astro';
import { IS_PRODUCTION, SITE_URL } from '@/config/site';

export const GET: APIRoute = () => {
  const body = IS_PRODUCTION
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    : `# Non-production build: not for indexing.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
