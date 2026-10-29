# Tech stack

Current stack for abravastudio.com, with the reason for each choice. Reviewed 2026-10-29. Update this file when a
dependency, a hosting service or a build tool changes. Reasons are recorded in [DECISIONS.md](DECISIONS.md).

## Summary

A static, bilingual marketing site. Astro builds plain HTML, CSS and JS at build time. At runtime there is no server
code: Cloudflare serves the files in `dist/`.

## Hosting and runtime

| Layer | Choice | Version | Why |
| --- | --- | --- | --- |
| Hosting | Cloudflare Workers Static Assets (`wrangler.jsonc`) | wrangler 4.154.0 | DNS is already on Cloudflare. Gives per-branch preview URLs, real headers, real 301s and a true 404 status (D2). |
| Headers and redirects | `public/_headers`, `public/_redirects` | n/a | Strict CSP, HSTS and other security headers, plus legacy URL redirects (D10, D11). |
| Fonts | `@fontsource-variable/space-grotesk`, `@fontsource/press-start-2p` | 5.3.0 | Self-hosted, so no third-party requests on load. Latin-Ext subset covers Serbian diacritics. |
| Analytics | Cloudflare Web Analytics | n/a | Cookieless, so no consent banner needed. Production builds only, and only when `PUBLIC_CF_ANALYTICS_TOKEN` is set (D6). Set in the Cloudflare build since 2026-10-29. |

## Build and content

| Layer | Choice | Version | Why |
| --- | --- | --- | --- |
| Site generator | Astro, static output | 7.4.2 | Multi-language pages, typed content and image optimization with no runtime cost (D1). |
| Language | TypeScript, strict (`astro/tsconfigs/strict`) | 6.0.3 | Route, content and dictionary errors fail `npm run check`. |
| Type check | `@astrojs/check` | 0.9.12 | Checks `.astro` files as well as `.ts`. |
| Content | Astro content collections, glob loader, YAML per game | n/a | One file per game, validated at build time (`src/content.config.ts`). |
| Validation | Zod (via `astro/zod`) | bundled with Astro | Schema for games, store URLs and required `en`/`sr` fields. |
| Routing | Central route table `src/i18n/routes.ts` (`pathFor`) | n/a | Keeps URLs, canonical, hreflang, the language switcher and the sitemap consistent (D3). |
| Images | `astro:assets` (sharp used internally by Astro) | bundled with Astro | Responsive WebP with explicit dimensions. |
| Brand assets | `scripts/build-brand-assets.mjs` using `sharp` | not declared (see open items) | Generates OG cards, favicons and the stable logo for `public/`. |
| Styling | Plain CSS: `src/styles/tokens.css` (custom properties) and `global.css` | n/a | No preprocessor. Tokens cover what variables would do (see Sass below). |
| UI framework | None | n/a | Interactivity is three small scripts: mobile menu, screenshot lightbox, YouTube facade (D1). |
| Runtime engine | Node.js 24 (`.nvmrc`); `engines` requires `>=22.12.0` | n/a | Matches the build and test tooling. |

## Quality and tests

| Tool | Version | Purpose |
| --- | --- | --- |
| ESLint | 10.13.0 | Lint, with `typescript-eslint` 8.72.1 and `eslint-plugin-astro` 3.2.1 |
| Vitest | 5.0.5 | Unit tests (`tests/unit`), e.g. URL validation and route logic |
| Playwright | 1.64.1 | End-to-end tests against a production build on `wrangler dev` (`tests/e2e`), desktop Chrome and Pixel 7 |
| @axe-core/playwright | 4.14.0 | Accessibility checks (WCAG 2.2 AA target) inside the e2e tests |
| linkinator | 8.1.0 | Internal link check on `dist/` |
| wrangler | 4.154.0 | Local production-like server (`npm run preview`) |
| @types/node | 24.19.2 | Node typings for scripts and config |

`npm run verify` runs all of the above in order.

## CI

GitHub Actions, `.github/workflows/ci.yml`. Runs `verify` on pull requests and on pushes to `main` and `site-v2`.
Uses `ubuntu-latest`, `actions/checkout` v7 and `actions/setup-node` v7. **CI never deploys.** Cloudflare Workers
Builds deploys, and production releases need studio approval (DEPLOYMENT.md).

## Versions and reproducibility

- Dependencies are pinned to exact versions in `package.json` (no `^` or `~`).
- `package-lock.json` is committed. Install with `npm ci`.
- npm `allowScripts` permits install scripts only for `esbuild` and `workerd`.

## Deliberately not used

| Not used | Why |
| --- | --- |
| React, Vue, Svelte or another UI framework | Three small scripts do not need one (D1). |
| CMS, database | Content lives in YAML in git, so git is the source of truth (ARCHITECTURE.md). |
| Contact form, backend, email API | `mailto:` links avoid a spam surface and a backend (D5). |
| Google Analytics, cookie banner | Cloudflare Web Analytics is cookieless (D6). |
| Inline scripts and styles | Keeps the CSP at `script-src 'self'` and `style-src 'self'` (D10). |
| Sass / SCSS | Not needed yet, see below. |

## Open items

- **`sharp` is not declared in `package.json`.** `scripts/build-brand-assets.mjs` imports it, and it works now only
  because Astro installs it as a transitive dependency. Add it as a `devDependency` with an exact version.
- The studio still has to confirm the canonical colour of "STUDIO" (D9).

## If a SaaS product is added

The SaaS is **not built** and is out of scope for this site (PROJECT_PLAN.md). The plan in ARCHITECTURE.md is a
**separate project**, for example its own repo or a Worker on `app.abravastudio.com`. Its stack would be decided
there, in its own DECISIONS.md.

What changes **in this repository**:

- A marketing page for the product: a new page key in `src/i18n/routes.ts`, a view, a nav entry and a footer link.
- Optional: a `products` content collection, mirroring `games`.
- Nothing else. This stack stays as it is.

What would change **if the SaaS code lived in this repository** (not recommended, and it needs a scoped decision
in DECISIONS.md first, per AGENTS.md):

- Runtime: a Worker script in `wrangler.jsonc` (`main`), instead of static assets only.
- Data and auth: a database, an auth provider and secrets. None of these exist today.
- Security: new `connect-src` and `form-action` rules in `_headers`, an updated SECURITY.md and privacy policy.
- Rules: the "keep it static" rule in AGENTS.md would no longer hold for the whole repo.
- CI: secrets and test setup for the new backend.

## If Sass (SCSS) is added

This only applies if "Sass" meant the stylesheet language and not SaaS.

- Changes: one exact-pinned devDependency (`sass`), and `.scss` files instead of `.css`. Astro and Vite compile them
  at build time.
- Does not change: the rest of the stack, the hosting, or the CSP. The output is still external CSS files, so
  `style-src 'self'` still holds.
- Not needed now. The current CSS already uses custom properties for tokens, and modern CSS supports nesting. Add Sass
  only if the stylesheets grow enough to need mixins or functions.
