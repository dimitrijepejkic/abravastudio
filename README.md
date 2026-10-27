# abravastudio.com

The official website of **Abrava Studio**, an independent mobile game studio from Serbia.
Bilingual (English at `/`, Serbian Latin under `/sr/`), static, and hosted on Cloudflare.

- Stack: [Astro](https://astro.build) 7 (static output) + TypeScript (strict). No UI framework, no backend.
- Content: typed YAML for games (`src/content/games/`), typed TS for studio facts (`src/data/studio.ts`).
- Hosting: Cloudflare Workers Static Assets (`wrangler.jsonc`), with `_headers` and `_redirects` in `public/`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how it fits together and [DEPLOYMENT.md](DEPLOYMENT.md) for releases.

## Quick start

Requires Node 24 (see `.nvmrc`).

```sh
npm ci
npm run dev          # http://localhost:4321, hot reload, placeholders visible
npm run preview      # production-like: builds, then serves dist/ via Cloudflare's local runtime on :8788
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Astro dev server |
| `npm run build` | Static build into `dist/` (staging/noindex unless production, see below) |
| `npm run preview` | Build + `wrangler dev`, which applies `_headers`, `_redirects` and the 404 page like production |
| `npm run check` | Type checking (`astro check`) |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:links` | Broken internal link check on `dist/` |
| `npm run test:e2e` | Playwright end-to-end + accessibility tests on a production build |
| `npm run verify` | All of the above, in order |
| `npm run check:store-links` | Live check that store, privacy and community URLs answer 200 (release checklist) |
| `npm run brand` | Regenerates OG images, favicons and the stable logo URL in `public/` |

First-time e2e setup: `npx playwright install chromium`.

### Environments

The build decides whether pages may be indexed. Anything not explicitly production gets
`<meta name="robots" content="noindex">` and a `Disallow: /` robots.txt.

| How it's built | `SITE_ENV` |
| --- | --- |
| Cloudflare build of `main` (`WORKERS_CI_BRANCH=main`) | production |
| Cloudflare build of any other branch | staging |
| `npm run dev` | development |
| Any other local build | staging |
| `PUBLIC_SITE_ENV=production\|staging\|development` | overrides all of the above |

Staging and development builds show yellow **placeholder** boxes where studio information is still missing.
Production builds hide those sections entirely and print the list of missing items in the build log.

## Adding a game

1. Create `src/content/games/<slug>.yaml`. Copy `leap-up.yaml` as a template. The file name becomes the URL slug
   (`/games/<slug>/` and `/sr/igre/<slug>/`).
2. Put artwork in `src/assets/games/<slug>/`: `icon.png` (512×512), `feature-graphic.png` (1024×500, the Play
   feature graphic), portrait screenshots in `screenshots/`, and optionally a trailer poster.
3. Set `status` (`in-development`, `coming-soon`, `available`, `unavailable`) and `platforms`:
   - A platform with `status: available` **must** have its store URL. The schema rejects anything that is not an
     official listing URL (`https://play.google.com/store/apps/details?id=…`, `https://apps.apple.com/<cc>/app/<name>/id<digits>`).
   - Leave a platform out entirely if the game isn't planned for it. No button is ever shown without a verified URL.
4. Fill in both `en` and `sr` for every localized field. The build fails if one is missing.
5. Run `npm run brand` to create `public/og/<slug>.png`, then `npm run verify`.
6. Run `npm run check:store-links` to confirm the new store URL is live.

When a game launches on iOS: add `platforms.ios` with the App Store URL, and add the official
"Download on the App Store" badge (Apple Marketing Tools) to `StoreButtons.astro`, replacing the text fallback.

## Editing copy

- Interface text and page copy: `src/i18n/ui.ts`. The Serbian dictionary is type-checked against the English one,
  so a missing key fails `npm run check`.
- Game text: the game's YAML file.
- Studio facts (team, founding year, upcoming game, legal name): `src/data/studio.ts`.
- Privacy policy: `src/views/privacy/PrivacyEn.astro` and `PrivacySr.astro` (update `PRIVACY_UPDATED` in
  `src/views/PrivacyView.astro` when the content changes).

Only verified facts belong in the copy: no invented history, numbers, ratings or awards (see [AGENTS.md](AGENTS.md)).

## Project docs

[PROJECT_PLAN.md](PROJECT_PLAN.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [DECISIONS.md](DECISIONS.md) ·
[TASKS.md](TASKS.md) · [SEO_CHECKLIST.md](SEO_CHECKLIST.md) · [SECURITY.md](SECURITY.md) · [DEPLOYMENT.md](DEPLOYMENT.md)
