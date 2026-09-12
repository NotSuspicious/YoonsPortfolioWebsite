// Transform the crawled Squarespace site model (data/site.json + data/media-manifest.json)
// into this site's content files:
//   src/content/works/<slug>.json        one per artwork page
//   src/content/exhibitions/<slug>.json  one per exhibition page
//   src/data/site.json                   nav, socials, home hero, footer
//   src/data/about.json                  about page content
//   src/data/works-grid.json             the two thumbnail grids on /works
//   src/data/redirects.json              old Squarespace URL -> new URL
//   MEDIA-ORIGINALS-NEEDED.md            assets served below their original size by the CDN
//
// Run:  npm run migrate:content   (safe to re-run; overwrites the generated files above)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const pages = JSON.parse(fs.readFileSync(path.join(here, 'data/site.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(here, 'data/media-manifest.json'), 'utf8'));
const byId = Object.fromEntries(media.map(a => [a.id, a]));
const page = p => pages.find(x => x.path === p);

// ---- URL plan --------------------------------------------------------------------------
// Old Squarespace path -> new slug. "comfort" duplicates "what is left behind" byte-for-byte, so it merges.
const WORK_SLUGS = {
  '/new-page-71': 'hide-and-seek',
  '/new-page-71-1': 'burden',
  '/new-page-71-2': 'blue-tears',
  '/new-page-71-2-1': 'untitled-i',
  '/new-page-71-1-1': 'untitled-ii',
  '/new-page-71-3': 'untitled-iii',
  '/new-page-71-2-2': 'last-bloom',
  '/new-page-71-2-3': 'karma',
  '/new-page-71-2-4': 'the-weight-of-blossom',
  '/new-page-71-1-2': 'my-dad',
  '/new-page-71-1-3': 'persona',
  '/new-page-71-1-2-1': 'vulnerable',
  '/new-page-71-4': 'filial-daughter',
  '/new-page-71-5': 'what-is-left-behind',
  '/new-page-71-1-3-1': 'what-is-left-behind', // duplicate page -> merged
  '/new-page-71-5-1': 'breakaway',
  '/new-page-71-5-2': 'rebirth',
  '/new-page-71-5-3': 'the-little-prince',
  '/new-page-71-5-3-1': 'cloudies',
  '/new-page-71-5-3-2': 'playground',
  '/new-page-71-5-4': 'caring',
  '/new-page-71-5-4-1': 'breath',
  '/new-page-71-5-5': 'what-carries-behind',
};
const EXHIBITION_SLUGS = {
  '/portfolio-3/project-one-h346n-mnen4-mbttp': 'from-mud-to-bloom',
  '/portfolio-3/project-one-h346n-mnen4': 'chrysalis',
};
const newUrl = (oldHref) => {
  if (!oldHref) return null;
  if (WORK_SLUGS[oldHref]) return `/works/${WORK_SLUGS[oldHref]}/`;
  if (EXHIBITION_SLUGS[oldHref]) return `/exhibitions/${EXHIBITION_SLUGS[oldHref]}/`;
  if (oldHref === '/gallery') return '/works/';
  if (oldHref === '/portfolio-3') return '/exhibitions/';
  if (oldHref === '/work') return '/';
  return oldHref;
};

const write = (rel, data) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n'); };
const focal = s => s ? s.split(',').map(n => +(+n).toFixed(3)) : [0.5, 0.5];
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const img = (ref, alt) => ({ src: byId[ref.assetId].file, alt: alt ?? '' });

// ---- Works -----------------------------------------------------------------------------
const gallery = page('/gallery');
const gridSections = gallery.sections.filter(s => s.type === 'gallery-grid');
const gridOrder = new Map(); // old work path -> first appearance index across both grids
let gi = 0;
for (const s of gridSections) for (const it of s.items) { if (it.href && WORK_SLUGS[it.href] && !gridOrder.has(WORK_SLUGS[it.href])) gridOrder.set(WORK_SLUGS[it.href], ++gi); }

