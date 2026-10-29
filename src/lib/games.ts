import { getCollection, type CollectionEntry } from 'astro:content';
import type { StorePlatform } from './store';

export type Game = CollectionEntry<'games'>;

export async function getGames(): Promise<Game[]> {
  const games = await getCollection('games');
  return games.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getGameSlugs(): Promise<string[]> {
  return (await getGames()).map((game) => game.id);
}

export interface StoreTarget {
  platform: StorePlatform;
  url: string;
}

/** Store links that may be shown as active download buttons: available AND verified URL. */
export function availableStores(game: Game): StoreTarget[] {
  const targets: StoreTarget[] = [];
  const { android, ios } = game.data.platforms;
  if (android?.status === 'available' && android.url) targets.push({ platform: 'android', url: android.url });
  if (ios?.status === 'available' && ios.url) targets.push({ platform: 'ios', url: ios.url });
  return targets;
}

export const platformNames: Record<StorePlatform, string> = { android: 'Android', ios: 'iOS' };

/** Platforms the game is on or announced for, in display order. */
export function listedPlatforms(game: Game): StorePlatform[] {
  return (['android', 'ios'] as const).filter((p) => game.data.platforms[p] !== undefined);
}
