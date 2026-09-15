export type IconName =
  | 'phone' | 'message' | 'mail' | 'wrench' | 'zap' | 'sparkles' | 'check'
  | 'instagram' | 'tiktok' | 'chevron-left' | 'chevron-right' | 'x' | 'arrow-right';

export const site = {
  name: 'Under The Sun Marine',
  owner: 'Jack',
  url: 'https://underthesunmarine.com',
  phoneDisplay: '(561) 560-5050',
  phoneE164: '+15615605050',
  email: 'Utsboatrepair@gmail.com',
  instagram: 'https://www.instagram.com/underthesunmarine/',
  instagramHandle: '@underthesunmarine',
  tiktok: 'https://www.tiktok.com/@under.the.sun.marine',
  tiktokHandle: '@under.the.sun.marine',
  locality: 'Pompano Beach',
  region: 'FL',
  areas: ['Palm Beach County', 'Broward County', 'Miami-Dade County'],
  title: 'Mobile Boat Repair in South Florida | Under The Sun Marine',
  description:
    'Mobile boat repair at your dock, marina, or home in South Florida. Engine diagnostics, marine electrical, electronics installs, and detailing by Jack. Call (561) 560-5050.',
};

export const tel = `tel:${site.phoneE164}`;
export const sms = `sms:${site.phoneE164}`;
export const mailto = `mailto:${site.email}`;

export const nav = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const services: { id: string; icon: IconName; title: string; summary: string; items: string[] }[] = [
  {
    id: 'engine',
    icon: 'wrench',
    title: 'Engine & Mechanical',
    summary: 'Engine not running right? Jack finds the problem and fixes it at your slip.',
    items: ['Engine diagnostics & repair', 'Pumps'],
  },
  {
    id: 'electrical',
    icon: 'zap',
    title: 'Electrical & Electronics',
    summary: 'Lights stopped working, batteries dying, or new electronics to put in.',
    items: ['Marine electrical work', 'Electronics installation', 'Batteries & wiring', 'Custom rigging'],
  },
  {
    id: 'detailing',
    icon: 'sparkles',
    title: 'Detailing',
    summary: 'A real clean-up, inside and out, so your boat looks as good as it runs.',
    items: ['Boat clean-up', 'Professional detailing'],
  },
];

export const serviceOptions = [...services.map((s) => s.title), 'Not sure'];
