import { describe, expect, it } from 'vitest';
import { storeLink, UTM_SOURCE } from '@/lib/store';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/validation';

const PLAY = 'https://play.google.com/store/apps/details?id=com.leapup';

describe('store links', () => {
  it('adds Play Console UTM parameters per placement', () => {
    const url = new URL(storeLink('android', PLAY, 'game-page'));
    expect(url.origin + url.pathname).toBe('https://play.google.com/store/apps/details');
    expect(url.searchParams.get('id')).toBe('com.leapup');
    expect(url.searchParams.get('utm_source')).toBe(UTM_SOURCE);
    expect(url.searchParams.get('utm_medium')).toBe('website');
    expect(url.searchParams.get('utm_campaign')).toBe('game-page');
  });

  it('leaves App Store links untouched', () => {
    const ios = 'https://apps.apple.com/us/app/example-game/id123456789';
    expect(storeLink('ios', ios, 'home-hero')).toBe(ios);
  });
});

describe('store URL validation', () => {
  it('accepts official listing URLs', () => {
    expect(GOOGLE_PLAY_URL.test(PLAY)).toBe(true);
    expect(APP_STORE_URL.test('https://apps.apple.com/us/app/example-game/id123456789')).toBe(true);
  });

  it.each([
    'http://play.google.com/store/apps/details?id=com.leapup',
    'https://play.google.com/store/apps/details?id=com.leapup&pcampaignid=web_share',
    'https://play.google.com.evil.example/store/apps/details?id=com.leapup',
    'https://play.google.com/store/apps/details?id=leapup',
    'https://play.google.com',
  ])('rejects %s', (url) => {
    expect(GOOGLE_PLAY_URL.test(url)).toBe(false);
  });

  it('rejects non-Apple App Store URLs', () => {
    expect(APP_STORE_URL.test('https://apps.apple.com.evil.example/us/app/x/id1')).toBe(false);
    expect(APP_STORE_URL.test('https://itunes.apple.com/app/id123')).toBe(false);
  });
});
