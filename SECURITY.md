# Security

The site is static: no server code, database, accounts, forms, file uploads or secrets. That removes most attack
surface. What remains is the integrity of what we serve and of the links we send people to.

## Measures in place

| Area | Measure | Where |
| --- | --- | --- |
| XSS | All content is static and escaped by Astro. JSON-LD is serialized with `<` escaped. No `set:html` from user input (there is none). | `src/components/JsonLd.astro` |
| CSP | `default-src 'self'`. Scripts from self plus the Cloudflare analytics beacon. No `'unsafe-inline'`: every script and stylesheet is an external same-origin file (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`). `frame-src` only `youtube-nocookie.com`, `frame-ancestors 'none'`, `form-action 'none'`, `object-src 'none'`. | `public/_headers`, `astro.config.mjs` |
| Transport | HSTS `max-age=31536000`. Cloudflare redirects HTTP → HTTPS. | `public/_headers` |
| Other headers | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (no camera, mic, geolocation, sensors, payment, USB), `Cross-Origin-Opener-Policy: same-origin`. The old `Access-Control-Allow-Origin: *` from GitHub Pages is gone. | `public/_headers` |
| Outbound links | Store URLs must match official listing patterns at build time (`src/lib/validation.ts`); invalid URLs fail the build. Live check before releases: `npm run check:store-links`. | content schema |
| Third parties | No third-party requests on page load (fonts and images self-hosted). YouTube loads only after a click, from `youtube-nocookie.com`. | |
| Secrets | None in the repo or the build. The analytics token is public by design. `.env*` files are git-ignored. | `.gitignore`, `.env.example` |
| Supply chain | Exact-pinned dependencies plus a lockfile. npm 11 `allowScripts` permits install scripts only for `esbuild` and `workerd`. `npm audit` reported 0 vulnerabilities at install (2026-10-27). | `package.json` |
| Indexing of non-production | Every non-production build is `noindex` and `Disallow: /`. Production must be explicit. | `src/config/site.ts` |

All of the above is covered by tests in `tests/e2e/platform.spec.ts` (headers, redirects, 404 status) and
`tests/unit/store.test.ts` (URL validation), except the npm audit.

## Known risks and follow-ups

1. **Old n8n webhook URL is public.** The pre-v2 `js/main.js` called a newsletter webhook on the studio's n8n
   instance. The code is removed, but the URL stays in git history. **Action for the studio:** disable or rotate
   that webhook in n8n if the newsletter stays off.
2. **HSTS without `includeSubDomains`/`preload`.** Not every subdomain could be confirmed HTTPS-capable. Once you are
   sure, change it to `max-age=63072000; includeSubDomains; preload` and submit to hstspreload.org. This is hard to undo.
3. **Production on `workers.dev`.** The Worker is also reachable on its `workers.dev` hostname (needed for preview
   URLs). Pages carry a canonical link to `abravastudio.com`, so search engines consolidate to the real domain.
4. **Content accuracy.** Store links and the game privacy policy live on third-party sites that can change. Run
   `npm run check:store-links` before every release.

## Reporting a vulnerability

Email info@abravastudio.com with the details. Please don't open a public issue for security problems.
