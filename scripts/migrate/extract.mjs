// Extract a structured site model + media manifest from the cached Squarespace pages.
// Output: site.json (pages/sections/blocks), media.json (unique assets)
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'data');
const PAGES = path.join(here, 'pages');

const ORIGIN = 'https://www.yoonslee.com';
const sitemap = fs.readFileSync(path.join(DATA, 'sitemap.xml'), 'utf8');
const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]))].filter(u => !u.includes('/cart'));
urls.unshift(ORIGIN + '/');

const assets = new Map(); // cdnId -> asset

function cdnInfo(src) {
  // https://images.squarespace-cdn.com/content/v1/<site>/<id>/<filename>[?format=...]
  const u = new URL(src);
  const parts = u.pathname.split('/');
  const filename = decodeURIComponent(parts.pop());
  const id = parts.pop();
  return { id, filename, base: `${u.origin}${u.pathname}` };
}

function registerAsset(src, dims, alt, usedIn, focal) {
  if (!src || !src.includes('squarespace-cdn.com')) return null;
  const { id, filename, base } = cdnInfo(src);
  let a = assets.get(id);
  if (!a) {
    const [w, h] = (dims || '0x0').split('x').map(Number);
    a = { id, filename, url: base, claimedWidth: w, claimedHeight: h, usedIn: [] };
    assets.set(id, a);
  }
  if (!a.usedIn.includes(usedIn)) a.usedIn.push(usedIn);
  return { assetId: id, alt: alt || '', focal: focal || null };
}

function cleanHtml($, el) {
  // Strip Squarespace RTE noise; keep semantic tags + centered alignment marker
  const $c = $(el).clone();
  $c.find('script, style').remove();
  $c.find('*').each((i, e) => {
    const $e = $(e);
    const style = ($e.attr('style') || '');
    const align = /text-align:\s*center/.test(style) ? 'center' : (/text-align:\s*right/.test(style) ? 'right' : null);
    const indent = $e.attr('data-indent');
    for (const attr of Object.keys(e.attribs || {})) if (attr !== 'href' && attr !== 'target' && attr !== 'rel') $e.removeAttr(attr);
    if (align) $e.attr('class', 'ta-' + align);
    if (indent) $e.attr('class', (($e.attr('class') || '') + ' indent').trim());
    if (e.tagName === 'a') { $e.attr('rel', 'noopener'); if (($e.attr('href') || '').startsWith('http')) $e.attr('target', '_blank'); }
  });
  // unwrap spans that carry nothing
  $c.find('span').each((i, e) => { if (!e.attribs || Object.keys(e.attribs).length === 0) $(e).replaceWith($(e).html()); });
  let html = $c.html() || '';
  html = html.replace(/<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/g, '').replace(/\s+\n/g, '\n').trim();
  return html;
}

