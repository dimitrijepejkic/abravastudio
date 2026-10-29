/**
 * XML sitemap generated from the route table, with reciprocal hreflang alternates
 * (https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap).
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '@/config/site';
import { localeMeta } from '@/i18n/locales';
import { allPages, alternatesFor, pathFor } from '@/i18n/routes';
import { getGameSlugs } from '@/lib/games';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const pages = allPages(await getGameSlugs());
  const abs = (path: string) => escape(new URL(path, SITE_URL).toString());

  const urls = pages
    .map(({ page, path }) => {
      const links = alternatesFor(page)
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${localeMeta[alt.locale].lang}" href="${abs(alt.path)}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pathFor(page, 'en'))}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${abs(path)}</loc>\n${links}\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
