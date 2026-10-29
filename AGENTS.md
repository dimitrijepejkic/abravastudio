# Agent notes: abravastudio.com

Rules for anyone (human or AI) changing this repository.

## Going live
When the studio asks what is left before launch ("šta treba da namestim pre live verzije"), read
[GO_LIVE.md](GO_LIVE.md), check the real state (`git status`, is `site-v2` pushed or merged?), and walk them
through the remaining unchecked steps in order, in Serbian. Keep GO_LIVE.md up to date as steps are completed.

## Production safety
- `abravastudio.com` is live. **Never deploy, merge to `main`, push, change DNS, or touch Cloudflare/GitHub
  settings without explicit approval from the studio.** Work on a branch; previews are for review.
- Until the cutover in DEPLOYMENT.md is done, GitHub Pages serves `main`'s root. Merging an Astro tree into `main`
  early takes the live site down.
- `public/app-ads.txt` must stay byte-identical (AdMob). A test checks it.
- Never weaken or delete tests to make them pass.

## Content truthfulness
- Only verified facts. No invented history, team, numbers, downloads, ratings, awards, release dates or features.
- Store URLs must be the official listing URLs, verified live (`npm run check:store-links`). No button without a URL.
- Missing studio facts go in `src/data/studio.ts` as `null`. They render as staging-only placeholders.
- Game names are never translated. Every localized field needs both `en` and `sr` (natural Serbian, Latin script).
- JSON-LD must match visible content (`src/lib/jsonld.ts`).

## How things fit
- URLs come only from `src/i18n/routes.ts` (`pathFor`). Never hard-code a page path in a component.
- UI strings live in `src/i18n/ui.ts`. Game content lives in `src/content/games/*.yaml`.
- No inline `<script>`/`<style>`/`style=""`: the CSP is `script-src 'self'` / `style-src 'self'`.
  New third-party origins need a CSP update in `public/_headers` and a privacy policy update.
- Keep it static. No backend, CMS, auth or SaaS code without a scoped decision in DECISIONS.md.

## Before handing back
`npm run verify` (type check, lint, unit, build, links, e2e + axe). Record results in TASKS.md.
Distinguish implemented / tested / deployed / verified-in-production when reporting.
