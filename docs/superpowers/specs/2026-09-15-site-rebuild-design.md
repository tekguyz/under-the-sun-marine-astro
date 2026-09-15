# Under The Sun Marine — Site Rebuild Design

Date: 2026-09-15
Branch: `rebuild/astro`
Status: Approved in brainstorm, pending spec review

## Goal

Replace the AI Studio / Next.js site with a fast, polished, one-page Astro site for
Under The Sun Marine. Keep the brand (colors, logo, photos, business facts) and a
working contact form. Everything else is rebuilt from scratch.

## Success criteria

- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO (mobile).
- `npm install` and `npm run build` finish with no errors and no deprecation warnings
  from our direct dependencies.
- Contact form submissions arrive in Netlify under the form named `contact`, and the
  existing email notification to `utsboatrepair@gmail.com` fires.
- Layout works from 320px to wide desktop with no horizontal scroll.
- Every photo displays upright (EXIF orientation applied).

## Hosting and stack

- Host: Netlify (existing project `underthesunmarine`, domain `underthesunmarine.com`).
- Framework: Astro, static output. No SSR adapter.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`, brand tokens in `@theme`.
- Images: `astro:assets` (`<Image>` / `<Picture>`) producing AVIF + WebP at multiple widths.
- JavaScript: none by default. Small vanilla scripts only for: mobile menu (if any),
  before/after slider, photo lightbox, scroll reveal, form enhancement.
- Remove: Next.js, React, motion, react-hook-form, zod, lucide-react, `@google/genai`,
  `firebase-tools`, AI Studio files (`metadata.json`, `.env.example`, README banner),
  `public/_forms.html`.
- Design work during implementation uses the `impeccable` skill.

## Brand assets (keep)

- Colors: navy `#0A1B3F`, navy light `#15306B`, orange `#F26A21`, orange light `#F7931E`.
  Add warm neutrals (warm white, sand) instead of cold slate grays.
