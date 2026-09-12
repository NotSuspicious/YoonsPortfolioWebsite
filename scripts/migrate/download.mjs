// Download every unique asset at the largest size the Squarespace CDN serves, record served dimensions.
// Writes: media-manifest.json ; files into <OUT>/src/assets/media/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(here, 'data');
const PAGES = path.join(here, 'pages');

const OUT = path.resolve(here, '../../src/assets/media');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const ACCEPT = 'image/jpeg,image/png,image/gif;q=0.9,*/*;q=0.1'; // avoid WebP negotiation: keep the CDN's JPEG/PNG rendition
fs.mkdirSync(OUT, { recursive: true });

const assets = JSON.parse(fs.readFileSync(path.join(DATA, 'media.json'), 'utf8'));

// Korean words that appear in the artist's file names -> romanized ASCII (asset URLs stay ASCII-safe)
const ROMANIZE = { '\uc5c4\ub9c8': 'eomma', '\uc871\uc790': 'jokja', '\u1102\u1103\u1106': 'ndm', '\u3134\u3137\u3141': 'ndm' };
function slugify(s) {
  for (const [k, v] of Object.entries(ROMANIZE)) s = s.split(k).join(v).split(k.normalize('NFD')).join(v);
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'image';
}
function dims(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), fmt: 'png' };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), fmt: 'jpg' };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { w: 0, h: 0, fmt: 'webp' };
  if (buf[0] === 0x47 && buf[1] === 0x49) return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8), fmt: 'gif' };
  return null;
}

// Assign stable, readable, unique local names
const byStem = new Map();
for (const a of assets) {
  const ext = (path.extname(a.filename) || '.jpg').toLowerCase().replace('.jpeg', '.jpg');
  const stem = slugify(path.basename(a.filename, path.extname(a.filename)));
  a.ext = ext; a.stem = stem;
  byStem.set(stem + ext, (byStem.get(stem + ext) || 0) + 1);
}
for (const a of assets) {
  const key = a.stem + a.ext;
  a.file = byStem.get(key) > 1 ? `${a.stem}-${a.id.slice(0, 6)}${a.ext}` : key;
}

async function fetchOne(a) {
  const dest = path.join(OUT, a.file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    const buf = fs.readFileSync(dest); const d = dims(buf);
    Object.assign(a, { servedWidth: d?.w, servedHeight: d?.h, servedFormat: d?.fmt, bytes: buf.length, cached: true });
    return;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(a.url, { headers: { 'User-Agent': UA, 'Accept': ACCEPT } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const buf = Buffer.from(await r.arrayBuffer());
      const d = dims(buf);
      if (!d || d.fmt === 'webp') throw new Error('unexpected format ' + (d?.fmt || 'unknown') + ' ct=' + r.headers.get('content-type'));
      fs.writeFileSync(dest, buf);
      Object.assign(a, { servedWidth: d.w, servedHeight: d.h, servedFormat: d.fmt, bytes: buf.length });
      return;
    } catch (e) { if (attempt === 3) { a.error = e.message; console.error('FAILED', a.file, e.message); } else await new Promise(r => setTimeout(r, 1000 * attempt)); }
  }
}

let i = 0; const queue = [...assets];
async function worker() { while (queue.length) { const a = queue.shift(); await fetchOne(a); i++; if (i % 20 === 0) console.log(`${i}/${assets.length}`); } }
await Promise.all(Array.from({ length: 6 }, worker));

for (const a of assets) {
  a.needsOriginal = !!(a.servedWidth && (a.claimedWidth > a.servedWidth || a.claimedHeight > a.servedHeight));
}
fs.writeFileSync(path.join(DATA, 'media-manifest.json'), JSON.stringify(assets, null, 2));
const total = assets.reduce((s, a) => s + (a.bytes || 0), 0);
console.log(`done: ${assets.length} assets, ${(total / 1048576).toFixed(1)} MB, needsOriginal: ${assets.filter(a => a.needsOriginal).length}, errors: ${assets.filter(a => a.error).length}`);
