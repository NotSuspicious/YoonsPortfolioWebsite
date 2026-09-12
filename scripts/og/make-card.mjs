// Renders the social link-preview card (Open Graph / Twitter) to public/og-card.jpg (1200×630).
// Layout: site cream background, name + descriptor set in Baskervville on the left,
// the About-page portrait framed on the right. Text is laid out by satori, rasterised by resvg.
//
// Run:  npm run og   (re-run after changing the portrait, name or wording below)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const about = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/about.json'), 'utf8'));

const W = 1200, H = 630;
const BG = '#fff3e6', FG = '#000000', ACCENT = '#9a7b66';
const PHOTO = { x: 648, y: 44, w: 504, h: 542 }; // framed portrait on the right
const OUT = path.join(ROOT, 'public/og-card.jpg');

// --- portrait: crop the About photo to the frame's aspect, keeping the artist + screen + sculpture
const src = path.join(ROOT, 'src/assets/media', about.portrait.src);
const meta = await sharp(src).metadata();
const cropH = Math.round(meta.width * (PHOTO.h / PHOTO.w));
const top = Math.round(meta.height * 0.15); // skip some of the empty wall above the work
const photo = await sharp(src)
  .extract({ left: 0, top: Math.min(top, meta.height - cropH), width: meta.width, height: cropH })
  .resize(PHOTO.w * 2, PHOTO.h * 2) // 2× for crisp downscale in the rasteriser
  .jpeg({ quality: 90 })
  .toBuffer();
const photoUri = `data:image/jpeg;base64,${photo.toString('base64')}`;

// --- text side
const regular = fs.readFileSync(path.join(here, 'fonts/Baskervville-Regular.woff'));
const italic = fs.readFileSync(path.join(here, 'fonts/Baskervville-Italic.woff'));
const t = (type, style, children) => ({ type, props: { style, children } });

const tree = t('div', { display: 'flex', width: W, height: H, background: BG, color: FG, fontFamily: 'Baskervville' }, [
  t('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: PHOTO.x, padding: '72px 40px 60px 76px' }, [
    t('div', { display: 'flex', flexDirection: 'column' }, [
      t('div', { fontSize: 88, lineHeight: 1.05, letterSpacing: -0.5 }, site.name),
      t('div', { fontSize: 31, lineHeight: 1.35, marginTop: 30, fontStyle: 'italic' }, 'Korean-born, Los Angeles-based interdisciplinary artist'),
      t('div', { fontSize: 24, lineHeight: 1.4, marginTop: 22, color: ACCENT, letterSpacing: 0.5 }, 'Installation  ·  Painting  ·  Ceramics'),
    ]),
    t('div', { fontSize: 22, color: ACCENT }, site.url.replace(/^https?:\/\/(www\.)?/, '')),
  ]),
  { type: 'img', props: { src: photoUri, width: PHOTO.w, height: PHOTO.h, style: { position: 'absolute', left: PHOTO.x, top: PHOTO.y, objectFit: 'cover' } } },
]);

const svg = await satori(tree, {
  width: W,
  height: H,
  fonts: [
    { name: 'Baskervville', data: regular, weight: 400, style: 'normal' },
    { name: 'Baskervville', data: italic, weight: 400, style: 'italic' },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
await sharp(png).flatten({ background: BG }).jpeg({ quality: 86, mozjpeg: true }).toFile(OUT);
const bytes = fs.statSync(OUT).size;
console.log(`wrote ${path.relative(ROOT, OUT)} — ${W}×${H}, ${(bytes / 1024).toFixed(0)} KB`);
