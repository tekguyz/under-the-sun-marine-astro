import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/work';
const OUT = 'src/assets/work';
const BRAND = 'src/assets/brand';
const MAX = 2400;

await mkdir(OUT, { recursive: true });
await mkdir(BRAND, { recursive: true });

for (const file of (await readdir(SRC)).filter((f) => f.toLowerCase().endsWith('.jpg'))) {
  await sharp(path.join(SRC, file))
    .rotate() // apply EXIF orientation, then metadata is dropped on output
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, file));
  console.log('photo', file);
}

const full = await sharp('public/logo-trans.png').trim().png().toBuffer();
await sharp(full).toFile(path.join(BRAND, 'logo-full.png'));

const { width, height } = await sharp(full).metadata();
const markHeight = Math.round(height * 0.64);
const markTop = await sharp(full).extract({ left: 0, top: 0, width, height: markHeight }).png().toBuffer();
await sharp(markTop).trim().png().toFile(path.join(BRAND, 'logo-mark.png'));
console.log('brand logo-full.png, logo-mark.png');
