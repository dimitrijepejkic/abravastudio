/**
 * Studio facts. Only verified information belongs here.
 *
 * Fields set to `null` / empty are waiting for confirmed information from the studio.
 * They render as visible placeholders on staging and are omitted in production
 * (see src/components/Placeholder.astro and TASKS.md).
 */
import type { Localized } from '@/i18n/locales';

export interface TeamMember {
  name: string;
  role: Localized;
}

export interface UpcomingProject {
  title: string;
  status: Localized;
  teaser: Localized;
}

export const studio = {
  name: 'Abrava Studio',
  legalName: null as string | null,
  email: 'info@abravastudio.com',
  country: { en: 'Serbia', sr: 'Srbija' } satisfies Localized,
  countryCode: 'RS',
  foundedYear: null as number | null,
  team: [] as TeamMember[],
  upcoming: null as UpcomingProject | null,
  social: {
    discord: 'https://discord.gg/Pe43a2wpKr',
    youtube: 'https://www.youtube.com/@AbravaStudio',
    googlePlayDeveloper: 'https://play.google.com/store/apps/dev?id=5315623981540393111',
  },
} as const;

/** Facts the studio still has to confirm; printed as a warning on production builds. */
export function missingStudioContent(): string[] {
  const missing: string[] = [];
  if (!studio.legalName) missing.push('studio.legalName (privacy policy: data controller)');
  if (!studio.foundedYear) missing.push('studio.foundedYear (about page)');
  if (studio.team.length === 0) missing.push('studio.team (about page)');
  if (!studio.upcoming) missing.push('studio.upcoming (home + about page teaser)');
  return missing;
}
