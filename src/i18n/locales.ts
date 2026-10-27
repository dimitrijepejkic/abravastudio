export const locales = ['en', 'sr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** A string that exists in every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

export interface LocaleMeta {
  /** Value for <html lang> and hreflang. Serbian is served in Latin script. */
  lang: string;
  ogLocale: string;
  /** Name of the language in that language, for the switcher. */
  label: string;
  short: string;
  /** URL prefix; the default locale lives at the site root. */
  prefix: string;
  dateLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { lang: 'en', ogLocale: 'en_US', label: 'English', short: 'EN', prefix: '', dateLocale: 'en-GB' },
  sr: { lang: 'sr-Latn', ogLocale: 'sr_RS', label: 'Srpski', short: 'SR', prefix: '/sr', dateLocale: 'sr-Latn-RS' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
