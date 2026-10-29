# Decisions

Decisions made for the v2 site (2026-10-27), with the trade-offs considered. Newest last.

## D1. Astro static site instead of hand-written HTML
Two languages × several pages × canonical/hreflang/sitemap/JSON-LD is error-prone to maintain by hand. Astro gives
static HTML, typed content collections and image optimization with no runtime cost. No UI framework: interactivity
is three small scripts.

## D2. Hosting: Cloudflare Workers Static Assets (decided by the studio: "Cloudflare")
DNS is already on Cloudflare. Compared with staying on GitHub Pages, Cloudflare gives per-branch preview URLs
(staging), real response headers (CSP, HSTS), real 301 redirects and a true 404 status. Cloudflare recommends
Workers Static Assets over classic Pages for new projects. The build output is plain files plus `_headers` and
`_redirects`, which both products support, so switching to Pages would be trivial.

## D3. English at `/`, Serbian at `/sr/`, localized path segments
Keeps the already-indexed `/` URL and needs no language redirect. Serbian uses natural slugs (`/sr/igre/`, `/sr/o-nama/`).
A central route table keeps the language switcher, hreflang and sitemap consistent. Game slugs are shared across
languages because game names are brand names.

## D4. Serbian in Latin script, `sr-Latn`
`<html lang="sr-Latn">` and `hreflang="sr-Latn"`. Google supports script subtags in hreflang.

## D5. Contact via categorized mailto links (decided by the studio)
No form, so there's no spam surface, no backend, no email API and no DNS changes. Four topics (business,
partnerships, press, support) open the visitor's email app with a localized subject to `contact@abravastudio.com`.
A form can be added later (Worker + Turnstile + email API) if needed.

## D6. Analytics: Cloudflare Web Analytics (decided by the studio)
Cookieless and aggregate, so no consent banner is needed. It is enabled only on production builds and only when
`PUBLIC_CF_ANALYTICS_TOKEN` is set, and the privacy policy text switches automatically. It has no custom events,
so store clicks are measured by UTM parameters on Play links, reported in Play Console acquisition reports.

## D7. Placeholders for unconfirmed studio facts
Unconfirmed facts are `null` in `src/data/studio.ts`. Staging builds show a visible placeholder; production omits
the section and logs a warning. Missing facts never ship as filler. As of 2026-10-27, only the legal entity is
still missing. The founding year is deliberately unpublished (no placeholder), and the next game is announced
only as an unnamed "new project" until it has a title.

## D8. Google Play badge in Serbian is the official Cyrillic one
Google publishes no Serbian Latin badge. Serbian pages use Google's official Serbian (Cyrillic) badge, with the
Latin transliteration ("Nabavite na Google Play-u") as its accessible name. Alternative: use the English badge on
Serbian pages too. Change one import in `StoreButtons.astro` if the studio prefers that.

## D9. Wordmark rendered as text; small sizes use the lighter magenta
The logo from the original site (lime "A", white "BRAVA", magenta "STUDIO", Press Start 2P) is rendered as live
text. At small sizes (header and footer) "STUDIO" uses `#f07be9` (7.8:1 contrast) instead of brand `#ad1aa6`
(3.1:1), which axe flags and is hard to read at 14px. The large hero wordmark keeps the brand magenta. The
official PNG logo (black "STUDIO" on green) is used as-is for the press kit, the OG image and structured data.
**Open question for the studio:** which "STUDIO" color is canonical.

## D10. Header CSP, no inline code
All scripts and styles are external same-origin files. JSON-LD is a data block, not executed. One strict CSP
header, no `'unsafe-inline'`, no per-page hashes.

## D11. Legacy URLs
- `/newsletter.html` (an n8n email template that was publicly indexed) → 301 to `/`. Its source is kept in
  `legacy/email-templates/`.
- `/unsubscribe.html` → 301 to `/unsubscribe/`, a bilingual noindex page, in case already-sent emails or the n8n
  flow still link there.
- `/app-ads.txt` is preserved byte-for-byte and covered by a test.
- The dead `<link>`s to `/.well-known/*`, `/docs/api` and others (deleted in `0fec602`) are gone.
- The disabled newsletter JS and its n8n webhook call are removed. The webhook URL remains in git history.

## D12. No news/devlog, no SaaS scaffolding
There is no content to publish yet. A `posts` collection plus `news` route key can be added when there is a real
publishing plan (see ARCHITECTURE.md). No SaaS code, accounts, billing or placeholder product pages.

## D13. Game privacy policy stays on Google Sites
Leap UP!'s policy (`sites.google.com/view/leapup-privacy-policy`) is linked from the store listing. It is linked,
not copied, so the two can't drift apart. Moving it to `abravastudio.com/games/leap-up/privacy/` is possible later
but requires updating the Play listing at the same time.

## D14. External links open in the same tab
No `target="_blank"`. This is the accessible default, and on Android, Play links open the Play Store app anyway.

## D15. Contact address is `contact@abravastudio.com` (studio decision)
It replaced `info@` before launch, and it matches the address on the Leap UP! Play listing. Every page reads it
from `studio.email`.
