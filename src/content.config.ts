import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from './lib/validation';

const localized = z.object({ en: z.string().min(1), sr: z.string().min(1) });
const localizedParagraphs = z.object({ en: z.array(z.string().min(1)).min(1), sr: z.array(z.string().min(1)).min(1) });

const platformStatus = z.enum(['available', 'coming-soon', 'unavailable']);

/**
 * Store URLs must match the official listing formats (src/lib/validation.ts), so a typo can't ship
 * as a broken or foreign link. A platform marked `available` must have its verified store URL.
 */
const platform = (url: z.ZodString) =>
  z
    .object({ status: platformStatus, url: url.optional() })
    .refine((p) => p.status !== 'available' || p.url, { message: 'An available platform needs a store URL' });

const games = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/games' }),
  schema: ({ image }) =>
    z.object({
      /** Official in-game title, preserved exactly in every language. */
      name: z.string().min(1),
      /** Title as listed in the stores, if it differs. */
      storeTitle: z.string().optional(),
      status: z.enum(['in-development', 'coming-soon', 'available', 'unavailable']),
      featured: z.boolean().default(false),
      order: z.number().int().default(100),
      genre: localized,
      tagline: localized,
      summary: localized,
      description: localizedParagraphs,
      features: z.array(z.object({ title: localized, text: localized })).default([]),
      platforms: z.object({
        android: platform(z.string().regex(GOOGLE_PLAY_URL)).optional(),
        ios: platform(z.string().regex(APP_STORE_URL)).optional(),
      }),
      contentRating: z.string().optional(),
      icon: image(),
      keyArt: image(),
      keyArtAlt: localized,
      /** Portrait screenshots; `featured: true` marks the one shown on the home page. */
      screenshots: z
        .array(z.object({ src: image(), alt: localized, featured: z.boolean().default(false) }))
        .default([]),
      trailer: z
        .object({ youtubeId: z.string().regex(/^[\w-]{11}$/), title: z.string(), poster: image() })
        .optional(),
      links: z
        .object({ privacyPolicy: z.url().optional(), supportEmail: z.email().optional() })
        .default({}),
      seo: z.object({ title: localized, description: localized }),
    }),
});

export const collections = { games };