const seen = new Set();
const works = [];
for (const [oldPath, slug] of Object.entries(WORK_SLUGS)) {
  if (seen.has(slug)) continue; seen.add(slug);
  const p = page(oldPath);
  const layout = p.sections[0];
  const blocksSorted = [...layout.blocks].sort((a, b) => (a.desktop?.r1 ?? 0) - (b.desktop?.r1 ?? 0) || (a.desktop?.c1 ?? 0) - (b.desktop?.c1 ?? 0));
  const captionBlock = blocksSorted.find(b => b.type === 'text');
  const paras = [...captionBlock.html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => text(m[1])).filter(Boolean);
  const title = paras[0]; const year = paras[1]; const details = paras.slice(2);
  const imageBlocks = blocksSorted.filter(b => b.type === 'image' || b.type === 'video');
  const nImg = imageBlocks.filter(b => b.type === 'image').length;
  let n = 0;
  const blocks = [];
  for (const b of blocksSorted) {
    if (b === captionBlock) continue;
    if (b.type === 'image') {
      const a = byId[b.assetId]; n++;
      const nat = a.servedWidth / a.servedHeight;
      const box = b.box;
      // Effective rendered width as a fraction of the content column (Squarespace 24-col grid at the reference viewport)
      const width = b.stretched ? box.widthPct : +(Math.min(box.w, box.h * nat) / 1265).toFixed(3);
      const block = { type: 'image', src: a.file, alt: `${title} (${year}) by Yoon Lee${details[0] ? ', ' + details[0] : ''} — image ${n} of ${nImg}`, width: Math.min(1, +width.toFixed(3)) };
      if (b.stretched) { block.crop = +box.ar.toFixed(3); block.focal = focal(b.focal); }
      blocks.push(block);
    } else if (b.type === 'video') {
      blocks.push({ type: 'video', src: '/video/what-carries-behind.mp4', poster: '/video/what-carries-behind-poster.jpg', aspect: b.video?.aspectRatio ?? 0.5625, width: +b.desktop ? +(((b.desktop.c2 - b.desktop.c1) * 38.96 + (b.desktop.c2 - b.desktop.c1 - 1) * 11) / 1265).toFixed(3) : 0.62, controls: b.settings?.controls !== 'none', autoplay: !!b.settings?.autoPlay, loop: !!b.settings?.loop, muted: !!b.settings?.muted });
    } else if (b.type === 'text') {
      blocks.push({ type: 'text', html: b.html });
    }
  }
  const cover = gridSections.flatMap(s => s.items).find(it => it.href === oldPath || WORK_SLUGS[it.href] === slug);
  works.push({ slug, data: {
    title, year, details,
    order: gridOrder.get(slug) ?? 900 + works.length,
    listed: gridOrder.has(slug),
    cover: cover ? byId[cover.assetId].file : blocks.find(b => b.type === 'image')?.src,
    sqsPath: oldPath,
    blocks,
  } });
}
for (const w of works) write(`src/content/works/${w.slug}.json`, w.data);

// ---- Exhibitions -----------------------------------------------------------------------
const index = page('/portfolio-3');
const exhibitions = [];
for (const [oldPath, slug] of Object.entries(EXHIBITION_SLUGS)) {
  const p = page(oldPath);
  const idxItem = index.sections[0].items.find(it => it.href === oldPath);
  const m = p.title.match(/^(.*?)\s*\((\d{4})\)$/);
  const title = m ? m[1].trim() : p.title; const year = m ? m[2] : '';
  const textSec = p.sections.find(s => s.type === 'layout');
  const statementHtml = textSec.blocks.filter(b => b.type === 'text').map(b => b.html).join('').replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '').trim();
  const grid = p.sections.find(s => s.type === 'gallery-grid');
  const slideshows = p.sections.filter(s => s.type === 'gallery-slideshow');
  let v = 0;
  const installationViews = grid.items.map(it => ({ ...img(it), alt: `${title} (${year}), Yoon Lee — installation view ${++v} of ${grid.items.length}` }));
  const artworks = slideshows.map((s, si) => {
    const caption = s.items.map(it => it.caption).find(Boolean) || null;
    return {
      caption,
      transition: s.props?.transition === 'site-default' ? 'fade' : (s.props?.transition || 'fade'),
      slides: s.items.map((it, i) => ({ ...img(it), alt: caption ? `${caption} — view ${i + 1} of ${s.items.length}` : `${title} (${year}), Yoon Lee — artwork ${si + 1}, view ${i + 1} of ${s.items.length}`, caption: it.caption || null })),
    };
  });
  exhibitions.push({ slug, data: {
    title, year, order: exhibitions.length + 1,
    cover: { ...img(idxItem.image), alt: `${title} (${year}), Yoon Lee — installation view` },
    statementHtml,
    installationGrid: { aspect: grid.props?.aspectRatio || 'widescreen', gutter: grid.props?.gutter ?? 50, columns: grid.props?.numColumns ?? 1 },
    installationViews,
    artworks,
    sqsPath: oldPath,
  } });
}
for (const e of exhibitions) write(`src/content/exhibitions/${e.slug}.json`, e.data);

