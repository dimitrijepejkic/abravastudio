/**
 * Outbound store links.
 *
 * Base URLs live in the game content files and are validated there. Here we only append
 * UTM parameters so installs from this site show up per placement in the Play Console
 * acquisition reports ("UTM source" / "UTM campaign" dimensions).
 */
export type StorePlatform = 'android' | 'ios';

/** Where on the site the link was clicked, e.g. `home-hero`, `game-page`. */
export type StorePlacement = 'home-hero' | 'home-featured' | 'games-list' | 'game-page' | 'press';

export const UTM_SOURCE = 'abravastudio.com';

export function storeLink(platform: StorePlatform, baseUrl: string, placement: StorePlacement): string {
  const url = new URL(baseUrl);
  if (platform === 'android') {
    url.searchParams.set('utm_source', UTM_SOURCE);
    url.searchParams.set('utm_medium', 'website');
    url.searchParams.set('utm_campaign', placement);
  }
  // App Store campaign links use App Store Connect provider tokens, which the studio
  // does not have yet; iOS links stay untouched rather than carry made-up parameters.
  return url.toString();
}
