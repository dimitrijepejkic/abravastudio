# Tasks

Legend: ✅ done and verified · 🟡 done, needs studio review/approval · ⬜ open.

The ordered pre-launch steps for the studio are in [GO_LIVE.md](GO_LIVE.md) (Serbian).

## Built (branch `site-v2`)

- ✅ Astro 7 static site, TypeScript strict, route table, EN (`/`) + SR (`/sr/`)
- ✅ Pages: home, games, Leap UP!, about, contact, press, privacy, 404 (bilingual), unsubscribe (legacy)
- ✅ Leap UP! content verified against the live Play listing (title, description, PEGI 3, Android only, privacy URL, trailer)
- ✅ Leap UP! re-synced with the Play listing for version 1.1.0 (2026-10-29): store title "Leap UP: Pixel Jump Game",
  new short and full description (six worlds, power-ups, record flag, fair play), new feature graphic + OG card,
  the 8 store screenshots (replacing 6 older ones), new official trailer `z6GkGEwe-8E` and its poster.
  The game card now shows the whole key art in the wide layout (contain on the key art's sky color), so the new
  art's title isn't cropped
- ✅ Official Google Play badges (EN; official SR badge is Cyrillic, see DECISIONS.md D8), UTM-tagged links
- ✅ No App Store button anywhere (no iOS release), and a test enforces it
- ✅ Screenshot gallery with keyboard-accessible lightbox; click-to-load YouTube (nocookie)
- ✅ SEO: titles/descriptions, canonical, hreflang, sitemap, robots, OG images, JSON-LD
- ✅ Security headers + strict CSP, legacy redirects, real 404s, `app-ads.txt` preserved byte-for-byte
- ✅ Tests: 18 unit, 50 e2e (+2 device-specific skips), axe on every page, link check, live store-link check
- ✅ CI workflow (verification only, never deploys)
- ✅ Docs: README, ARCHITECTURE, DECISIONS, DEPLOYMENT, SECURITY, SEO_CHECKLIST, PROJECT_PLAN, AGENTS

## Last verification run (2026-10-29, local, Windows, after the Leap UP! 1.1.0 content sync)

| Check | Result |
| --- | --- |
| `npm run check` | 0 errors, 0 warnings |
| `npm run lint` | clean |
| `npm test` | 18/18 passed |
| `npm run build` | 16 pages + sitemap + robots |
| `npm run test:links` | 108 links, 0 broken |
| `npm run test:e2e` | 50 passed, 2 skipped (mobile-only / desktop-only checks) |
| `npm run check:store-links` | 6/6 live, Play listing developer = Abrava Studio |
| Visual check (local preview) | game page EN 1440 px + SR 360/390 px, home 1440 px, games 1440/900 px: key art, cards, gallery, trailer poster OK |
| Note | one run failed all unit files with `reading 'config'` right after the shell's drive letter changed `e:` → `E:` (Vitest on Windows); rerun from `E:` passed |
| Horizontal overflow at 360 / 768 / 1280 px | none on all 15 pages (2026-10-27, not re-run) |
| Lighthouse (local) | 99–100 on all categories (2026-10-27, not re-run); see SEO_CHECKLIST.md |
| `npm audit` | 0 vulnerabilities (2026-10-27, not re-run) |

**Not verified yet:** behaviour on a real Cloudflare deployment (preview or production), real devices,
Search Console, Cloudflare Web Analytics (needs a token).

## Studio review needed 🟡

- 🟡 All copy, EN and SR: `src/i18n/ui.ts`, `src/content/games/leap-up.yaml`, privacy pages.
  "How we work" on About and the hero tagline "Small studio. Big leaps." are proposals.
- 🟡 Press kit: approve the usage note and the downloadable items (logo, icon, key art, 8 screenshots)
- ✅ Game name: "Leap UP: Pixel Jump Game" is the official name (studio decision, 2026-10-29). Titles, cards,
  breadcrumbs and first mentions use it; running text uses the short "Leap UP" like the store description. The URL
  stays `/games/leap-up/`.
- 🟡 Wordmark color: magenta "STUDIO" (site) vs black "STUDIO" (PNG logo). Which is canonical? (DECISIONS.md D9)
- 🟡 Serbian Play badge: official Cyrillic badge, or the English badge on Serbian pages? (D8)
- 🟡 Favicon: the lime pixel "A" derived from the wordmark

## Content the studio owes ⬜

Shown as placeholders on staging, hidden in production (`src/data/studio.ts`):

- ✅ Team: Dimitrije Pejkić (Founder / Osnivač), Aleksa Dinić (Co-founder / Suosnivač)
- ✅ Upcoming project: shown as an unnamed "A new project / Novi projekat, in development". Add the title when it's announced
- ✅ TikTok: https://www.tiktok.com/@abravastudio
- ✅ Instagram: https://www.instagram.com/abravastudio/ (link from the studio, 2026-10-29; official glyph from Wikimedia Commons, public domain)
- ✅ Contact email: `contact@abravastudio.com`
- ⏸ Founding year: intentionally not published for now (studio decision)
- ⬜ Legal name and registered address (privacy policy data controller)
- ⬜ Optional: higher-resolution or source artwork for Leap UP!

## Studio actions ⬜

- ✅ Email forwarding works for both `contact@` and `info@abravastudio.com` (confirmed by the studio, 2026-10-29;
  the Play description's `info@` is fine)
- ⬜ Approve pushing `site-v2` to GitHub
- ⬜ Connect the repo in Cloudflare (DEPLOYMENT.md → one-time setup); optionally create a Web Analytics token
- ⬜ Approve the production cutover (DEPLOYMENT.md → cutover runbook)
- ⬜ Disable or rotate the old n8n newsletter webhook (SECURITY.md risk 1)
- ⬜ After launch: Search Console sitemap submission; uptime monitor
- ⬜ Optional: the Play listing also shows `abravastudio@gmail.com` next to `contact@`; remove it if it shouldn't be public