// ---- Works grid (index page) -----------------------------------------------------------
const gridHeadings = gallery.sections.filter(s => s.type === 'layout' && s.blocks.some(b => b.type === 'text')).map(s => text(s.blocks.find(b => b.type === 'text').html)).filter(t => !/©/.test(t));
const worksGrid = { sections: gridSections.map((s, i) => ({
  heading: gridHeadings[i],
  columns: s.props?.numColumns ?? 4,
  items: s.items.map(it => {
    const target = it.href && !it.href.startsWith('?') ? newUrl(it.href) : null;
    const w = target?.startsWith('/works/') ? works.find(x => `/works/${x.slug}/` === target)?.data : null;
    const e = target?.startsWith('/exhibitions/') ? exhibitions.find(x => `/exhibitions/${x.slug}/` === target)?.data : null;
    const alt = w ? `${w.title} (${w.year}) by Yoon Lee` : e ? `${e.title} (${e.year}) by Yoon Lee` : (it.caption || `Artwork by Yoon Lee — ${byId[it.assetId].stem.replace(/-/g, ' ')}`);
    return target ? { src: byId[it.assetId].file, alt, href: target, title: w?.title || e?.title || null } : { src: byId[it.assetId].file, alt, lightbox: true, caption: it.caption || null };
  }),
})) };
write('src/data/works-grid.json', worksGrid);

// ---- About -----------------------------------------------------------------------------
const about = page('/about');
const [s0, s1] = about.sections;
const cvHtml = s1.blocks.find(b => b.type === 'text').html;
const split = cvHtml.indexOf('<h2 class="indent">Honors');
const photos = s1.blocks.filter(b => b.type === 'image').map(b => img(b));
write('src/data/about.json', {
  portrait: { ...img(s0.blocks.find(b => b.type === 'image')), alt: 'Yoon Lee with her folding-screen painting and ceramic sculpture at an exhibition' },
  bioHtml: s0.blocks.find(b => b.type === 'text').html.replace(/ class="indent"/g, ''),
  cv: [
    { html: cvHtml.slice(0, split).replace(/ class="indent"/g, ''), photo: { ...photos[0], alt: 'Yoon Lee in the studio' } },
    { html: cvHtml.slice(split).replace(/ class="indent"/g, ''), photo: { ...photos[1], alt: 'Yoon Lee at an exhibition opening' } },
  ],
});

// ---- Site ------------------------------------------------------------------------------
const home = page('/');
const hero = home.sections[0];
write('src/data/site.json', {
  name: 'Yoon Lee',
  url: 'https://www.yoonslee.com',
  description: 'Yoon Lee is a Korean-born, Los Angeles-based interdisciplinary artist working in installation, painting, and ceramics. Portfolio of works and exhibitions.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about/' },
    { label: 'Exhibitions', href: '/exhibitions/' },
    { label: 'Works', href: '/works/' },
  ],
  social: [
    { type: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/yoons.piece/' },
    { type: 'email', label: 'moon03058@gmail.com', href: 'mailto:moon03058@gmail.com' },
  ],
  footer: 'All rights reserved by Yoon Lee',
  hero: { ...img(hero.background), alt: 'Installation view of From Mud to Bloom, Yoon Lee, 2025', focal: focal(hero.background.focal), overlay: hero.overlayOpacity ?? 0.15 },
});

