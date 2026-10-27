# SEO checklist

Status key: **[x]** implemented and tested · **[~]** implemented, not yet verifiable (needs production) · **[ ]** pending.

## Technical

- [x] Static HTML: all content indexable without JavaScript
- [x] Unique `<title>` and meta description on all 14 pages (e2e: `seo.spec.ts`)
- [x] Canonical URL on every page = its own absolute `https://abravastudio.com/…/` URL
- [x] Stable, lowercase, trailing-slash URLs. `/games` → `/games/` redirect handled by Cloudflare
- [x] `hreflang` alternates `en`, `sr-Latn`, `x-default` (→ English), reciprocal on every page (e2e-tested)
- [x] `<html lang>` = `en` / `sr-Latn`
- [x] XML sitemap at `/sitemap.xml` with `xhtml:link` alternates. Excludes 404, unsubscribe and legacy URLs
- [x] `robots.txt`: production allows everything and lists the sitemap. Every other build disallows everything
- [x] `noindex` on all non-production builds, on 404 and on `/unsubscribe/`
- [x] Real 404 status for unknown URLs (Cloudflare `not_found_handling: 404-page`)
- [x] 301s for legacy URLs: `/newsletter.html` → `/`, `/unsubscribe.html` → `/unsubscribe/`
- [~] `http://` → `https://` and `www` → apex: Cloudflare, configured at cutover (DEPLOYMENT.md step 3)
- [x] Open Graph + Twitter card tags, 1200×630 images (studio and per game), `og:locale` + alternate
- [x] Descriptive `alt` on all content images in both languages. Decorative images use `alt=""`
- [x] Responsive images (WebP, `srcset`, explicit dimensions), LCP image `fetchpriority="high"`
- [x] Internal links: home ↔ games ↔ game page ↔ about/press/contact, breadcrumbs on game pages
- [x] Google site verification meta tag kept (`0D7fX-…`). The DNS TXT verification also exists

## Structured data (JSON-LD)

- [x] Home: `Organization` + `WebSite`
- [x] Game pages: `VideoGame` + `MobileApplication`, `BreadcrumbList`
- [x] No fabricated `aggregateRating`, `review`, `offers`, download counts or dates (e2e-asserted)
- [ ] Validate on production with the [Rich Results Test](https://search.google.com/test/rich-results) and
      [Schema Markup Validator](https://validator.schema.org/). Rich results are not guaranteed.

## Performance (measured)

Lighthouse 13.5.0, 2026-10-27, **local** production build on `wrangler dev`, Lighthouse's default simulated
throttling. Re-measure on the Cloudflare preview URL and on production.

| Page | Device | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 ms |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms |
| `/games/leap-up/` | mobile | 100 | 100 | 100 | 100 | 1.6 s | 0 | 0 ms |
| `/games/leap-up/` | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms |
| `/sr/` | mobile | 99 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms |
| `/sr/` | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms |

- [ ] Re-run on the preview URL: `npx lighthouse@13.5.0 <url>` and `--preset=desktop`
- [ ] Field data (CrUX / Search Console Core Web Vitals) once there is enough traffic

## Google Search Console (studio action, after cutover)

1. Open [Search Console](https://search.google.com/search-console) with the Google account that owns the
   existing verification (`google-site-verification=0D7fX-…` TXT record).
2. Use (or add) a **Domain property** for `abravastudio.com`. DNS verification is already in place.
3. **Sitemaps** → submit `https://abravastudio.com/sitemap.xml`.
4. **URL inspection** → request indexing for `/`, `/sr/`, `/games/leap-up/`, `/sr/igre/leap-up/`.
5. **Removals:** if `newsletter.html` was indexed, the 301 resolves it. No manual removal is needed.
6. After 1–2 weeks: check **Pages** (indexed vs excluded) and **International targeting/hreflang** reports.

Don't expect instant results. Indexing and ranking take weeks, and nothing here guarantees rich results.

## Content and discoverability (pending)

- [ ] Update the Leap UP! Play listing's developer website/email if desired (it shows `contact@` and a Gmail
      address; the site uses `info@`)
- [ ] Link to `abravastudio.com` from the YouTube channel and Discord server profiles
- [ ] Each new game: a detail page with unique copy in both languages (see README "Adding a game")
- [ ] Consider a devlog/news section only when there is a real publishing plan (DECISIONS.md D12)
