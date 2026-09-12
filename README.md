# Yoon Lee — portfolio site

Static rebuild of [yoonslee.com](https://www.yoonslee.com) (previously Squarespace 7.1) as a fast, self-hosted site.

## Stack

| | |
|---|---|
| Framework | [Astro 7](https://astro.build) — static HTML output, zero client-side framework |
| Images | `astro:assets` + sharp — WebP `srcset` renditions generated at build time (1,044 files from 182 source images) |
| Fonts | Baskervville (OFL) self-hosted via `@fontsource/baskervville`, preloaded |
| Interactivity | ~2.5 KB of vanilla TypeScript: scroll-reveal, hover index, slideshow, lightbox, mobile menu |
| SEO | per-page titles/descriptions, canonical URLs, Open Graph/Twitter cards, JSON-LD (`Person`, `VisualArtwork`, `ExhibitionEvent`, breadcrumbs), `sitemap-index.xml`, `robots.txt`, semantic headings, descriptive alt text |
| Old URLs | every Squarespace path 301-redirects to its new URL (`public/_redirects`, `vercel.json`, plus meta-refresh stubs from `astro.config.mjs`) |

A page is typically ~100 KB on first load (HTML + CSS + JS + two font files + the first image); every other image is lazy-loaded at the right size for the viewport.

## Commands

```bash
npm install          # once
npm run dev          # http://localhost:4321 with hot reload
npm run build        # static site -> dist/
npm run preview      # serve dist/ locally
npm run check        # type-check .astro files
```

Node 22.12+ is required. The first `build` converts every image (about a minute); later builds reuse the cache in `node_modules/.astro/`.

## Site map

| URL | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | full-viewport hero, header floats over it |
| `/about/` | `src/pages/about.astro` + `src/data/about.json` | portrait, bio, CV with two photos |
| `/works/` | `src/pages/works/index.astro` + `src/data/works-grid.json` | two thumbnail grids; items link to a work page or open the lightbox |
| `/works/<slug>/` | `src/pages/works/[slug].astro` + `src/content/works/*.json` | caption + image stack (22 works) |
| `/exhibitions/` | `src/pages/exhibitions/index.astro` | hover-to-reveal cover images (stacked covers on touch devices) |
| `/exhibitions/<slug>/` | `src/pages/exhibitions/[slug].astro` + `src/content/exhibitions/*.json` | statement, installation views, one slideshow per artwork |

## Editing content

All content is plain JSON; images are referenced by file name inside `src/assets/media/`.

**Add a work** — create `src/content/works/my-piece.json`:

```json
{
  "title": "My Piece",
  "year": "2026",
  "details": ["Ceramic", "12 x 12 x 30 in"],
  "order": 5,
  "listed": true,
  "cover": "my-piece-1.jpg",
  "blocks": [
    { "type": "image", "src": "my-piece-1.jpg", "alt": "My Piece (2026) by Yoon Lee — front view", "width": 0.78 },
    { "type": "image", "src": "my-piece-2.jpg", "alt": "My Piece (2026) by Yoon Lee — detail", "width": 0.78, "crop": 1.5, "focal": [0.5, 0.4] },
    { "type": "video", "src": "/video/my-piece.mp4", "poster": "/video/my-piece-poster.jpg", "aspect": 0.5625, "width": 0.62 }
  ]
}
```

- `width` — fraction of the content column the image occupies on desktop (1 = full width; phones are always full width).
- `crop` — optional aspect ratio (w/h) to cover-crop the image into, with `focal` as the focus point (0–1). Delete `crop` to show the whole image. The migrated crops reproduce the "stretched" boxes from the Squarespace layout.
- The page URL is the file name (`/works/my-piece/`). To show the work on `/works/`, add a thumbnail entry to `src/data/works-grid.json` (`{ "src": "…", "alt": "…", "href": "/works/my-piece/" }`); an entry with `"lightbox": true` instead of `href` opens the image in the lightbox.

**Add an exhibition** — copy `src/content/exhibitions/chrysalis.json`; `artworks` holds one slideshow per artwork (put the captioned main shot first).

**About / header / footer** — `src/data/about.json` (HTML strings) and `src/data/site.json` (name, nav, social links, hero image, description).

Videos live in `public/video/` (not processed). Keep them short and web-encoded (H.264 MP4, `-movflags +faststart`), or embed from Vimeo/YouTube for long pieces.

## Deploying

The build is a plain folder of files — any static host works. Point the host at `npm run build` / `dist/`:

- **Cloudflare Pages / Netlify** — `public/_redirects` gives real 301s for the old Squarespace URLs (on Netlify add `!` after `301` if you want the rules to beat the stub pages Astro also generates).
- **Vercel** — `vercel.json` carries the same redirects.
- **GitHub Pages / S3 / anything else** — the meta-refresh stub pages (with canonical links) still redirect old URLs.

Before going live: keep `site` in `astro.config.mjs` as the final domain (it feeds canonical URLs and the sitemap), then submit `https://www.yoonslee.com/sitemap-index.xml` in Google Search Console after the DNS switch.

## Media

- `src/assets/media/` — all 182 images from the old site (largest size Squarespace's CDN would serve, 2500 px wide max).
- `MEDIA-ORIGINALS-NEEDED.md` — the 136 images (and the video) that were uploaded larger than what could be downloaded; drop originals over the same file names to upgrade them.
- `scripts/migrate/` — the crawler/extractor that produced the content files (see its README). It is not needed to run the site.
