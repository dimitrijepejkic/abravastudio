/**
 * Studio facts. Only verified information belongs here.
 *
 * `legalName` is still waiting for confirmed information from the studio: it renders as a visible
 * placeholder on staging and is omitted in production (see src/components/Placeholder.astro and TASKS.md).
 */
import type { Localized } from '@/i18n/locales';

export interface TeamMember {
  name: string;
  role: Localized;
}

export interface UpcomingProject {
  /** Generic until the studio announces the game's name. */
  title: Localized;
  status: Localized;
  teaser: Localized;
}

export const studio = {
  name: 'Abrava Studio',
  legalName: null as string | null,
  email: 'contact@abravastudio.com',
  country: { en: 'Serbia', sr: 'Srbija' } satisfies Localized,
  countryCode: 'RS',
  /** Intentionally not published yet (studio decision, 2026-10-27). Set a year to show it on the About page. */
  foundedYear: null as number | null,
  team: [
    { name: 'Dimitrije Pejkić', role: { en: 'Founder', sr: 'Osnivač' } },
    { name: 'Aleksa Dinić', role: { en: 'Co-founder', sr: 'Suosnivač' } },
  ] as TeamMember[],
  /** The next game is not named yet; keep this generic until it is announced. */
  upcoming: {
    title: { en: 'A new project', sr: 'Novi projekat' },
    status: { en: 'In development', sr: 'U razvoju' },
    teaser: {
      en: 'We’re already working on our next game. We’ll share more soon: follow us on Discord, YouTube, TikTok or Instagram to hear about it first.',
      sr: 'Već radimo na sledećoj igri. Uskoro ćemo otkriti više, a prvi ćete saznati ako nas pratite na Discordu, YouTube-u, TikToku ili Instagramu.',
    },
  } as UpcomingProject | null,
  social: {
    discord: 'https://discord.gg/Pe43a2wpKr',
    youtube: 'https://www.youtube.com/@AbravaStudio',
    tiktok: 'https://www.tiktok.com/@abravastudio',
    instagram: 'https://www.instagram.com/abravastudio/',
    googlePlayDeveloper: 'https://play.google.com/store/apps/dev?id=5315623981540393111',
  },
} as const;

/** Facts the studio still has to confirm; printed as a warning on production builds. */
export function missingStudioContent(): string[] {
  const missing: string[] = [];
  if (!studio.legalName) missing.push('studio.legalName (privacy policy: data controller)');
  if (studio.team.length === 0) missing.push('studio.team (about page)');
  if (!studio.upcoming) missing.push('studio.upcoming (home + about page teaser)');
  return missing;
}
