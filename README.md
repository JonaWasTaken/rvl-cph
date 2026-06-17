# RVL-CPH

Marketing site for **RVL-CPH** — the eco consultancy and event management practice of
Rikke Vinkel Lundsgaard (Rikke Lundsgaard) in Copenhagen.

> Sustainable strategy. Meaningful events. Real-world impact.

It's a single-page, dependency-free static site (HTML, CSS, vanilla JS). No build step,
no framework — it deploys to any static host as-is.

## Structure

```
index.html          # the whole page (Home / About / Services / Projects / Contact)
styles.css          # design system + layout (CSS custom properties at the top)
script.js           # nav, scroll reveal, scrollspy, mobile menu, contact form
site.webmanifest    # PWA manifest
robots.txt          # crawler directives
sitemap.xml         # single-URL sitemap
assets/
  logo.png             # RVL-CPH circular emblem (nav badge)
  rikke-lundsgaard.jpg # portrait used in the About section
  favicon.svg          # primary icon (scalable)
  apple-touch-icon.png # iOS home-screen icon (180×180)
  icon-192.png         # PWA icon
  icon-512.png         # PWA icon (maskable)
  og-image.png         # social share card (1200×630)
  og-image.svg         # editable vector source for the share card
.claude/            # local preview tooling only — NOT part of the deployed site
```

## Run locally

Any static server works. A tiny one is included:

```bash
node .claude/server.js      # serves on http://localhost:4321
# or
python3 -m http.server 4321 # from this directory
```

## Design

- **Palette** — warm off-white (`--paper`), sage, verdigris/patina green, deep forest, muted beige. Defined as CSS variables in `:root` at the top of `styles.css`.
- **Type** — Schibsted Grotesk (headings + UI) and Newsreader (body prose), via Google Fonts.
- **Signature** — topographic contour linework (hero backdrop, section separators, portrait panel), evoking maps/strategy and nature without sustainability clichés.
- Accessible by default: WCAG-AA contrast, visible focus, keyboard-operable menu, labelled
  form errors, and `prefers-reduced-motion` support.

## Placeholders to replace before launch

Nothing about real clients, awards, or credentials was invented. Fill these in when ready:

1. **Portrait** — the About section now uses `assets/rikke-lundsgaard.jpg`. To update it,
   replace that file (any portrait-ish crop works; it's shown in a 4:5 frame).
2. **About credentials** — the "Background & credentials → Detailed profile to be added" row,
   and the "Selected clients and case studies available on request." line.
3. **Projects** — "Selected Work & Focus Areas" lists focus areas; add real case studies when
   available.
4. **Contact form** — sends through [FormSubmit](https://formsubmit.co) to
   **rvlcopenhagen@gmail.com**. No account, key, or login. One-time activation: the first
   submission triggers a "Confirm your email" message from FormSubmit to that inbox — click
   the link once and all future submissions are delivered automatically. (Send one test
   message yourself after deploying to trigger and confirm it.) If a submission ever fails
   to reach the service, it falls back to opening the visitor's email app.
5. **Email / domain** — `rvlcopenhagen@gmail.com` (displayed email + form delivery) and
   `https://rvl-cph.dk/` (site domain, in canonical/sitemap/robots) appear across
   `index.html`, the footer, and structured data. Update if these change.

## SEO

Title, meta description, canonical, Open Graph + Twitter cards, JSON-LD
(`ProfessionalService` + `Person` + `WebSite`), `robots.txt`, and `sitemap.xml` are all in
place and target: RVL-CPH, Rikke Lundsgaard, eco consultant Copenhagen, sustainable event
manager Copenhagen, sustainability consultant Denmark, organic transformation consultant.
After deploying, submit `sitemap.xml` in Google Search Console and keep `<lastmod>` current.

## Deploy

Upload the repository root (excluding `.claude/`) to any static host — Vercel, Netlify,
Cloudflare Pages, GitHub Pages, or plain object storage. No configuration required.
