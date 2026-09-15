import { test, expect } from '@playwright/test';

test.describe('SEO and head', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('title, description, canonical', async ({ page }) => {
    await expect(page).toHaveTitle(/Mobile Boat Repair/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /dock, marina, or home/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://underthesunmarine.com/');
  });

  test('open graph and twitter', async ({ page }) => {
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://underthesunmarine.com/og.jpg');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Under The Sun Marine/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('LocalBusiness JSON-LD has safe facts only', async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw!);
    expect(data['@type']).toBe('LocalBusiness');
    expect(data.name).toBe('Under The Sun Marine');
    expect(data.telephone).toBe('+15615605050');
    expect(data.email).toBe('Utsboatrepair@gmail.com');
    expect(data.address.addressLocality).toBe('Pompano Beach');
    expect(data.sameAs).toEqual([
      'https://www.instagram.com/underthesunmarine/',
      'https://www.tiktok.com/@under.the.sun.marine',
    ]);
    expect(raw).not.toMatch(/licensed|insured|OEM|certified|guarantee/i);
  });

  test('fonts are loaded from Astro fonts', async ({ page }) => {
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family).toMatch(/Barlow/);
  });
});
