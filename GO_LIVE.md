# Šta treba uraditi pre live verzije

Kratka lista koraka do objavljivanja novog sajta, redom. Tehnički detalji su u [DEPLOYMENT.md](DEPLOYMENT.md),
a odluke i otvorena pitanja u [TASKS.md](TASKS.md) i [DECISIONS.md](DECISIONS.md).

Stanje: **29. 10. 2026. — sajt je live na Cloudflare-u.** Kad nešto završiš, štikliraj `[x]` i dopiši datum.

## Gde smo stali

- Novi sajt je na grani **`site-v2`**, push-ovan na GitHub (29.10.).
- Živi sajt (abravastudio.com, GitHub Pages sa grane `main`) **nije diran**.
- Tag za vraćanje na stari sajt: `legacy-gh-pages` (`6fa1d7e`), push-ovan na GitHub.
- Sve automatske provere prolaze (`npm run verify`).

> ⚠️ **Ne spajaj (merge) `site-v2` u `main` pre prebacivanja DNS-a.** GitHub Pages objavljuje `main`, pa bi se
> živi sajt srušio.

---

## 1. Lokalni pregled (ti)

- [x] `npm run preview` → http://127.0.0.1:8788. Prođi kroz sve stranice na oba jezika. (29.10.)
- [ ] Na telefonu: `npm run dev -- --host`, pa otvori „Network” adresu iz terminala.
- [x] `npm run verify` mora da prođe bez grešaka. (29.10.)

## 2. Odluke i pregled sadržaja (ti)

Odobreno 29.10.2026 posle pregleda preview-a („sve izgleda dobro”): ostaju trenutna rešenja.

- [x] Tekstovi EN i SR, posebno slogan „Small studio. Big leaps.” i odeljak „How we work / Kako radimo”
      (`src/i18n/ui.ts`, `src/content/games/leap-up.yaml`)
- [x] Boja „STUDIO” u logu: magenta (stari sajt) ili crna (PNG logo)?
- [x] Srpski Google Play bedž: zvanični ćirilični (sada) ili engleski i na srpskim stranicama?
- [x] Materijali za medije: odobriti slike za preuzimanje i napomenu o korišćenju
- [x] Favicon: zeleno pikselizovano „A” iz loga

## 3. Podaci koji još fale (ti)

- [ ] Pravni naziv firme i adresa, za politiku privatnosti (`src/data/studio.ts` → `legalName`). Dok ih nema,
      taj deo se na živom sajtu ne prikazuje.
- [ ] (Kasnije) Godina osnivanja: namerno se ne objavljuje za sada.
- [ ] (Kasnije) Naziv nove igre, kad bude spreman. Sada piše „Novi projekat · U razvoju”.

## 4. Email (ti)

- [x] Proveri da **contact@abravastudio.com** stvarno prima poštu: pošalji sebi test poruku
      (Namecheap email forwarding). Potvrđeno 29.10.2026: i `contact@` i `info@` prosleđuju poštu.

## 5. Push na GitHub (ja, uz tvoje odobrenje)

- [x] Push grane `site-v2` i taga `legacy-gh-pages`. Ne utiče na živi sajt. (29.10.)

## 6. Cloudflare: jednokratno podešavanje (ti, u dashboard-u)

- [ ] **Workers & Pages → Create → Import a repository** → `dimitrijepejkic/abravastudio`
  - Worker name: `abravastudio`
  - Production branch: `main`
  - Build command: `npm run build`
  - Deploy command: `npx wrangler deploy`
  - Non-production branch builds: **uključeno** (`npx wrangler preview`)
- [ ] (Opciono) **Analytics & Logs → Web Analytics → Add site**, pa token upiši kao build varijablu
      `PUBLIC_CF_ANALYTICS_TOKEN`
- [ ] Posle toga `site-v2` dobija **preview link** (test verzija koju Google ne indeksira).
      Build grane `main` će pasti dok se ne uradi prelazak. To je očekivano.

## 7. Pregled test verzije (ti + ja)

