import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://underthesunmarine.com',
  // The desktop app passes a free port in PORT (autoPort in .claude/launch.json).
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks') })],
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Barlow Condensed',
      cssVariable: '--font-barlow-condensed',
      // Display type is only ever 800; keep the file count (and page weight) low.
      weights: [800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Barlow',
      cssVariable: '--font-barlow',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
});
