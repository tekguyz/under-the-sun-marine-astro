import { validateContact, encodeForm, type ContactFields } from './validate';

const FIELDS = ['name', 'phone', 'email', 'service', 'boat', 'message'] as const;
const form = document.querySelector<HTMLFormElement>('form[name="contact"]');

if (form) {
  const status = document.getElementById('contact-status')!;
  const success = document.getElementById('contact-success')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const fallbackPhone = form.dataset.phone ?? '';

  form.noValidate = true;

  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;

  const setError = (name: (typeof FIELDS)[number], message?: string) => {
    const el = document.getElementById(`${name}-error`);
    if (el) el.textContent = message ?? '';
    field(name).setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const values = Object.fromEntries(FIELDS.map((k) => [k, String(data.get(k) ?? '')])) as ContactFields;

    const errors = validateContact(values);
    FIELDS.forEach((k) => setError(k, errors[k]));
    const firstBad = FIELDS.find((k) => errors[k]);
    if (firstBad) {
      field(firstBad).focus();
      return;
    }

    button.disabled = true;
    button.dataset.loading = 'true';
    status.dataset.state = '';
    status.textContent = 'Sending…';

    try {
      const payload = Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v)]));
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      status.textContent = '';
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      status.dataset.state = 'error';
      status.textContent = `Sorry, that didn’t go through. Please call or text Jack at ${fallbackPhone}.`;
    } finally {
      button.disabled = false;
      delete button.dataset.loading;
    }
  });
}
