import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('shows eight work photos', async ({ page }) => {
  await expect(page.locator('#work a[data-lightbox]')).toHaveCount(8);
});

test('lightbox opens, moves, closes, and returns focus', async ({ page }) => {
  const links = page.locator('#work a[data-lightbox]');
  const first = links.nth(0);
  await first.scrollIntoViewIfNeeded();
  await first.click();

  const dialog = page.locator('dialog#lightbox');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-counter]')).toHaveText('1 / 8');
  await expect(dialog.locator('img')).toHaveAttribute('alt', (await first.getAttribute('data-alt'))!);

  await dialog.locator('[data-next]').click();
  await expect(dialog.locator('[data-counter]')).toHaveText('2 / 8');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('[data-counter]')).toHaveText('8 / 8');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('photo links point to real image files', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.locator('#work a[data-lightbox]').first().getAttribute('href');
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/image\//);
  });
});
