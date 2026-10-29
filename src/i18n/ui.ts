/**
 * Interface copy for both locales.
 *
 * `sr` is typed against `en`, so a missing or extra key is a type error (`npm run check`).
 * Strings may contain `{name}` tokens, filled in by `format()`.
 * Keep copy factual: no invented history, numbers, awards or claims (see AGENTS.md).
 */
import type { Locale } from './locales';

const en = {
  'site.name': 'Abrava Studio',
  'a11y.skip': 'Skip to content',
  'placeholder.label': 'Placeholder, shown on staging only',

  'nav.label': 'Main',
  'nav.home': 'Home',
  'nav.games': 'Games',
  'nav.about': 'About',
  'nav.press': 'Press',
  'nav.contact': 'Contact',
  'nav.privacy': 'Privacy',
  'nav.menu': 'Menu',
  'nav.language': 'Language',
  'nav.switchTo': 'Read this page in English',

  'store.googlePlay': 'Get it on Google Play',
  'store.appStore': 'Download on the App Store',

  'status.available': 'Out now',
  'status.coming-soon': 'Coming soon',
  'status.in-development': 'In development',
  'status.unavailable': 'Currently unavailable',

  'home.seo.title': 'Abrava Studio: independent mobile game studio',
  'home.seo.description':
    'Abrava Studio is an independent game studio from Serbia making pixel-art mobile games. Play Leap UP: Pixel Jump Game, out now on Google Play.',
  'home.eyebrow': 'Independent mobile game studio · Serbia',
  'home.tagline': 'Small studio. Big leaps.',
  'home.lead':
    'We’re an independent studio from Serbia making pixel-art games for your phone. Our first game, Leap UP: Pixel Jump Game, is out now on Google Play.',
  'home.cta.games': 'Explore our games',
  'home.featured.eyebrow': 'Featured game',
  'home.featured.more': 'About the game',
  'home.studio.heading': 'From Serbia, straight to your pocket',
  'home.studio.text':
    'Abrava Studio is an independent team making mobile games with pixel art and simple, tactile controls. Leap UP: Pixel Jump Game is our first release, and we’re already working on what comes next.',
  'home.studio.more': 'More about the studio',
  'home.community.heading': 'Join the community',
  'home.community.text':
    'Chat with us and other players on Discord, and follow along on YouTube and TikTok.',
  'home.community.discord': 'Join our Discord',
  'home.community.youtube': 'Watch on YouTube',
  'home.community.tiktok': 'Follow on TikTok',
  'home.upcoming.heading': 'Coming next',
  'home.contact.heading': 'Let’s make something together',
  'home.contact.text':
    'Publishing, partnerships, press or player support: write to us and we’ll get back to you.',
  'home.contact.cta': 'Contact us',

  'games.seo.title': 'Games | Abrava Studio',
  'games.seo.description':
    'All games by Abrava Studio, with platforms, release status and official download links.',
  'games.heading': 'Our games',
  'games.intro': 'Every game we’ve released or announced, with where to get it.',
  'games.view': 'View {name}',

  'game.breadcrumb': 'Breadcrumb',
  'game.facts': 'At a glance',
  'game.genre': 'Genre',
  'game.platforms': 'Platforms',
  'game.status': 'Status',
  'game.rating': 'Age rating',
  'game.studio': 'Studio',
  'game.about': 'About the game',
  'game.features': 'What’s inside',
  'game.screenshots': 'Screenshots',
  'game.screenshotOpen': 'Open screenshot {n} of {total}',
  'game.gallery.close': 'Close',
  'game.gallery.previous': 'Previous screenshot',
  'game.gallery.next': 'Next screenshot',
  'game.gallery.counter': '{n} / {total}',
  'game.trailer': 'Trailer',
  'game.trailer.play': 'Play video: {title}',
  'game.trailer.note': 'The video loads from YouTube (youtube-nocookie.com) only after you press play.',
  'game.support': 'Support & privacy',
  'game.support.text': 'Found a bug or have an idea? Email us or join our Discord.',
  'game.support.email': 'Email player support',
  'game.privacyPolicy': '{name} privacy policy',
  'game.related': 'More games from Abrava Studio',
  'game.notReleased': 'Not released yet. Store links will appear here once the game is live.',

  'about.seo.title': 'About | Abrava Studio',
  'about.seo.description':
    'Who we are and what we make: Abrava Studio is an independent mobile game studio from Serbia.',
  'about.heading': 'About the studio',
  'about.intro':
    'Abrava Studio is an independent game studio from Serbia. We make mobile games with pixel art and simple, tactile controls.',
  'about.make.heading': 'What we make',
  'about.make.text':
    'Short-session games you can play in a spare minute, then come back to for one more try. Our first release is Leap UP: Pixel Jump Game, an endless vertical jumper. Tilt your phone, bounce from platform to platform and see how high you can climb.',
  'about.work.heading': 'How we work',
  'about.work.text':
    'We’re a small team, so we keep each game focused on one core idea and build it step by step. We share progress and hear from players in our Discord community and on YouTube.',
  'about.facts.heading': 'Studio facts',
  'about.facts.based': 'Based in',
  'about.facts.founded': 'Founded',
  'about.facts.games': 'Released games',
  'about.facts.platforms': 'Platforms',
  'about.facts.contact': 'Contact',
  'about.team.heading': 'The team',
  'about.upcoming.heading': 'What’s next',

  'contact.seo.title': 'Contact | Abrava Studio',
  'contact.seo.description':
    'Get in touch with Abrava Studio about publishing, partnerships, press or player support.',
  'contact.heading': 'Contact',
  'contact.intro':
    'Email is the quickest way to reach us. Pick a topic and your email app will open with the subject already filled in.',
  'contact.business.title': 'Business & publishing',
  'contact.business.text': 'Publishing deals, licensing and other business inquiries.',
  'contact.business.subject': 'Business inquiry',
  'contact.partnership.title': 'Partnerships & collaborations',
  'contact.partnership.text': 'Co-development, cross-promotion, events and creative collaborations.',
  'contact.partnership.subject': 'Partnership',
  'contact.press.title': 'Press & media',
  'contact.press.text': 'Interviews, reviews and coverage. Official images are in our press kit.',
  'contact.press.subject': 'Press inquiry',
  'contact.support.title': 'Player support & feedback',
  'contact.support.text': 'Bugs, questions or ideas about one of our games.',
  'contact.support.subject': 'Player support',
  'contact.emailCta': 'Email us',
  'contact.direct': 'Or write directly to',
  'contact.pressKit': 'Open the press kit',
  'contact.community.heading': 'Prefer to chat?',
  'contact.community.text': 'Our Discord server is the best place for quick questions and game feedback.',

  'press.seo.title': 'Press kit | Abrava Studio',
  'press.seo.description':
    'Press kit for Abrava Studio and Leap UP: Pixel Jump Game, with studio facts, game descriptions, logo, icon, key art and screenshots.',
  'press.heading': 'Press kit',
  'press.intro':
    'Facts, descriptions and official images for writing about Abrava Studio and our games. For interviews or anything not covered here, email us.',
  'press.studio.heading': 'Studio fact sheet',
  'press.studio.name': 'Studio',
  'press.studio.founders': 'Founders',
  'press.studio.website': 'Website',
  'press.studio.email': 'Press contact',
  'press.studio.social': 'Community',
  'press.boilerplate.heading': 'About Abrava Studio',
  'press.boilerplate.text':
    'Abrava Studio is an independent game studio from Serbia that makes mobile games with pixel art and simple, tactile controls. Its first game, Leap UP: Pixel Jump Game, is available on Google Play.',
  'press.game.heading': '{name} fact sheet',
  'press.game.store': 'Store page',
  'press.downloads.heading': 'Downloads',
  'press.downloads.logo': 'Abrava Studio logo',
  'press.downloads.icon': '{name} icon',
  'press.downloads.keyart': '{name} key art',
  'press.downloads.screenshot': '{name} screenshot {n}',
  'press.downloads.action': 'Download',
  'press.usage':
    'You’re welcome to use these materials when writing about Abrava Studio and our games. Please don’t alter the logo.',

  'privacy.seo.title': 'Privacy policy | Abrava Studio',
  'privacy.seo.description':
    'How abravastudio.com handles your data: no cookies, privacy-friendly analytics, and what happens when you email us.',
  'privacy.heading': 'Privacy policy',
  'privacy.updated': 'Last updated: {date}',

  'footer.tagline': 'Independent mobile games from Serbia.',
  'footer.explore': 'Explore',
  'footer.community': 'Community',
  'footer.legal': 'Legal',
  'footer.copyright': '© {year} Abrava Studio',

  'notFound.title': 'Page not found',
  'notFound.text': 'This page took a leap we can’t follow. Try the home page or our games instead.',
} as const;

