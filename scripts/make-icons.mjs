import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const svg = await readFile('public/favicon.svg');

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

await writeFile('public/icon-192.png', await png(192));
await writeFile('public/icon-512.png', await png(512));
await writeFile('public/apple-touch-icon.png', await png(180));

// ICO container holding one 32x32 PNG.
const png32 = await png(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14); // data size
header.writeUInt32LE(22, 18); // data offset
await writeFile('public/favicon.ico', Buffer.concat([header, png32]));

// Share image: real photo, navy fade, logo on a light card.
const W = 1200;
const H = 630;
const photo = await sharp('src/assets/work/work3.jpg').resize(W, H, { fit: 'cover', position: 'attention' }).toBuffer();
const fade = Buffer.from(
  `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0A1B3F" stop-opacity="0.92"/><stop offset="0.6" stop-color="#0A1B3F" stop-opacity="0.35"/><stop offset="1" stop-color="#0A1B3F" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
);
const logo = await sharp('src/assets/brand/logo-full.png').resize({ width: 380 }).toBuffer();
const { height: logoH } = await sharp(logo).metadata();
const cardW = 440;
const cardH = logoH + 60;
const card = Buffer.from(`<svg width="${cardW}" height="${cardH}"><rect width="${cardW}" height="${cardH}" rx="24" fill="#FFFBF5"/></svg>`);

await sharp(photo)
  .composite([
    { input: fade, left: 0, top: 0 },
    { input: card, left: 60, top: Math.round((H - cardH) / 2) },
    { input: logo, left: 90, top: Math.round((H - cardH) / 2) + 30 },
  ])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile('public/og.jpg');

console.log('icons + og.jpg written');
