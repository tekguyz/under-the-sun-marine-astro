import { test, expect } from '@playwright/test';

test('reveal elements become visible when scrolled to', async ({ page }) => {
  await page.goto('/');
  const target = page.locator('#about [data-reveal]').first();
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveClass(/is-visible/);
  await expect.poll(() => target.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('content below the fold is fully visible without scrolling', async ({ page }) => {
    await page.goto('/');
    const target = page.locator('#contact [data-reveal]').first();
    const opacity = await target.evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('all content is visible', async ({ page }) => {
    await page.goto('/');
    const opacities = await page.locator('[data-reveal]').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
  });
});