function parseFluidEngine($, section, pageId) {
  const fe = $(section).find('.fluid-engine').first();
  if (!fe.length) return null;
  const css = $(section).find('[data-fluid-engine] > style').first().html() || '';
  // desktop & mobile grid areas per block
  const areas = {};
  const re = /\.fe-block-([A-Za-z0-9_]+)\s*\{\s*grid-area:\s*([^;]+);\s*z-index:\s*(\d+);/g;
  let m; const order = [];
  while ((m = re.exec(css))) { const id = m[1]; if (!areas[id]) { areas[id] = { mobile: m[2].trim(), z: +m[3] }; order.push(id); } else areas[id].desktop = m[2].trim(); }
  const rowsDesktop = +(css.match(/grid-template-rows:\s*repeat\((\d+),minmax\(calc/)?.[1] || 0);
  const rowsMobile = +(css.match(/grid-template-rows:\s*repeat\((\d+),minmax\(24px/)?.[1] || 0);
  const blocks = [];
  fe.children('.fe-block').each((i, b) => {
    const id = ($(b).attr('class') || '').match(/fe-block-([A-Za-z0-9_]+)/)?.[1];
    const area = areas[id] || {};
    const parse = s => { if (!s) return null; const [r1, c1, r2, c2] = s.split('/').map(n => +n.trim()); return { r1, c1, r2, c2 }; };
    const sq = $(b).find('.sqs-block').first();
    const cls = sq.attr('class') || '';
    const base = { id, desktop: parse(area.desktop), mobile: parse(area.mobile), z: area.z };
    if (cls.includes('image-block')) {
      const img = sq.find('img').first();
      const root = sq.find('[data-is-image-stretched]').first();
      const stretched = root.attr('data-is-image-stretched') === 'true';
      const position = (root.attr('class') || '').match(/image-position-(\w+)/)?.[1] || 'center';
      const focal = root.attr('data-media-focal-point') || img.attr('data-image-focal-point') || null;
      const ref = registerAsset(img.attr('data-src') || img.attr('src'), img.attr('data-image-dimensions'), img.attr('alt'), pageId, focal);
      if (!ref) return; // empty/placeholder image block
      const link = sq.find('a.sqs-block-image-link, a').first().attr('href') || null;
      // Reference desktop geometry (1280px viewport): 24 cells of 38.96px, rows of 25.87px, 11px gaps, content width 1265px
      const geo = (area) => { if (!area) return null; const c = area.c2 - area.c1, r = area.r2 - area.r1; const w = c * 38.96 + (c - 1) * 11, h = r * 25.87 + (r - 1) * 11; return { cols: c, rows: r, w: +w.toFixed(1), h: +h.toFixed(1), ar: +(w / h).toFixed(4), widthPct: +(w / 1265).toFixed(4) }; };
      blocks.push({ type: 'image', ...base, ...ref, stretched, position, link, box: geo(base.desktop) });
    } else if (cls.includes('html-block')) {
      const html = cleanHtml($, sq.find('.sqs-html-content').first());
      if (html) blocks.push({ type: 'text', ...base, html });
    } else if (cls.includes('video-block')) {
      const cfg = sq.find('[data-config-video]').attr('data-config-video');
      const settings = sq.find('[data-config-settings]').attr('data-config-settings');
      let video = null; try { video = JSON.parse(cfg); } catch {}
      let vs = null; try { vs = JSON.parse(settings); } catch {}
      const poster = sq.find('img').first();
      const posterRef = poster.length ? registerAsset(poster.attr('data-src') || poster.attr('src'), poster.attr('data-image-dimensions'), poster.attr('alt'), pageId) : null;
      const embed = sq.find('[data-html]').attr('data-html') || sq.find('iframe').attr('src') || null;
      blocks.push({ type: 'video', ...base, video, settings: vs, poster: posterRef, embed });
    } else {
      blocks.push({ type: 'other', ...base, cls: cls.slice(0, 80) });
    }
  });
  return { type: 'layout', rowsDesktop, rowsMobile, blocks };
}

function parseGallery($, section, pageId) {
  const ctrl = $(section).find('[data-controller^="Gallery"]').first();
  const kind = ctrl.attr('data-controller'); // GalleryGrid | GallerySlideshow | ...
  let props = null; try { props = JSON.parse(ctrl.attr('data-props')); } catch {}
  const itemSel = kind === 'GalleryGrid' ? '.gallery-grid-item' : kind === 'GallerySlideshow' ? '.gallery-slideshow-item' : '.gallery-masonry-item, .gallery-strips-item, .gallery-reel-item';
  const items = [];
  ctrl.find(itemSel).each((i, it) => {
    const img = $(it).find('img').first();
    const a = $(it).find('a').first();
    const cap = $(it).find('figcaption .gallery-caption-content, figcaption').first();
    const ref = registerAsset(img.attr('data-src') || img.attr('src'), img.attr('data-image-dimensions'), img.attr('alt'), pageId, img.attr('data-image-focal-point'));
    items.push({ ...ref, href: a.attr('href') || null, caption: cap.length ? cap.text().replace(/\s+/g, ' ').trim() : null });
  });
  return { type: kind === 'GalleryGrid' ? 'gallery-grid' : kind === 'GallerySlideshow' ? 'gallery-slideshow' : 'gallery-' + kind, props, items };
}

function parseCollection($, section, pageId) {
  const cls = $(section).attr('class') || '';
  const ctype = cls.match(/collection-type-([\w-]+)/)?.[1];
  let styles = null; try { styles = JSON.parse($(section).attr('data-current-styles')); } catch {}
  const bgImg = $(section).find('.section-background img').first();
  const bg = bgImg.length ? registerAsset(bgImg.attr('data-src') || bgImg.attr('src'), bgImg.attr('data-image-dimensions'), bgImg.attr('alt'), pageId, bgImg.attr('data-image-focal-point')) : null;
  const ph = $(section).find('.portfolio-hover').first();
  const dataset = {}; for (const [k, v] of Object.entries(ph.get(0)?.attribs || {})) if (k.startsWith('data-') && k !== 'data-props') dataset[k.slice(5)] = v;
  const items = [];
  const bgs = ph.find('.portfolio-hover-bg img').toArray();
  ph.find('a.portfolio-hover-item').each((i, a) => {
    const img = bgs[i] ? $(bgs[i]) : null;
    const ref = img ? registerAsset(img.attr('data-src') || img.attr('src'), img.attr('data-image-dimensions'), img.attr('alt'), pageId, img.attr('data-image-focal-point')) : null;
    items.push({ title: $(a).text().replace(/\s+/g, ' ').trim(), href: $(a).attr('href'), image: ref });
  });
  return { type: 'collection', collectionType: ctype, background: bg, overlayOpacity: styles?.imageOverlayOpacity ?? null, sectionHeight: styles?.sectionHeight ?? null, hover: dataset, items };
}

const pages = [];
for (const url of urls) {
  const slug = url.replace(ORIGIN, '').replace(/^\//, '').replace(/\//g, '__') || 'index';
  const html = fs.readFileSync(path.join(PAGES, slug + '.html'), 'utf8');
  const $ = cheerio.load(html);
  const pageId = url.replace(ORIGIN, '') || '/';
  const page = {
    path: pageId,
    title: $('title').text().replace(/\s+—\s+Yoon Lee$/, '').trim(),
    fullTitle: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    ogImage: $('meta[property="og:image"]').attr('content') || null,
    sections: [],
  };
  $('section.page-section').each((i, s) => {
    const cls = $(s).attr('class') || '';
    let sec;
    if (cls.includes('gallery-section')) sec = parseGallery($, s, pageId);
    else if (cls.includes('content-collection')) sec = parseCollection($, s, pageId);
    else sec = parseFluidEngine($, s, pageId) || { type: 'unknown' };
    sec.height = cls.match(/section-height--([\w-]+)/)?.[1] || null;
    sec.width = cls.match(/content-width--([\w-]+)/)?.[1] || null;
    sec.theme = cls.match(/\b(light|dark|bright|white|black|light-bold|dark-bold)\b\s*$/)?.[1] || null;
    page.sections.push(sec);
  });
  pages.push(page);
}

fs.writeFileSync(path.join(DATA, 'site.json'), JSON.stringify(pages, null, 2));
fs.writeFileSync(path.join(DATA, 'media.json'), JSON.stringify([...assets.values()], null, 2));
console.log(`pages: ${pages.length}, unique assets: ${assets.size}`);
const over = [...assets.values()].filter(a => a.claimedWidth > 2500);
console.log(`assets with claimed width > 2500 (CDN cap): ${over.length}`);