export type UiKey = keyof typeof en;
export type Dictionary = Record<UiKey, string>;

const sr: Dictionary = {
  'site.name': 'Abrava Studio',
  'a11y.skip': 'Preskoči na sadržaj',
  'placeholder.label': 'Privremeni sadržaj, vidljiv samo na test okruženju',

  'nav.label': 'Glavni meni',
  'nav.home': 'Početna',
  'nav.games': 'Igre',
  'nav.about': 'O nama',
  'nav.press': 'Za medije',
  'nav.contact': 'Kontakt',
  'nav.privacy': 'Privatnost',
  'nav.menu': 'Meni',
  'nav.language': 'Jezik',
  'nav.switchTo': 'Pročitajte ovu stranicu na srpskom',

  'store.googlePlay': 'Nabavite na Google Play-u',
  'store.appStore': 'Preuzmite na App Store-u',

  'status.available': 'Dostupno',
  'status.coming-soon': 'Uskoro',
  'status.in-development': 'U razvoju',
  'status.unavailable': 'Trenutno nedostupno',

  'home.seo.title': 'Abrava Studio: nezavisni studio za mobilne igre',
  'home.seo.description':
    'Abrava Studio je nezavisni studio iz Srbije koji pravi piksel-art igre za mobilne telefone. Igrajte Leap UP: Pixel Jump Game, dostupnu na Google Play-u.',
  'home.eyebrow': 'Nezavisni studio za mobilne igre · Srbija',
  'home.tagline': 'Mali studio. Veliki skokovi.',
  'home.lead':
    'Mi smo nezavisni studio iz Srbije i pravimo piksel-art igre za mobilne telefone. Naša prva igra, Leap UP: Pixel Jump Game, već je dostupna na Google Play-u.',
  'home.cta.games': 'Pogledajte naše igre',
  'home.featured.eyebrow': 'Izdvajamo',
  'home.featured.more': 'Više o igri',
  'home.studio.heading': 'Iz Srbije, pravo u vaš džep',
  'home.studio.text':
    'Abrava Studio je nezavisni tim koji pravi igre za mobilne telefone sa piksel-art grafikom i jednostavnim kontrolama. Leap UP: Pixel Jump Game je naše prvo izdanje, a već radimo na sledećem.',
  'home.studio.more': 'Više o studiju',
  'home.community.heading': 'Pridružite se zajednici',
  'home.community.text':
    'Družite se sa nama i drugim igračima na Discordu, a novosti pratite na YouTube-u i TikToku.',
  'home.community.discord': 'Pridružite se na Discordu',
  'home.community.youtube': 'Gledajte na YouTube-u',
  'home.community.tiktok': 'Pratite nas na TikToku',
  'home.upcoming.heading': 'Uskoro',
  'home.contact.heading': 'Hajde da sarađujemo',
  'home.contact.text':
    'Izdavaštvo, saradnja, mediji ili podrška za igrače: pišite nam i javićemo vam se.',
  'home.contact.cta': 'Kontaktirajte nas',

  'games.seo.title': 'Igre | Abrava Studio',
  'games.seo.description':
    'Sve igre studija Abrava Studio, sa platformama, statusom izdanja i zvaničnim linkovima za preuzimanje.',
  'games.heading': 'Naše igre',
  'games.intro': 'Sve igre koje smo objavili ili najavili, i gde možete da ih nabavite.',
  'games.view': 'Pogledajte {name}',

  'game.breadcrumb': 'Putanja',
  'game.facts': 'Ukratko',
  'game.genre': 'Žanr',
  'game.platforms': 'Platforme',
  'game.status': 'Status',
  'game.rating': 'Uzrasna oznaka',
  'game.studio': 'Studio',
  'game.about': 'O igri',
  'game.features': 'Šta vas čeka',
  'game.screenshots': 'Snimci ekrana',
  'game.screenshotOpen': 'Otvori snimak ekrana {n} od {total}',
  'game.gallery.close': 'Zatvori',
  'game.gallery.previous': 'Prethodni snimak ekrana',
  'game.gallery.next': 'Sledeći snimak ekrana',
  'game.gallery.counter': '{n} / {total}',
  'game.trailer': 'Trejler',
  'game.trailer.play': 'Pusti video: {title}',
  'game.trailer.note': 'Video se učitava sa YouTube-a (youtube-nocookie.com) tek kada ga pokrenete.',
  'game.support': 'Podrška i privatnost',
  'game.support.text': 'Pronašli ste grešku ili imate ideju? Pišite nam ili nam se pridružite na Discordu.',
  'game.support.email': 'Pišite podršci za igrače',
  'game.privacyPolicy': 'Politika privatnosti igre {name}',
  'game.related': 'Još igara studija Abrava Studio',
  'game.notReleased': 'Igra još nije objavljena. Linkovi ka prodavnicama pojaviće se ovde kada izađe.',

  'about.seo.title': 'O nama | Abrava Studio',
  'about.seo.description':
    'Ko smo i šta pravimo: Abrava Studio je nezavisni studio za mobilne igre iz Srbije.',
  'about.heading': 'O studiju',
  'about.intro':
    'Abrava Studio je nezavisni studio za razvoj igara iz Srbije. Pravimo igre za mobilne telefone sa piksel-art grafikom i jednostavnim kontrolama.',
  'about.make.heading': 'Šta pravimo',
  'about.make.text':
    'Igre za kratke pauze: igrate ih kada imate minut, a onda se vraćate na još jedan pokušaj. Naše prvo izdanje je Leap UP: Pixel Jump Game, igra beskrajnog skakanja nagore. Nagnite telefon, skačite s platforme na platformu i proverite koliko visoko možete da stignete.',
  'about.work.heading': 'Kako radimo',
  'about.work.text':
    'Mali smo tim, pa svaku igru gradimo oko jedne osnovne ideje, korak po korak. Napredak delimo sa igračima i slušamo njihove utiske u našoj Discord zajednici i na YouTube-u.',
  'about.facts.heading': 'Osnovni podaci',
  'about.facts.based': 'Sedište',
  'about.facts.founded': 'Osnovan',
  'about.facts.games': 'Objavljene igre',
  'about.facts.platforms': 'Platforme',
  'about.facts.contact': 'Kontakt',
  'about.team.heading': 'Tim',
  'about.upcoming.heading': 'Šta sledi',

  'contact.seo.title': 'Kontakt | Abrava Studio',
  'contact.seo.description':
    'Kontaktirajte Abrava Studio u vezi sa izdavaštvom, saradnjom, medijima ili podrškom za igrače.',
  'contact.heading': 'Kontakt',
  'contact.intro':
    'Najbrže ćete nas dobiti putem e-pošte. Izaberite temu i vaš program za e-poštu otvoriće se sa već popunjenim naslovom poruke.',
  'contact.business.title': 'Poslovna saradnja i izdavaštvo',
  'contact.business.text': 'Ponude za izdavanje, licenciranje i drugi poslovni upiti.',
  'contact.business.subject': 'Poslovni upit',
  'contact.partnership.title': 'Partnerstva i saradnje',
  'contact.partnership.text': 'Zajednički razvoj, uzajamna promocija, događaji i kreativne saradnje.',
  'contact.partnership.subject': 'Saradnja',
  'contact.press.title': 'Mediji',
  'contact.press.text': 'Intervjui, recenzije i medijski prilozi. Zvanične slike su na stranici za medije.',
  'contact.press.subject': 'Upit medija',
  'contact.support.title': 'Podrška i utisci igrača',
  'contact.support.text': 'Greške, pitanja ili ideje u vezi sa nekom od naših igara.',
  'contact.support.subject': 'Podrška za igrače',
  'contact.emailCta': 'Pišite nam',
  'contact.direct': 'Ili pišite direktno na',
  'contact.pressKit': 'Otvorite materijale za medije',
  'contact.community.heading': 'Više volite ćaskanje?',
  'contact.community.text': 'Naš Discord server je najbolje mesto za brza pitanja i utiske o igrama.',

  'press.seo.title': 'Za medije | Abrava Studio',
  'press.seo.description':
    'Materijali za medije o studiju Abrava Studio i igri Leap UP: Pixel Jump Game, sa osnovnim podacima, opisima, logom, ikonicom, ključnom ilustracijom i snimcima ekrana.',
  'press.heading': 'Za medije',
  'press.intro':
    'Osnovni podaci, opisi i zvanične slike za pisanje o studiju Abrava Studio i našim igrama. Za intervjue i sve što ovde ne pronađete, pišite nam.',
  'press.studio.heading': 'Osnovni podaci o studiju',
  'press.studio.name': 'Studio',
  'press.studio.founders': 'Osnivači',
  'press.studio.website': 'Sajt',
  'press.studio.email': 'Kontakt za medije',
  'press.studio.social': 'Zajednica',
  'press.boilerplate.heading': 'O studiju Abrava Studio',
  'press.boilerplate.text':
    'Abrava Studio je nezavisni studio za razvoj igara iz Srbije koji pravi igre za mobilne telefone sa piksel-art grafikom i jednostavnim kontrolama. Njegova prva igra, Leap UP: Pixel Jump Game, dostupna je na Google Play-u.',
  'press.game.heading': 'Osnovni podaci: {name}',
  'press.game.store': 'Stranica u prodavnici',
  'press.downloads.heading': 'Preuzimanje',
  'press.downloads.logo': 'Logo studija Abrava Studio',
  'press.downloads.icon': 'Ikonica igre {name}',
  'press.downloads.keyart': 'Ključna ilustracija igre {name}',
  'press.downloads.screenshot': '{name}, snimak ekrana {n}',
  'press.downloads.action': 'Preuzmi',
  'press.usage':
    'Slobodno koristite ove materijale kada pišete o studiju Abrava Studio i našim igrama. Molimo vas da ne menjate logo.',

  'privacy.seo.title': 'Politika privatnosti | Abrava Studio',
  'privacy.seo.description':
    'Kako abravastudio.com postupa sa vašim podacima: bez kolačića, analitika koja poštuje privatnost i šta se dešava kada nam pišete.',
  'privacy.heading': 'Politika privatnosti',
  'privacy.updated': 'Poslednja izmena: {date}',

  'footer.tagline': 'Nezavisne mobilne igre iz Srbije.',
  'footer.explore': 'Istražite',
  'footer.community': 'Zajednica',
  'footer.legal': 'Pravne informacije',
  'footer.copyright': '© {year} Abrava Studio',

  'notFound.title': 'Stranica nije pronađena',
  'notFound.text':
    'Ova stranica je skočila tamo gde ne možemo da je pratimo. Probajte početnu stranicu ili naše igre.',
};

export const dictionaries: Record<Locale, Dictionary> = { en, sr };

export function format(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

/** Returns a translator bound to one locale: `t('nav.games')`, `t('games.view', { name })`. */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return (key: UiKey, values?: Record<string, string | number>) => format(dict[key], values);
}
