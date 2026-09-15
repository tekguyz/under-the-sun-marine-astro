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

test('services shows three groups with Jack\'s items', async ({ page }) => {
  const groups = page.locator('#services [data-service]');
  await expect(groups).toHaveCount(3);
  await expect(groups.nth(0)).toContainText('Engine & Mechanical');
  await expect(groups.nth(0)).toContainText('Engine diagnostics & repair');
  await expect(groups.nth(1)).toContainText('Electrical & Electronics');
  await expect(groups.nth(1)).toContainText('Custom rigging');
  await expect(groups.nth(2)).toContainText('Detailing');
});

test('about uses Jack\'s own words', async ({ page }) => {
  const about = page.locator('#about');
  await expect(about.getByRole('heading', { level: 2 })).toBeAttached();
  await expect(about).toContainText('my name is Jack');
  await expect(about).toContainText('treating every boat like it');
  await expect(about.locator('img')).toHaveAttribute('alt', /Jack/);
});

test('footer has contact and social links', async ({ page }) => {
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: /560-5050/ })).toHaveAttribute('href', 'tel:+15615605050');
  await expect(footer.getByRole('link', { name: /Utsboatrepair@gmail.com/i })).toHaveAttribute('href', 'mailto:Utsboatrepair@gmail.com');
  await expect(footer.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/underthesunmarine/');
  await expect(footer.getByRole('link', { name: /tiktok/i })).toHaveAttribute('href', 'https://www.tiktok.com/@under.the.sun.marine');
  await expect(footer).toContainText(String(new Date().getFullYear()));
});

test('mobile call bar shows on phones only', async ({ page }, info) => {
  const bar = page.locator('[data-callbar]');
  if (info.project.name === 'mobile') {
    // Hidden while the hero buttons are on screen, shown once they scroll away.
    await expect(bar).toHaveAttribute('data-hidden', '');
    await page.locator('#work').scrollIntoViewIfNeeded();
    await expect(bar).not.toHaveAttribute('data-hidden');
    await expect(bar).toBeVisible();
    await expect(bar.getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+15615605050');
    await expect(bar.getByRole('link', { name: /text/i })).toHaveAttribute('href', 'sms:+15615605050');
  } else {
    await expect(bar).toBeHidden();
  }
});
