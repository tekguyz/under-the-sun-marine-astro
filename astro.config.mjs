import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://underthesunmarine.com',
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks') })],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      weights: [600, 700, 800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Barlow',
      cssVariable: '--font-barlow',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
});