- Logo: `public/logo.png`, `public/logo-trans.png` (sun + waves mark, "UNDER THE SUN /
  MARINE SERVICES" wordmark).
- Photos: `public/work/before.jpg`, `after.jpg`, `team.jpg`, `work1.jpg`–`work8.jpg`.
  Move into `src/assets/` so Astro can optimize them. Originals are 0.4–3.3 MB; several
  are stored sideways with EXIF rotation.

## Business facts (safe facts only)

Use only these:

- Business: Under The Sun Marine
- Owner: Jack
- Phone: (561) 560-5050 — `tel:+15615605050`, `sms:+15615605050`
- Email: Utsboatrepair@gmail.com
- Instagram: https://www.instagram.com/underthesunmarine/ (@underthesunmarine)
- TikTok: https://www.tiktok.com/@under.the.sun.marine
- Service model: mobile — comes to your dock, marina, or home
- Area: South Florida — Palm Beach, Broward, Miami-Dade
- Locality for schema: Pompano Beach, FL

Do NOT use: "Licensed & Insured", "OEM Diagnostics", "Zero markup", "Master-tier",
"North Keys", or any certification or guarantee claim. These stay off until Jack confirms.

## Copy source

Build all copy from Jack's own Instagram post (below). Tighten for the web, keep his voice
(first person, friendly, plain). Do not invent claims.

> Hey, my name is Jack and I run Under The Sun Marine. I've spent a lot of time working
> on boats and genuinely have a passion for marine repair and keeping people out on the
> water. I offer mobile boat repair and come directly to your dock, marina, or home
> anywhere in South Florida. Whether your engine isn't running right, you're having
> electrical issues, your lights stopped working, or you just want your boat cleaned up
> and detailed professionally, I'd be happy to help. Services include: Engine diagnostics
> & repair; Marine electrical work; Electronics installation; Pumps, batteries & wiring;
> Custom rigging; Professional detailing. I take pride in honest work, fair pricing, and
> treating every boat like it's my own. Feel free to reach out anytime with questions or
> issues you're having with your boat.

## Page structure (single page)

1. **Header** — logo (links to top), anchor links on desktop, Call button. Sticky, compact
   on scroll. No hamburger needed if links fit; otherwise a small menu.
2. **Hero** — headline on the idea "Mobile boat repair at your dock, marina, or home";
   short line on South Florida; primary CTA "Request service" (→ #contact), secondary
   "Call (561) 560-5050". Real photo (candidate: `work5.jpg` Jack at the helm, or
   `work6.jpg` outboard work). Chosen during design pass.
3. **Services** — three groups:
   - Engine & Mechanical: engine diagnostics & repair; pumps
   - Electrical & Electronics: marine electrical work; electronics installation;
     batteries & wiring; custom rigging
   - Detailing: professional cleaning and detailing
   Each group shows its items as a simple list, not tag pills.
4. **Before & After** — draggable comparison slider (`before.jpg` / `after.jpg`).
   Keyboard accessible (range input under the hood). Falls back to side-by-side without JS.
5. **Recent Work** — photo grid of `work1`–`work8` (plus `team.jpg` if it fits better here
   than About). Tap opens a lightbox with swipe/arrow navigation, Esc to close, focus trap.
   Without JS, links open the full image.
6. **About Jack** — Jack's words, `team.jpg`, sign-off.
7. **Contact** — form (see below) beside call / text / email links.
8. **Footer** — logo, service area, phone, email, Instagram, TikTok, © year.

Mobile only: fixed bottom bar with Call and Text buttons, hidden when the contact
section is on screen.

Cut from old site: FAQ, Process steps, trust badges, "Active Dispatch" card, bouncing
icons, scroll-arrow, hash-stripping scroll hack.

## Visual direction

- Mood: "sunny marine workshop" — warm, confident, hands-on, not corporate.
- Type: bold, sturdy display face echoing the logo's heavy italic wordmark; clean,
  highly legible body face. Self-hosted (via Fontsource or Astro fonts), `font-display: swap`,
  preload only the hero weights.
- Layout: large real photography, generous section spacing, strong rhythm, fewer cards
  and borders.
- Motif: one wave shape from the logo, used sparingly as a section divider or accent.
- Contrast: all text meets WCAG AA. Orange on white is used for large text/accents only
  unless it passes AA.

## Motion and interaction

- Scroll reveal: small fade + rise via IntersectionObserver, once per element.
- Button press: subtle scale/translate on active.
- Slider and lightbox as above.
- All motion disabled under `prefers-reduced-motion: reduce`.
- Content is fully visible if JS fails (reveal classes only added by JS).

## Contact form

- Plain HTML `<form name="contact" method="POST" data-netlify="true"
  netlify-honeypot="bot-field">` rendered at build time so Netlify detects it.
- Hidden `form-name=contact`; hidden honeypot `bot-field`.
- Fields:
  - `name` — required
  - `phone` — required, `type="tel"`, `autocomplete="tel"`
  - `email` — optional, `type="email"`
  - `service` — select: Engine & Mechanical, Electrical & Electronics, Detailing, Not sure
  - `boat` — optional, boat and engine
  - `message` — required
- Without JS: native validation, POST to Netlify, redirect to a styled `/thanks` page.
- With JS: inline validation messages, `fetch` POST (urlencoded) to `/`, in-place success
  state, error state that offers call/text instead.
- Note: field names change from the old form (`serviceNeed` → `service`, `boatModel` →
  `boat`). The email notification is set to "Any form", so it keeps working. Old
  submissions stay in Netlify history.

## SEO and metadata

- `<title>` and meta description targeting "mobile boat repair South Florida" /
  "dockside boat mechanic".
- Canonical `https://underthesunmarine.com/`.
- Open Graph + Twitter card with a 1200×630 share image built from a real photo + logo.
- JSON-LD `LocalBusiness` with name, phone, email, locality, areaServed, sameAs
  (Instagram, TikTok), image, logo.
- `@astrojs/sitemap`, `robots.txt` pointing to it.
- Semantic headings (one h1), descriptive alt text for every photo.
- `/thanks` page is `noindex`. Custom 404 page.

## Brand icons

- `favicon.svg` (sun + waves mark), `favicon.ico` 32px fallback, `apple-touch-icon.png`
  180px, `icon-192.png` / `icon-512.png`, `site.webmanifest`, `theme-color` navy.

## Netlify config

- `netlify.toml`: build `npm run build`, publish `dist`, Node version pinned.
- Cache headers for hashed assets (`/_astro/*` immutable).
- Basic security headers (X-Content-Type-Options, Referrer-Policy).

## Verification

- `npm run build` clean.
- `astro check` clean.
- Local preview checked at 375px, 768px, 1280px in the browser pane.
- Lighthouse mobile run on the Netlify deploy preview.
- Test form submission on the deploy preview; confirm it lands under `contact` and the
  email arrives.
- Keyboard-only pass: header links, slider, lightbox, form.

## Out of scope

- Multiple pages, blog, booking/calendar, reviews widget, CMS.
- New photography or logo redesign.
- Any claims not in the safe-facts list.
