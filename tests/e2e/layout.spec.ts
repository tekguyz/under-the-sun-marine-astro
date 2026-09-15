import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero has one h1 and both calls to action', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(/to your dock/i);
  await expect(page.locator('#top').getByRole('link', { name: /request service/i })).toHaveAttribute('href', '#contact');
  await expect(page.locator('#top').getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+15615605050');
});

test('hero mentions dock, marina, or home', async ({ page }) => {
  await expect(page.locator('#top')).toContainText(/dock, marina, or home/i);
});

test('header call link is visible', async ({ page }) => {
  await expect(page.locator('[data-header]').getByRole('link', { name: /call/i })).toBeVisible();
});

test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('page has no banned claims', async ({ page }) => {
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/licensed|insured|\bOEM\b|markup|master|certified|guarantee|north keys/i);
});

test('mobile call bar shows on phones only', async ({ page }, info) => {
  const bar = page.locator('[data-callbar]');
  if (info.project.name === 'mobile') {
    await expect(bar).toBeVisible();
    await expect(bar.getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+15615605050');
    await expect(bar.getByRole('link', { name: /text/i })).toHaveAttribute('href', 'sms:+15615605050');
  } else {
    await expect(bar).toBeHidden();
  }
});
