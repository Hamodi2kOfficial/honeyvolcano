# Honey Volcano — Owner's Guide

Your website has its own manager at **`/admin`** (e.g.
`https://honeyvolcano.com/admin`). One sign-in, no accounts to create, no
developer tools, nothing technical.

**Sign in:** with the site's own password once live publishing is switched on
(see *Publishing* below) — or with `admin` / `admin` while it is not, in which
case the dashboard saves your work in your browser without touching the live
site. The sign-in screen always tells you which of the two you are in.

## What you can do

### Home page

The home page is a stack of sections, top to bottom. You decide what is in it
and in which order.

- **Move** anything up or down with the arrows.
- **Hide** a section with the eye — it stays here, visitors just don't see it.
- **Add a section** — pick from:

| Section | What it is |
|---|---|
| **Text** | A heading with a paragraph. |
| **Picture + text** | A photo on one side, words and a button on the other. |
| **Pictures** | A grid, or a sliding row, of photos. |
| **Cards** | 2–4 cards with a picture, a title and a short text. |
| **Quote** | One large sentence with who said it. |
| **Reviews** | What customers say, with stars. |
| **Call to action** | A bold band with a heading and one or two buttons. |
| **Numbers** | Three or four figures you are proud of. |
| **Gold ribbon** | A thin scrolling strip of words. |
| **Video** | A film with a heading and a caption. |

- **Preview** (top right of the Home page tab) shows the page exactly as
  visitors will see it — the same components draw both.

**Designed sections** (hero, the film, "Reliable source", the four promises,
the beekeeper letter, the product pictures, the waitlist footer) carry a gold
*Designed* label. You can move them, hide them, and switch the "under
construction" plate on or off. Their words live in the translation files so all
six languages stay in step — that is why there is no text box for them. New
sections you add are written by you, in English.

### Pictures

- **Gallery slideshow** — the pictures at `/gallery`: reorder them, write the
  gold phrase that appears above a photo, describe each picture for search
  engines, remove what you don't want.
- **Picture library** — every photo you can use anywhere on the site. Upload
  from your phone or computer (photos are automatically shrunk to a sensible
  size), or paste a link. Upload once, then pick it in any section.

### Products & Contact

Names, prices in ISK, display order, "price TBA", plus the phone number on the
taste button, the footer phone and email, and the B2B discount note.

### Backup & publish

Everything you arrange is **saved in this browser automatically** — there is no
Save button to forget.

- **Download a backup** — one file with the whole site. Keep it safe; it can be
  loaded back here, or on another computer or phone.
- **The four content files** (`home.json`, `gallery.json`, `products.json`,
  `site.json`) — these are what the public website is built from. Download them
  and send them over, and the next deploy puts your page live.
- **Reset everything** — throws away your changes and returns to the site as it
  is published today.

## Publishing

Everything you arrange is **saved in this browser automatically** — there is no
Save button to forget. When you are happy, press **Publish changes** (top right,
or in the Publishing tab) and the website updates within seconds: home page,
pictures, prices, contact details, everything.

- A gold banner says when you have changes visitors cannot see yet.
- **Load the live version** throws away your unpublished edits and brings back
  exactly what the site is showing.
- **Download a backup** keeps a copy of everything in one file, which can be
  loaded back here or on another device.

Pictures you upload are stored on the website itself, so they load fast and
work for everyone — not just on your own phone.

### Switching publishing on (one time, by the site owner)

Live publishing needs one password of its own, kept in Netlify and never in the
code:

1. Netlify → the honeyvolcano site → **Site configuration → Environment variables**.
2. Add `ADMIN_PASSWORD` and set it to the password you want to use for /admin.
3. **Deploys → Trigger deploy → Deploy site**, then sign in at /admin with that password.

Until that variable exists, the dashboard still works, but in browser-only mode:
it signs in with `admin` / `admin`, saves your work in your browser, and the
live site is not touched. The Publishing tab shows these same steps.

### How it works, in one paragraph

The website is static — fast, cheap, always up. The content you publish is kept
in Netlify Blobs (free, included), and every page asks for it as it loads, so a
change is live without rebuilding anything. If that service were ever
unavailable, visitors simply see the version the site was built with: the page
never breaks.

## Things only you can provide (for later)

- Payment provider (e.g. Stripe/Teya/Rapyd) — for online orders.
- Email provider (e.g. Resend/Brevo) — for customer emails.
- Icelandic VAT rate for food products — for invoices.
- Legal texts (privacy policy, terms, cookie notice).
- Translations, if you want new sections to appear in all six languages.
