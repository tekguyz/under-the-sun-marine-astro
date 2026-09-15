import { test, expect } from '@playwright/test';

test('form is set up for Netlify detection', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('form[name="contact"]');
  await expect(form).toHaveAttribute('data-netlify', 'true');
  await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field');
  await expect(form).toHaveAttribute('method', /post/i);
  await expect(form).toHaveAttribute('action', '/thanks');
  await expect(form.locator('input[type="hidden"][name="form-name"]')).toHaveValue('contact');
  for (const name of ['name', 'phone', 'email', 'service', 'boat', 'message', 'bot-field']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveCount(1);
  }
  const options = await form.locator('select[name="service"] option').allTextContents();
  expect(options).toEqual(['Engine & Mechanical', 'Electrical & Electronics', 'Detailing', 'Not sure']);
});

test('shows inline errors and focuses the first bad field', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: /send request/i }).click();
  await expect(page.locator('#name-error')).toHaveText(/name/i);
  await expect(page.locator('#phone-error')).toHaveText(/phone/i);
  await expect(page.locator('#message-error')).not.toBeEmpty();
  await expect(page.locator('form[name="contact"]').getByLabel(/your name/i)).toBeFocused();
  await expect(page.locator('form[name="contact"]').getByLabel(/your name/i)).toHaveAttribute('aria-invalid', 'true');
});

test('submits to Netlify and shows success', async ({ page }) => {
  let body = '';
  await page.route(
    (url) => url.pathname === '/',
    async (route) => {
      if (route.request().method() === 'POST') {
        body = route.request().postData() ?? '';
        await route.fulfill({ status: 200, body: 'ok' });
      } else {
        await route.continue();
      }
    },
  );

  await page.goto('/#contact');
  await page.locator('form[name="contact"]').getByLabel(/your name/i).fill('Sam Boater');
  await page.locator('form[name="contact"]').getByLabel(/phone/i).fill('561-555-0199');
  await page.locator('form[name="contact"]').getByLabel(/service/i).selectOption('Detailing');
  await page.locator('form[name="contact"]').getByLabel(/boat/i).fill('Grady-White 25');
  await page.locator('form[name="contact"]').getByLabel(/what.s going on/i).fill('Needs a full detail.');
  await page.getByRole('button', { name: /send request/i }).click();

  await expect(page.locator('#contact-success')).toBeVisible();
  await expect(page.locator('#contact-success')).toBeFocused();
  const params = new URLSearchParams(body);
  expect(params.get('form-name')).toBe('contact');
  expect(params.get('name')).toBe('Sam Boater');
  expect(params.get('service')).toBe('Detailing');
});

test('shows a call-or-text message when sending fails', async ({ page }) => {
  await page.route(
    (url) => url.pathname === '/',
    (route) => (route.request().method() === 'POST' ? route.fulfill({ status: 500 }) : route.continue()),
  );
  await page.goto('/#contact');
  await page.locator('form[name="contact"]').getByLabel(/your name/i).fill('Sam Boater');
  await page.locator('form[name="contact"]').getByLabel(/phone/i).fill('561-555-0199');
  await page.locator('form[name="contact"]').getByLabel(/what.s going on/i).fill('Engine will not start.');
  await page.getByRole('button', { name: /send request/i }).click();
  await expect(page.locator('#contact-status')).toContainText('(561) 560-5050');
  await expect(page.locator('form[name="contact"]')).toBeVisible();
});

test('thanks page is noindex and links home', async ({ page }) => {
  await page.goto('/thanks');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
});

test('404 page links home', async ({ page }) => {
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
});
