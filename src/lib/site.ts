import site from '@/data/site.json';

/** Public origin of this build (from `site` in astro.config.mjs), without a trailing slash. */
export const siteUrl = (import.meta.env.SITE ?? site.url).replace(/\/$/, '');
