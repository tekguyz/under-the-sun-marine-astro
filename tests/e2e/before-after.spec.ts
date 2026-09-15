import { test, expect } from '@playwright/test';

test('keyboard moves the slider', async ({ page }) => {
  await page.goto('/');
  const root = page.locator('[data-ba]');
  const range = root.getByRole('slider', { name: /before and after/i });
  await range.scrollIntoViewIfNeeded();
  await range.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(range).toHaveValue('52');
  await expect(root).toHaveAttribute('style', /--pos:\s*52%/);
});

test('both images are present with alt text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-ba] img[alt^="Before"]')).toHaveCount(1);
  await expect(page.locator('[data-ba] img[alt^="After"]')).toHaveCount(1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('shows before and after side by side', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-ba] img[alt^="Before"]')).toBeVisible();
    await expect(page.locator('[data-ba] img[alt^="After"]')).toBeVisible();
    await expect(page.locator('[data-ba-range]')).toBeHidden();
  });
});
