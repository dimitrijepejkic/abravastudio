# Šta treba uraditi pre live verzije

Kratka lista koraka do objavljivanja novog sajta, redom. Tehnički detalji su u [DEPLOYMENT.md](DEPLOYMENT.md),
a odluke i otvorena pitanja u [TASKS.md](TASKS.md) i [DECISIONS.md](DECISIONS.md).

Stanje: **27. 10. 2026.** Kad nešto završiš, štikliraj `[x]` i dopiši datum.

## Gde smo stali

- Novi sajt je na grani **`site-v2`**: 2 commita, samo lokalno, **nije push-ovan**.
- Živi sajt (abravastudio.com, GitHub Pages sa grane `main`) **nije diran**.
- Tag za vraćanje na stari sajt: `legacy-gh-pages` (`6fa1d7e`). Za sada postoji samo lokalno.
- Sve automatske provere prolaze (`npm run verify`).

> ⚠️ **Ne spajaj (merge) `site-v2` u `main` pre prebacivanja DNS-a.** GitHub Pages objavljuje `main`, pa bi se
> živi sajt srušio.

---

## 1. Lokalni pregled (ti)

- [ ] `npm run preview` → http://127.0.0.1:8788. Prođi kroz sve stranice na oba jezika.
- [ ] Na telefonu: `npm run dev -- --host`, pa otvori „Network” adresu iz terminala.
- [ ] `npm run verify` mora da prođe bez grešaka.

## 2. Odluke i pregled sadržaja (ti)

- [ ] Tekstovi EN i SR, posebno slogan „Small studio. Big leaps.” i odeljak „How we work / Kako radimo”
      (`src/i18n/ui.ts`, `src/content/games/leap-up.yaml`)
- [ ] Boja „STUDIO” u logu: magenta (stari sajt) ili crna (PNG logo)?
- [ ] Srpski Google Play bedž: zvanični ćirilični (sada) ili engleski i na srpskim stranicama?
- [ ] Materijali za medije: odobriti slike za preuzimanje i napomenu o korišćenju
- [ ] Favicon: zeleno pikselizovano „A” iz loga

## 3. Podaci koji još fale (ti)

- [ ] Pravni naziv firme i adresa, za politiku privatnosti (`src/data/studio.ts` → `legalName`). Dok ih nema,
      taj deo se na živom sajtu ne prikazuje.
- [ ] (Kasnije) Godina osnivanja: namerno se ne objavljuje za sada.
- [ ] (Kasnije) Naziv nove igre, kad bude spreman. Sada piše „Novi projekat · U razvoju”.

## 4. Email (ti)

- [ ] Proveri da **contact@abravastudio.com** stvarno prima poštu: pošalji sebi test poruku
      (Namecheap email forwarding).

## 5. Push na GitHub (ja, uz tvoje odobrenje)

- [ ] Push grane `site-v2` i taga `legacy-gh-pages`. Ne utiče na živi sajt.

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

- [ ] U Cloudflare DNS-u **sačuvaj ili uslikaj** trenutne zapise za `abravastudio.com` i `www`. To je plan B
      za povratak na stari sajt.

## 9. Prelazak na novi sajt (zajedno, svaki korak uz odobrenje)

1. [ ] `npx wrangler login`, pa production build i `npx wrangler deploy`, pa provera na `workers.dev` adresi
2. [ ] Worker → Settings → Domains & Routes → **Custom domain** `abravastudio.com`. **Ovo je promena DNS-a.**
3. [ ] Rules → Redirect Rules → **www → bez www** (301)
4. [ ] Provere: zaglavlja, `robots.txt`, `app-ads.txt`, preusmerenja, 404 (komande su u DEPLOYMENT.md)
5. [ ] Merge `site-v2` → `main`. Cloudflare od tada sam objavljuje svaku izmenu na `main`.
6. [ ] Posle nekoliko dana bez problema: obriši `CNAME` iz repoa i ugasi GitHub Pages

**Povratak na stari sajt:** ukloni custom domain sa Worker-a i vrati sačuvane DNS zapise (detalji u DEPLOYMENT.md).

## 10. Posle lansiranja (ti)

- [ ] Google Search Console: pošalji `https://abravastudio.com/sitemap.xml`
- [ ] Uptime monitor (npr. UptimeRobot) za `https://abravastudio.com/` i `/app-ads.txt`
- [ ] Ugasi ili promeni stari n8n newsletter webhook (adresa mu je javna u git istoriji)
- [ ] (Opciono) Ukloni `abravastudio@gmail.com` sa Leap UP! stranice na Google Play-u ako ne treba da bude javan
- [ ] Na YouTube, TikTok i Discord profil dodaj link ka abravastudio.com
