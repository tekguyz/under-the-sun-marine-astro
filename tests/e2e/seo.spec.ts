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

test.describe('static brand files', () => {
  const files: [string, RegExp][] = [
    ['/favicon.svg', /image\/svg\+xml/],
    ['/favicon.ico', /image\/(x-icon|vnd\.microsoft\.icon)/],
    ['/apple-touch-icon.png', /image\/png/],
    ['/icon-192.png', /image\/png/],
    ['/icon-512.png', /image\/png/],
    ['/og.jpg', /image\/jpeg/],
    ['/site.webmanifest', /(manifest\+json|application\/json|octet-stream)/],
    ['/robots.txt', /text\/plain/],
    ['/sitemap-index.xml', /xml/],
  ];

  for (const [path, type] of files) {
    test(`${path} is served`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toMatch(type);
    });
  }

  test('robots points to sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Sitemap: https://underthesunmarine.com/sitemap-index.xml');
  });

  test('manifest names the business', async ({ request }) => {
    const json = JSON.parse(await (await request.get('/site.webmanifest')).text());
    expect(json.name).toBe('Under The Sun Marine');
    expect(json.icons).toHaveLength(2);
  });
});
