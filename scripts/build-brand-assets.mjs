#!/usr/bin/env node
/**
 * Generates static brand assets into /public from the real artwork in /src/assets:
 *   - public/og/abrava-studio.png   1200×630 social card for studio pages
 *   - public/og/<game>.png          1200×630 social card per game (from its key art)
 *   - public/brand/abrava-studio-logo.png  stable URL for structured data
 *   - public/favicon.svg, favicon.ico, apple-touch-icon.png  (the lime pixel "A" from the logo)
 *
 * Run with `npm run brand` after changing logo or key art, then commit the output.
 * Pixel art is scaled with nearest-neighbour sampling so it stays crisp.
 */
import { mkdir, readdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => path.join(root, 'public', ...p);
const asset = (...p) => path.join(root, 'src', 'assets', ...p);

const NAVY = '#00122b';
const NAVY_DEEP = '#000a1a';
const LIME = '#baf670';
const W = 1200;
const H = 630;

await mkdir(out('og'), { recursive: true });
await mkdir(out('brand'), { recursive: true });

/** Deterministic star field as SVG, matching the site background. */
function starsSvg(width, height, count = 90, seed = 11) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const rects = Array.from({ length: count }, () => {
    const x = Math.floor(rand() * width / 4) * 4;
    const y = Math.floor(rand() * height / 4) * 4;
    const size = rand() > 0.85 ? 8 : 4;
    const opacity = (0.35 + rand() * 0.6).toFixed(2);
    return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" opacity="${opacity}"/>`;
  }).join('');
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NAVY_DEEP}"/><stop offset="1" stop-color="#002c5c"/></linearGradient></defs>` +
      `<rect width="100%" height="100%" fill="url(#g)"/>${rects}</svg>`,
  );
}

// --- Studio social card: the official 512×512 logo at native size (no resampling) on the night sky.
{
  const logo = asset('brand', 'abrava-studio-logo.png');
  const meta = await sharp(logo).metadata();
  await sharp(starsSvg(W, H))
    .composite([{ input: logo, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(out('og', 'abrava-studio.png'));
}

// --- Game social cards from key art (cover-fit, nearest-neighbour).
for (const slug of await readdir(asset('games'))) {
  const keyArt = asset('games', slug, 'feature-graphic.png');
  await sharp(keyArt)
    .resize(W, H, { fit: 'cover', kernel: 'nearest' })
    .png({ compressionLevel: 9 })
    .toFile(out('og', `${slug}.png`));
}

// --- Stable logo URL for Organization structured data.
await copyFile(asset('brand', 'abrava-studio-logo.png'), out('brand', 'abrava-studio-logo.png'));

// --- Favicon: the flat-topped lime "A" of the wordmark, on a pixel-aligned 11×11 grid.
const A = ['.XXXXX.', 'XX...XX', 'XX...XX', 'XXXXXXX', 'XX...XX', 'XX...XX', 'XX...XX'];
const pixels = A.flatMap((row, y) =>
  [...row].map((c, x) => (c === 'X' ? `<rect x="${x + 2}" y="${y + 2}" width="1" height="1"/>` : '')),
).join('');
const faviconSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11" shape-rendering="crispEdges">` +
  `<rect width="11" height="11" rx="2" fill="${NAVY}"/><g fill="${LIME}">${pixels}</g></svg>
`;
await writeFile(out('favicon.svg'), faviconSvg);

const png = (size) => sharp(Buffer.from(faviconSvg), { density: 72 * (size / 11) }).resize(size, size).png().toBuffer();
await writeFile(out('apple-touch-icon.png'), await sharp(await png(180)).flatten({ background: NAVY }).png().toBuffer());

// favicon.ico with an embedded 32×32 PNG (supported by all current browsers).
{
  const data = await png(32);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(6 + 16, 12); // offset
  await writeFile(out('favicon.ico'), Buffer.concat([header, entry, data]));
}

console.log('Brand assets written to /public (og/, brand/, favicon.svg, favicon.ico, apple-touch-icon.png).');
