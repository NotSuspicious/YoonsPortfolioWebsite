// Survey every page: section kinds, gallery kinds, block kinds. Caches HTML to ./pages/<slug>.html
import * as cheerio from 'cheerio';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'data');
const PAGES = path.join(here, 'pages');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const ORIGIN = 'https://www.yoonslee.com';
fs.mkdirSync(PAGES, { recursive: true });

const sitemap = fs.readFileSync(path.join(DATA, 'sitemap.xml'), 'utf8');
const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]))].filter(u => !u.includes('/cart'));
urls.unshift(ORIGIN + '/');

async function getHtml(url) {
  const slug = url.replace(ORIGIN, '').replace(/^\//, '').replace(/\//g, '__') || 'index';
  const file = path.join(PAGES, slug + '.html');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  const html = await r.text();
  fs.writeFileSync(file, html);
  return html;
}

for (const url of urls) {
  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const title = $('title').text();
  const secs = $('section.page-section').map((i, s) => {
    const cls = $(s).attr('class') || '';
    let kind = 'layout';
    if (cls.includes('gallery-section')) kind = 'gallery:' + ($(s).find('[data-controller^="Gallery"]').attr('data-controller') || '?');
    else if (cls.includes('content-collection')) kind = 'collection:' + (cls.match(/collection-type-([\w-]+)/)?.[1] || '?');
    const blocks = $(s).find('.sqs-block').map((j, b) => ($(b).attr('class') || '').match(/(\w+)-block/)?.[1] || '?').get();
    const nImgs = $(s).find('img').length;
    const video = $(s).find('video, iframe, .sqs-video-wrapper, .video-block').length;
    return `${kind}${blocks.length ? '[' + blocks.join(',') + ']' : ''}(img:${nImgs}${video ? ',video:' + video : ''})`;
  }).get();
  console.log(url.replace(ORIGIN, '') || '/', '|', title, '|', secs.join(' ; '));
}
