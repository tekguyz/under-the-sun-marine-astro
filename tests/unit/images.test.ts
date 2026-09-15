import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';

const WORK = 'src/assets/work';
const photos = ['after', 'before', 'team', 'work1', 'work2', 'work3', 'work4', 'work5', 'work6', 'work7', 'work8'].map(
  (n) => `${n}.jpg`,
);

describe('prepared work photos', () => {
  it('contains exactly the expected photos', () => {
    expect(readdirSync(WORK).sort()).toEqual([...photos].sort());
  });

  it.each(photos)('%s is upright portrait, max 2400px, under 900KB', async (file) => {
    const path = `${WORK}/${file}`;
    const meta = await sharp(path).metadata();
    expect(meta.orientation ?? 1).toBe(1);
    expect(meta.height!).toBeGreaterThan(meta.width!);
    expect(Math.max(meta.width!, meta.height!)).toBeLessThanOrEqual(2400);
    expect(statSync(path).size).toBeLessThan(900_000);
  });
});

describe('brand assets', () => {
  it('logo-full is transparent and trimmed', async () => {
    const meta = await sharp('src/assets/brand/logo-full.png').metadata();
    expect(meta.hasAlpha).toBe(true);
    expect(meta.width).toBeLessThan(1080);
  });

  it('logo-mark is the wide sun + waves shape only', async () => {
    const meta = await sharp('src/assets/brand/logo-mark.png').metadata();
    expect(meta.hasAlpha).toBe(true);
    const ratio = meta.width! / meta.height!;
    expect(ratio).toBeGreaterThan(1.6);
    expect(ratio).toBeLessThan(2.6);
  });
});
