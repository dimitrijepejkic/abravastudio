# Project plan: abravastudio.com v2

## Goal

Replace the "under construction" page with a production-grade, bilingual (EN/SR) studio website that presents
Abrava Studio and its games, sends players to the official store listings, ranks well, and can grow with new
games, and later a product, without a rebuild.

## Scope

**In:** home, games list, game detail pages, about, contact (email), press kit, privacy policy, bilingual 404,
SEO (metadata, hreflang, sitemap, structured data), security headers, accessibility (WCAG 2.2 AA target),
performance, automated tests, CI, deployment and rollback docs.

**Out (for now):** contact form backend, newsletter, news/devlog, CMS, any SaaS functionality, iOS store links
(no iOS release exists).

## Phases

| # | Phase | Status |
| --- | --- | --- |
| 1 | Audit: repo, live site, hosting, assets, Leap UP! listing | ✅ Done (2026-10-27) |
| 2 | Architecture and design: stack, routing, content model, visual direction | ✅ Done |
| 3 | Core site: layout, design system, navigation, EN + SR | ✅ Done |
| 4 | Game portfolio: games list, Leap UP! page, store badges, gallery, trailer | ✅ Done |
| 5 | Studio sections: about, contact, press kit, privacy | ✅ Done (team, founding year, upcoming game and legal name pending from the studio) |
| 6 | SEO and performance: metadata, hreflang, sitemap, JSON-LD, OG images, Lighthouse | ✅ Done locally. Re-measure on preview |
| 7 | Security, privacy, accessibility: headers, CSP, axe, keyboard | ✅ Done |
| 8 | QA and staging: unit, e2e, links, Cloudflare preview | 🟡 Local QA done. Staging needs the Cloudflare connection (studio) |
| 9 | Production readiness: runbook, rollback, approval | 🟡 Runbook written. **Awaiting approval** |
| 10 | Handover | 🟡 In progress (this documentation) |

## Next steps

1. Studio reviews the copy (EN + SR), press kit items, and open questions in TASKS.md.
2. Studio approves pushing branch `site-v2` and connects the repo in Cloudflare (DEPLOYMENT.md, one-time setup).
3. Review on the preview URL, then Lighthouse on the preview.
4. Approve the cutover → runbook in DEPLOYMENT.md.
5. Post-launch: Search Console sitemap, uptime monitor, n8n webhook cleanup.
