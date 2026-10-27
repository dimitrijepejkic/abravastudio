# Deployment

> **Production changes require explicit approval from the studio.** Nothing in this repository deploys automatically
> to `abravastudio.com` until the cutover below has been approved and carried out.

## Current state (2026-10-27)

| | Today | After cutover |
| --- | --- | --- |
| Serves `abravastudio.com` | GitHub Pages, from the root of `main` (legacy site) | Cloudflare Worker `abravastudio` (static assets from `dist/`) |
| DNS | Cloudflare (proxied) → GitHub Pages | Cloudflare custom domain → Worker |
| Staging | none | Cloudflare preview URL per non-`main` branch |
| Rollback point | git tag `legacy-gh-pages` (= `6fa1d7e`) | same |

Do **not** merge `site-v2` into `main` before the DNS cutover: GitHub Pages publishes `main`'s root, which no
longer contains a static `index.html`, so the live site would break.

## Environments

| Environment | URL | Built from | Indexable |
| --- | --- | --- | --- |
| Local dev | `http://localhost:4321` | working tree (`npm run dev`) | no |
| Local production-like | `http://127.0.0.1:8788` | `npm run preview` (wrangler dev applies `_headers`/`_redirects`) | no (unless `PUBLIC_SITE_ENV=production`) |
| Staging | Cloudflare preview URL (`*.workers.dev`) | any branch ≠ `main` | no (`noindex` + `Disallow: /`) |
| Production | `https://abravastudio.com` | `main` | yes |

Build variables: see `.env.example`. None are secrets. `PUBLIC_CF_ANALYTICS_TOKEN` enables Cloudflare Web
Analytics on production builds.

## One-time setup: connect Cloudflare (studio action)

1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → `dimitrijepejkic/abravastudio`.
2. Settings:
   - Worker name: `abravastudio` (must match `wrangler.jsonc`)
   - Production branch: `main`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (default)
   - Non-production branch builds: **enabled**, command `npx wrangler preview` (default). This gives a preview URL per branch.
   - Build variables (production): `PUBLIC_CF_ANALYTICS_TOKEN` = token from **Analytics & Logs → Web Analytics → Add site**
     (choose the "manual / JS snippet" option and copy only the token). Optional; leave unset for no analytics.
3. Push `site-v2` (needs approval: it's a public repo). Its build produces a **preview URL**. That is staging.
   Builds of the current `main` will fail (it has no `package.json`) and deploy nothing. That's expected until cutover.

## Release checklist (every production release)

- [ ] `npm run verify` passes locally (or CI is green on the PR)
- [ ] `npm run check:store-links` passes (store, privacy and community URLs are live)
- [ ] Preview URL reviewed on a phone and a desktop, in both languages
- [ ] No `PLACEHOLDER` content the studio wants visible (placeholders are hidden in production anyway)
- [ ] Lighthouse on the preview URL, results noted in SEO_CHECKLIST.md
- [ ] **Studio approval recorded** (who, when)
- [ ] Merge to `main` → Cloudflare builds and deploys production
- [ ] Post-deploy checks (below)

## Cutover runbook (one time; every step needs approval)

**Before you start:** in Cloudflare DNS, export or screenshot the current records for `abravastudio.com` and
`www` (they point to GitHub Pages). These are the rollback values.

1. **Deploy the new site as the Worker's production version** without touching DNS:
   ```sh
   npx wrangler login
   # PowerShell:  $env:PUBLIC_SITE_ENV='production'; npm run build
   # bash:        PUBLIC_SITE_ENV=production npm run build
   npx wrangler deploy
   ```
   Open the `abravastudio.<account>.workers.dev` URL and check that it works and `robots.txt` says `Allow: /`.
2. **Attach the domain:** Worker → Settings → Domains & Routes → Add → Custom domain → `abravastudio.com`.
   Cloudflare replaces the apex DNS record that pointed to GitHub Pages. **This is the DNS change.**
3. **www → apex:** Rules → Redirect Rules → "Redirect from WWW to root" template (301, preserve path and query).
   Make sure `www` has a proxied DNS record (it does today).
4. **Verify** (see the post-deploy checks below). Pay attention to `/app-ads.txt` byte-equality and the 301s.
5. **Merge `site-v2` into `main`.** Workers Builds now builds `main` (`WORKERS_CI_BRANCH=main` → production).
   Confirm that the deployment succeeded and the checks still pass.
6. **After a few days without issues:** delete `CNAME` from the repo, and disable GitHub Pages
   (repo Settings → Pages → Source: None).

### Post-deploy checks

```sh
curl -sI https://abravastudio.com/ | grep -iE "^HTTP|content-security-policy|strict-transport|x-content-type"
curl -s  https://abravastudio.com/robots.txt            # must contain "Allow: /" and the Sitemap line
curl -s  https://abravastudio.com/app-ads.txt           # google.com, pub-7347252425785032, DIRECT, f08c47fec0942fa0
curl -sI https://abravastudio.com/newsletter.html       # 301 → /
curl -sI https://abravastudio.com/unsubscribe.html      # 301 → /unsubscribe/
curl -sI https://abravastudio.com/does-not-exist/       # 404
curl -sI https://www.abravastudio.com/games/            # 301 → https://abravastudio.com/games/
curl -s  https://abravastudio.com/ | grep -o '<meta name="robots"[^>]*>'   # index, follow
```

### Rollback

- **Before step 5 (merge):** remove the custom domain from the Worker and restore the saved DNS records. `main`
  still holds the legacy site, so GitHub Pages serves it again within minutes.
- **After step 5:** also restore the legacy content on `main` without rewriting history:
  `git revert -m 1 <merge-commit>` and push (with approval), then restore the DNS records as above.
- **Bad production deploy after cutover:** Worker → Deployments → roll back to the previous version (instant),
  or revert the offending commit on `main`.

## Monitoring

- **Availability:** add a free uptime monitor (e.g. Cloudflare Health Checks on a paid plan, or UptimeRobot / Better
  Stack free tier) for `https://abravastudio.com/` and `/app-ads.txt`. Not set up yet: it needs an account the
  studio owns.
- **Errors:** static site, no server code. Watch Worker → Metrics for 4xx/5xx spikes, and Search Console →
  Pages for crawl errors.
- **Backups:** no persistent data. Git is the source of truth.

## Reproducing on another machine

```sh
git clone https://github.com/dimitrijepejkic/abravastudio.git && cd abravastudio
git checkout site-v2        # until merged
npm ci
npx playwright install chromium
npm run verify
```
