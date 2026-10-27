import { describe, expect, it } from 'vitest';
import { dictionaries, format, useTranslations } from '@/i18n/ui';

const tokens = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('UI dictionaries', () => {
  const en = dictionaries.en;
  const sr = dictionaries.sr;

  it('have exactly the same keys', () => {
    expect(Object.keys(sr).sort()).toEqual(Object.keys(en).sort());
  });

  it('have no empty strings', () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${locale}:${key}`).not.toBe('');
      }
    }
  });

  it('use the same {placeholders} in both languages', () => {
    for (const key of Object.keys(en) as Array<keyof typeof en>) {
      expect(tokens(sr[key]), key).toEqual(tokens(en[key]));
    }
  });

  it('keep official names untranslated', () => {
    expect(sr['home.lead']).toContain('Leap UP!');
    expect(sr['site.name']).toBe('Abrava Studio');
  });

  it('formats tokens and leaves unknown ones visible', () => {
    expect(format('{a} and {b}', { a: 1 })).toBe('1 and {b}');
    expect(useTranslations('sr')('games.view', { name: 'Leap UP!' })).toBe('Pogledajte Leap UP!');
  });
});
