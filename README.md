# Honey Volcano — Raw Forest Honey

Marketing website for **Honey Volcano** ([honeyvolcano.com](https://honeyvolcano.com)) — a premium raw forest honey brand. A dark, cinematic single-page landing site plus a "Coming Soon" products page, built to scale into a Shopify storefront (Phase 2).

## Highlights

- **Cinematic dark experience** — deep-black/gold aesthetic, smooth (Lenis) scrolling, Framer Motion reveals, and an interactive honeycomb canvas that lights up around the cursor (on the products page).
- **6 languages** — English, Lithuanian, Icelandic, Spanish, Russian, Polish — via a lightweight in-app i18n context with a flag dropdown (`components/i18n.tsx`, `components/site/controls.tsx`). Choice persists in `localStorage`.
- **Dark mode only** (no light theme).
- **Signature CTA** — the "Taste the Volcano" honey-drip button (`components/ui/honey-cta.tsx`).
- **Trust / values section** addressing honey authenticity, and a creative **`/products` Coming Soon** page with a "Request a taste" form.
- **Static export** — ships as plain HTML/CSS/JS, hostable anywhere (currently Netlify).

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion (`motion`), GSAP (ScrollTrigger), Lenis smooth scroll |
| Output | Static export (`output: "export"`) |

## Getting started

Requires **Node 20+**.

```bash
npm install
npm run dev      # http://localhost:3000
```

### Build (static export)

```bash
npm run build    # generates the static site in ./out
```

The entry point is `out/index.html`; the products page is `out/products/index.html`.

## Project structure

```
app/
  layout.tsx          # fonts, providers, forced dark mode
  page.tsx            # home page (section composition)
  products/page.tsx   # Coming Soon + taste request
  globals.css         # brand tokens (dark), fonts, keyframes
components/
  i18n.tsx            # 6-language dictionary + provider
  smooth-scroll.tsx   # Lenis
  site/               # Navbar, Hero, Story, Values, HoneyBand, Letter,
                      # ProductShowcase, FooterCta, Marquee, controls,
                      # under-construction
  ui/                 # honey-cta, honeycomb-canvas, aurora-background,
                      # origin-button, input, hero-scrub
lib/                  # utils (cn), motion easing
public/               # brand imagery + logo-gold.png
scripts/              # one-off image helpers (logo keying)
```

## Deployment (Netlify)

The repo includes `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"
[build.environment]
  NODE_VERSION = "20"
```

In Netlify: **New site from Git → pick this repo**. The build command (`npm run build`) and publish directory (`out`) are picked up from `netlify.toml`, so no manual config is needed. Because it's a static export, no serverless/SSR runtime is involved. `trailingSlash` is enabled, so `/products/` resolves to `out/products/index.html`, and the exported `404.html` is served automatically.

Point the `honeyvolcano.com` domain at the Netlify site under **Domain settings**.

## Notes / roadmap

- **Forms are front-end only for now.** The newsletter and "Request a taste" forms validate and confirm in the browser but don't yet persist anywhere — they'll be wired to email capture / Shopify in Phase 2.
- **Some sections are intentionally hidden** behind an "Under Construction" blur (`components/site/under-construction.tsx`) while the copy is finalised with the client. Un-wrap them in `app/page.tsx` to reveal.
- **Phase 2:** scale into a Shopify storefront (headless via the Storefront API) once store access is granted.
