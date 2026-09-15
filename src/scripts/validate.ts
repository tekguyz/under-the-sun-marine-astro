export type ContactFields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  boat: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {};

  if (fields.name.trim().length < 2) errors.name = 'Please enter your name.';

  // US numbers need 10 digits (a leading 1 is fine); numbers starting with + may be 8-15 digits.
  const phone = fields.phone.trim();
  const digits = phone.replace(/\D/g, '');
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  const international = phone.startsWith('+') && digits.length >= 8 && digits.length <= 15;
  if (national.length !== 10 && !international) errors.phone = 'Please enter a 10-digit phone number.';

  const email = fields.email.trim();
  if (email && !EMAIL.test(email)) errors.email = 'Please check your email address.';

  if (fields.message.trim().length < 5) errors.message = 'Tell Jack a little about what’s going on.';

  return errors;
}

export function encodeForm(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}
