import { describe, it, expect } from 'vitest';
import { validateContact, encodeForm, type ContactFields } from '../../src/scripts/validate';

const valid: ContactFields = {
  name: 'Sam Boater',
  phone: '(561) 555-0199',
  email: '',
  service: 'Not sure',
  boat: '',
  message: 'Engine will not start.',
};

describe('validateContact', () => {
  it('accepts a valid form with optional fields empty', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('requires a name of 2+ characters', () => {
    expect(validateContact({ ...valid, name: ' J ' }).name).toBeDefined();
  });

  it('requires a 10-digit US phone, allowing a leading 1', () => {
    expect(validateContact({ ...valid, phone: '555-0199' }).phone).toBeDefined();
    expect(validateContact({ ...valid, phone: '1 561 555 0199' }).phone).toBeUndefined();
    expect(validateContact({ ...valid, phone: '+1 (561) 555-0199' }).phone).toBeUndefined();
  });

  it('accepts international numbers that start with +', () => {
    expect(validateContact({ ...valid, phone: '+44 20 7946 0958' }).phone).toBeUndefined();
    expect(validateContact({ ...valid, phone: '+44 12' }).phone).toBeDefined();
  });

  it('checks email only when given', () => {
    expect(validateContact({ ...valid, email: 'nope' }).email).toBeDefined();
    expect(validateContact({ ...valid, email: 'sam@example.com' }).email).toBeUndefined();
  });

  it('requires a message of 5+ characters', () => {
    expect(validateContact({ ...valid, message: 'hi' }).message).toBeDefined();
  });
});

describe('encodeForm', () => {
  it('url-encodes fields for Netlify', () => {
    expect(encodeForm({ 'form-name': 'contact', message: 'A & B' })).toBe('form-name=contact&message=A+%26+B');
  });
});
