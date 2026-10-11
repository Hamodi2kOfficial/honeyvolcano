# Honey Volcano — Owner's Guide

Your website has its own manager at **`/admin`** (e.g.
`https://honeyvolcano.com/admin`). One sign-in, no accounts to create, no
developer tools, nothing technical.

**Sign in:** username `admin`, password `admin`.

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

## The one honest limitation

Your changes live in your browser until those files reach the website. There is
no "publish" button yet, because publishing needs somewhere for the site to
store content. Two ways to get it, whenever you want:

1. **A small free helper on Netlify** (Netlify Functions + Blobs) — adds a real
   Publish button to this dashboard. No GitHub, no database, free.
2. **Supabase** (free tier) — needed anyway for online orders, stock and
   customers; publishing comes with it.

Until then: Backup & publish → download → send the files.

> **About the password.** `admin`/`admin` is a simple door, and this dashboard
> cannot publish anything on its own, so a stranger finding it could only
> rearrange a copy in their own browser. Before publishing is switched on, the
> password must be replaced with a proper one.

## Things only you can provide (for later)

- Netlify or Supabase account — for the Publish button.
- Payment provider (e.g. Stripe/Teya/Rapyd) — for online orders.
- Email provider (e.g. Resend/Brevo) — for customer emails.
- Icelandic VAT rate for food products — for invoices.
- Legal texts (privacy policy, terms, cookie notice).
- Translations, if you want new sections to appear in all six languages.