// ---- Redirects (old Squarespace URLs -> new) -------------------------------------------
const redirects = { '/gallery': '/works/', '/portfolio-3': '/exhibitions/', '/work': '/' };
for (const [o, s] of Object.entries(WORK_SLUGS)) redirects[o] = `/works/${s}/`;
for (const [o, s] of Object.entries(EXHIBITION_SLUGS)) redirects[o] = `/exhibitions/${s}/`;
write('src/data/redirects.json', redirects);
// Host-level 301s (Netlify / Cloudflare Pages read public/_redirects; Vercel reads vercel.json).
// Astro also emits meta-refresh stub pages for these paths, so redirects work on any static host.
write('public/_redirects', Object.entries(redirects).map(([o, n]) => `${o}  ${n}  301`).join('\n') + '\n');
write('vercel.json', { redirects: Object.entries(redirects).map(([o, n]) => ({ source: o, destination: n, permanent: true })), trailingSlash: true });

// ---- Originals-needed report ----------------------------------------------------------
const pageLabel = p => p === '/' || p === '/work' ? 'Home' : p === '/about' ? 'About' : p === '/gallery' ? 'Works index' : p === '/portfolio-3' ? 'Exhibitions index' : WORK_SLUGS[p] ? `Work: ${works.find(w => w.slug === WORK_SLUGS[p])?.data.title}` : EXHIBITION_SLUGS[p] ? `Exhibition: ${exhibitions.find(e => e.slug === EXHIBITION_SLUGS[p])?.data.title}` : p;
const need = media.filter(a => a.needsOriginal).sort((a, b) => a.file.localeCompare(b.file));
const ok = media.filter(a => !a.needsOriginal);
const mb = n => (n / 1048576).toFixed(1);
let md = `# Media files where the original is needed\n\n`;
md += `Squarespace's image CDN never serves more than **2500 px wide**, regardless of the uploaded size. Every image below was uploaded larger than that, so the copy in \`src/assets/media/\` is a downscaled rendition. Drop the original file over the downloaded one (same file name, in \`src/assets/media/\`) and the build will pick it up automatically.\n\n`;
md += `- Unique images on the site: **${media.length}** (${mb(media.reduce((s, a) => s + a.bytes, 0))} MB downloaded)\n- Served at full original size: **${ok.length}**\n- Served downscaled — original needed: **${need.length}**\n- Video: **1** — see below\n\n`;
md += `## Video (original file needed)\n\n| File | What we have | Original |\n|---|---|---|\n| \`public/video/what-carries-behind.mp4\` (page “What Carries Behind”) | Squarespace's transcoded 1080×1920 H.264 stream, remuxed losslessly to MP4 (24 MB, 72 s) | Squarespace only exposes the transcoded HLS stream, not the uploaded file. Replace with the original export if a higher-quality master exists. |\n\n`;
md += `## Images (${need.length})\n\n| Local file | Original filename on Squarespace | Uploaded size | Size we could get | Used on |\n|---|---|---|---|---|\n`;
for (const a of need) md += `| \`${a.file}\` | ${a.filename.replace(/\|/g, '\\|')} | ${a.claimedWidth}×${a.claimedHeight} | ${a.servedWidth}×${a.servedHeight} | ${[...new Set(a.usedIn.map(pageLabel))].join(', ')} |\n`;
md += `\n## Images already at full size (${ok.length})\n\n<details><summary>Show list</summary>\n\n| Local file | Original filename | Size |\n|---|---|---|\n`;
for (const a of ok.sort((x, y) => x.file.localeCompare(y.file))) md += `| \`${a.file}\` | ${a.filename.replace(/\|/g, '\\|')} | ${a.servedWidth}×${a.servedHeight} |\n`;
md += `\n</details>\n`;
write('MEDIA-ORIGINALS-NEEDED.md', md);

console.log(`works: ${works.length} (${works.filter(w => w.data.listed).length} listed on /works), exhibitions: ${exhibitions.length}, grid items: ${worksGrid.sections.reduce((s, x) => s + x.items.length, 0)}, redirects: ${Object.keys(redirects).length}, originals needed: ${need.length}`);