- [ ] Preview link na telefonu i računaru, oba jezika
- [ ] Lighthouse merenje na preview linku (ja), rezultati u SEO_CHECKLIST.md

## 8. Pre prelaska (ti)

- [x] U Cloudflare DNS-u **sačuvaj ili uslikaj** trenutne zapise za `abravastudio.com` i `www`. To je plan B
      za povratak na stari sajt. Sačuvano 29.10.2026 (GitHub Pages):
      - `abravastudio.com` A → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (Proxied)
      - `www` CNAME → `abravastudio.com` (Proxied)
      - Ne dirati: MX `eforward1–5.registrar-servers.com` (email), TXT `google-site-verification=…`,
        TXT `v=spf1 include:spf.efwd.registrar-servers.com ~all`

## 9. Prelazak na novi sajt (zajedno, svaki korak uz odobrenje)

1. [x] `npx wrangler login`, pa production build i `npx wrangler deploy`, pa provera na `workers.dev` adresi
      (29.10.: deploy je uradio Cloudflare build posle merge-a u `main`)
2. [x] Worker → Settings → Domains & Routes → **Custom domain** `abravastudio.com`. **Ovo je promena DNS-a.** (29.10.: obrisana 4 GitHub Pages A zapisa, domen dodat)
3. [x] Rules → Redirect Rules → **www → bez www** (301). 29.10.: wildcard `https://www.abravastudio.com/*` → `https://abravastudio.com/${1}`
4. [x] Provere: zaglavlja, `robots.txt`, `app-ads.txt`, preusmerenja, 404 (komande su u DEPLOYMENT.md). 29.10.: sve prolazi, `app-ads.txt` bajt-identičan
5. [x] Merge `site-v2` → `main` (29.10., PR #1; urađen pre koraka 2, pa je sajt nekoliko minuta bio pokvaren). Cloudflare od tada sam objavljuje svaku izmenu na `main`.
6. [ ] Posle nekoliko dana bez problema: obriši `CNAME` iz repoa i ugasi GitHub Pages

**Povratak na stari sajt:** ukloni custom domain sa Worker-a i vrati sačuvane DNS zapise (detalji u DEPLOYMENT.md).

## 10. Posle lansiranja (ti)

- [x] Google Search Console: pošalji `https://abravastudio.com/sitemap.xml` (29.10.; sitemap i robots.txt provereni:
      14 adresa, sve 200, kanonski linkovi i hreflang ispravni)
- [x] AI botovi: Cloudflare blokada isključena 29.10. (odluka studija), robots.txt je sada samo naš `Allow: /` + sitemap
- [x] Uptime monitor (UptimeRobot) za `https://abravastudio.com/` i `/app-ads.txt` (keyword `pub-7347252425785032`), 29.10.
- [ ] Ugasi ili promeni stari n8n newsletter webhook (adresa mu je javna u git istoriji):
      (puna adresa: `git show legacy-gh-pages:js/main.js`; namerno nije upisana ovde)
      1. Uloguj se na svoj n8n (Hostinger VPS) → **Workflows**
      2. Nađi workflow čiji **Webhook** čvor ima Path koji počinje sa `06be8f69`, i eventualni
         **unsubscribe** workflow (path `unsubscribe`)
      3. Isključi **Active** (ili **Unpublish**) na oba
      4. Prikupljene mejl adrese (Sheets/baza/Brevo…): izvezi ako planiraš newsletter, inače obriši
      5. Javi, pa proveravam spolja da webhook više ne odgovara
      Ako se newsletter vraća: novi nasumičan Path + zaštita od spama, i odluka u DECISIONS.md.
- [ ] (Opciono) Ukloni `abravastudio@gmail.com` sa Leap UP! stranice na Google Play-u ako ne treba da bude javan.
      29.10.: listing ga i dalje prikazuje u „About the developer” (uz ime i adresu). To su podaci developer naloga:
      Play Console → Settings → Developer account → Account details → Contact details. Promena može da čeka Google proveru.
- [x] Na YouTube, TikTok i Discord profil dodaj link ka abravastudio.com (29.10., uradio studio)
