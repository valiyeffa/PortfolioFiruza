import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const publicDir = path.resolve('public');
const projectPngs = [
  'coppola.png',
  'erp.png',
  'brendEcom.png',
  'brendDash.png',
  'medhis.png',
  'euro.png',
  'port.png',
  'portf.png',
];

const maxWidth = 720;

for (const file of projectPngs) {
  const input = path.join(publicDir, file);
  const webpOut = path.join(publicDir, file.replace(/\.png$/i, '.webp'));

  await sharp(input)
    .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 78 })
    .toFile(webpOut);

  const meta = await sharp(webpOut).metadata();
  console.log(`${file} -> ${path.basename(webpOut)} (${meta.width}x${meta.height})`);
}
