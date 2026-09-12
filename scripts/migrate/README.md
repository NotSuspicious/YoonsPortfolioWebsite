# Squarespace → Astro migration scripts

One-off tooling used to move yoonslee.com off Squarespace. Nothing here runs as part of the site build.

| Script | What it does |
|---|---|
| `survey.mjs` | Fetches every page from `data/sitemap.xml` (cached in `pages/`, not committed) and prints each page's section/gallery structure. |
| `extract.mjs` | Parses the cached pages into `data/site.json` (pages → sections → blocks, with Fluid Engine grid positions, crops and focal points) and `media.json` (every unique CDN asset). |
| `download.mjs` | Downloads each asset at the largest size the CDN serves (JPEG/PNG, not the WebP it negotiates by default) into `src/assets/media/`, records the served pixel size, and writes `data/media-manifest.json`. |
| `build-content.mjs` | Turns `data/site.json` + `data/media-manifest.json` into the site's content: `src/content/**`, `src/data/*.json`, `public/_redirects`, `vercel.json`, and `MEDIA-ORIGINALS-NEEDED.md`. Re-runnable: `npm run migrate:content`. |

Facts learned about the source that shaped the data model:

- Squarespace's image CDN caps every rendition at **2500 px wide**, whatever `?format=` is requested; larger uploads are unrecoverable from the public site.
- Videos are only exposed as transcoded HLS streams; `public/video/what-carries-behind.mp4` was remuxed from the 1080p stream with `ffmpeg -c copy`.
- Work pages used Fluid Engine layouts: a caption block followed by image blocks. Blocks with `data-is-image-stretched="true"` were cover-cropped to their grid box (kept as the `crop` value); others show the whole image. Visual order = desktop grid row order (DOM order differed on some pages).
- `/new-page-71-1-3-1` ("comfort") was a byte-identical duplicate of "what is left behind" and `/work` duplicated the home page — both are redirected.
- Slideshow galleries list the captioned main shot first in the source HTML; Squarespace's JS rotates the DOM after init, so the raw order is the authored one.
