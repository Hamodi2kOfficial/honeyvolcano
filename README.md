# Honey Volcano — Raw Honey & Bee Products

Website for **Honey Volcano** ([honeyvolcano.com](https://honeyvolcano.com)): raw Lithuanian
honey and every other bee product, sold in Iceland by Jordanas Golovinas.

There is no online checkout, by design. The whole site points at one action —
**Call to taste, +354 834 0999** — and every call button is a real `tel:` link
with the country code, so one tap opens the dialer.

## What is here

| Page | Path |
|---|---|
| Home | `/` |
| Products | `/products/` |
| Where to buy (map of stockists) | `/where-to-buy/` |
| About Honey Volcano | `/about/` |
| Contact information | `/contact/` |
| Gallery | `/gallery/` |
| Privacy Policy | `/privacy/` |
| Under construction | `/under-construction/` |
| Owner's dashboard | `/admin/` — see [docs/ADMIN.md](docs/ADMIN.md) |

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, tokens in `app/globals.css` |
| Animation | `motion` (Framer Motion), Lenis smooth scroll, CSS keyframes |
| Map | Leaflet + OpenStreetMap, CARTO basemaps (no API key) |
| Tests | Playwright |
| Output | Static export (`output: "export"`) → Netlify |

## Getting started

Requires **Node 20+**.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
npm test         # Playwright, against ./out
```

`npm test` builds nothing itself — run `npm run build` first. It serves `out/`
with `scripts/serve-out.js`, so the suite exercises the same files Netlify
publishes. `npm run test:screens` writes screenshots of every page at 360, 390,
768, 1024, 1440 and 1920px in both themes into `test-results/screenshots/`.

## Colour and theme

Every colour comes from the logo: the near-black label ground, the copper
hexagon, the gold lettering, and the bee's Lithuanian stripes (its green and
red become `--success` and `--error`). Both themes are defined in
`app/globals.css`; light-mode values are darkened until they clear WCAG AA
against the cream paper background.

The theme follows the system preference until the visitor presses the toggle in
the navigation bar, after which their choice is remembered. `components/theme.tsx`
holds the `<html class="dark">` switch and the inline script that applies it
before the first paint, so there is no flash of the wrong colours.

**Use the tokens, not hex values** — `bg-background`, `text-foreground`,
`text-accent`, `border-border`, `text-on-accent`, and so on. A raw hex in a
component is a light-mode bug waiting to happen.

## Content the owner edits

`content/*.json` holds the starting content, and `/admin` publishes changes into
Netlify Blobs, which win over the files at runtime (`components/live-content.tsx`).

**After a deploy that adds or reorders home-page sections, the owner must open
`/admin` and publish once**, or their previously published layout will keep
hiding the new sections.

Shop locations are the exception: they live in `data/stores.ts`, not the
dashboard. Each entry records how precisely we know the address (`exact`,
`street` or `town`) and only the first two get a pin — a town-centre pin for a
shop that could be anywhere in that town is a wrong pin. Opening hours are
filled in only where they were verified; everything else says "please check with
the store". Never invent either.

## Languages

Six: English, Lithuanian, Icelandic, Spanish, Russian, Polish. English is the
source dictionary (`lib/locales/en.ts`) and the others mirror its shape, so the
compiler asks for a new key in all six.

**Spanish and Russian are temporary translations and are marked as such at the
top of their files — they need a native reader before launch.**

## The contact form

`components/site/contact-form.tsx` posts to `netlify/functions/lead.mjs`, which
stores the message in Netlify Blobs where the owner reads it at `/admin`. It has
a honeypot field and a per-sender rate limit (5 messages per 10 minutes, keyed
by a salted hash of the IP, never the address itself).

**Messages are not emailed anywhere yet.** To forward them to
`golovinasjordanas@gmail.com`, add an email service and one call in
`lead.mjs`, right after the message is stored:

```js
// after: await store.setJSON(lead.id, lead);
if (process.env.RESEND_API_KEY) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Honey Volcano <noreply@honeyvolcano.com>",
      to: "golovinasjordanas@gmail.com",
      reply_to: lead.email || undefined,
      subject: `New enquiry from ${lead.name}`,
      text: `${lead.name}\n${lead.email}\n${lead.phone}\n\n${lead.message}\n\n— ${lead.source}`,
    }),
  }).catch(() => {}); // a failed email must never lose the message
}
```

Set `RESEND_API_KEY` in Netlify's environment variables. Keep it out of the
repository, and keep the `.catch` — the dashboard copy is the record of truth.

## Environment variables (Netlify)

| Variable | What it does |
|---|---|
| `ADMIN_PASSWORD` | Turns on publishing from `/admin`. Without it the dashboard runs browser-only. |
| `RESEND_API_KEY` | Optional, and not wired up yet — see above. |

## Deployment (Netlify)

`netlify.toml` sets the build command (`npm run build`) and publish directory
(`out`), so no manual configuration is needed. `trailingSlash` is on, which is
why `/products/` resolves to `out/products/index.html`, and the exported
`404.html` is served automatically.

Point the `honeyvolcano.com` domain at the Netlify site under **Domain settings**.

After changing the page titles, ask Google to re-crawl the site in **Google
Search Console → URL Inspection → Request indexing**, one URL at a time, and
submit the sitemap. The old title can linger in search results for days either way.

## Known gaps

- `public/reliable-source.mp4` is **6.4 MB and has no poster frame**. Compressing
  it (HandBrake or `ffmpeg -crf 28 -vf scale=1280:-2`) is the single biggest
  win left for load time on the home page.
- Four stockists have no pin and no verified address; see the notes in
  `data/stores.ts`.
- The Privacy Policy is a template written for the owner to review. It is not
  legal advice.
