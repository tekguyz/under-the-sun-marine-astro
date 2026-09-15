# Under The Sun Marine

One-page Astro site for Under The Sun Marine, hosted on Netlify.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

## Images and icons

Photos live in `src/assets/work`. To add a photo, put the original in `public/work`, run `npm run images`, then delete the original from `public/work`.
Icons and the share image are built by `npm run icons`.

## Deploy

Netlify builds `npm run build` and publishes `dist`. The contact form is the Netlify form named `contact`.
