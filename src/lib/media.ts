import type { ImageMetadata } from 'astro';

// Every image in src/assets/media/ is available by file name. Astro processes the ones that are
// actually referenced at build time (resized, converted to WebP, hashed, cached).
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/media/*.{jpg,jpeg,png,webp,avif,gif}', { eager: true });

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  byName.set(path.split('/').pop()!, mod.default);
}

/** Resolve a media file name (e.g. "karma.jpg") to its imported image metadata. Throws if missing. */
export function media(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) throw new Error(`Unknown media file "${name}" — expected it in src/assets/media/`);
  return img;
}

export function hasMedia(name: string): boolean {
  return byName.has(name);
}

/**
 * Plain copy of an image's metadata for reading width/height at build time.
 * Reading properties directly on an imported image marks the *original* file as referenced,
 * which makes Astro copy the unoptimised original into dist/. Astro's own components use `.clone` too.
 */
export function dims(img: ImageMetadata): { width: number; height: number } {
  const plain = (img as ImageMetadata & { clone?: ImageMetadata }).clone ?? img;
  return { width: plain.width, height: plain.height };
}
