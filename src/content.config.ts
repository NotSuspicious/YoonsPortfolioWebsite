import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Image references are plain file names inside src/assets/media/ (resolved by src/lib/media.ts)
const mediaFile = z.string().regex(/^[\w.-]+\.(jpe?g|png|webp|avif|gif)$/i, 'expected a file name inside src/assets/media/');
const focal = z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]);

const imageBlock = z.object({
  type: z.literal('image'),
  src: mediaFile,
  alt: z.string(),
  /** Rendered width as a fraction of the content column on desktop (1 = full width). */
  width: z.number().min(0.1).max(1).default(1),
  /** Optional crop: aspect ratio (w/h) the image is cover-fitted into. Remove to show the whole image. */
  crop: z.number().positive().optional(),
  focal: focal.optional(),
});

const videoBlock = z.object({
  type: z.literal('video'),
  src: z.string(),
  poster: z.string().optional(),
  aspect: z.number().positive().default(16 / 9),
  width: z.number().min(0.1).max(1).default(1),
  controls: z.boolean().default(true),
  autoplay: z.boolean().default(false),
  loop: z.boolean().default(false),
  muted: z.boolean().default(false),
});

const textBlock = z.object({ type: z.literal('text'), html: z.string() });

const works = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    /** Caption lines shown under the year: medium, dimensions, notes… */
    details: z.array(z.string()).default([]),
    /** Sort position on the Works page (lower first). */
    order: z.number().default(999),
    /** Whether the work appears in the Works grid. Unlisted works still get a page. */
    listed: z.boolean().default(true),
    cover: mediaFile.optional(),
    /** Original Squarespace path (kept for reference / redirects). */
    sqsPath: z.string().optional(),
    blocks: z.array(z.discriminatedUnion('type', [imageBlock, videoBlock, textBlock])),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/exhibitions' }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    order: z.number().default(999),
    cover: z.object({ src: mediaFile, alt: z.string() }),
    statementHtml: z.string(),
    installationGrid: z.object({
      aspect: z.enum(['widescreen', 'square', 'standard', 'auto']).default('widescreen'),
      gutter: z.number().default(50),
      columns: z.number().int().min(1).max(4).default(1),
    }).default({ aspect: 'widescreen', gutter: 50, columns: 1 }),
    installationViews: z.array(z.object({ src: mediaFile, alt: z.string() })).default([]),
    /** One slideshow per artwork; the caption is shown on slides that carry one. */
    artworks: z.array(z.object({
      caption: z.string().nullable().default(null),
      transition: z.enum(['fade', 'slide']).default('fade'),
      slides: z.array(z.object({ src: mediaFile, alt: z.string(), caption: z.string().nullable().default(null) })),
    })).default([]),
    sqsPath: z.string().optional(),
  }),
});

export const collections = { works, exhibitions };
