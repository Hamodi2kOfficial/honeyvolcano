# Honey Volcano — Owner's Guide (Admin)

The dashboard lets you edit the website yourself. It lives at **`/admin`**
(e.g. `https://honeyvolcano.com/admin`). No developer needed.

## How it works (plain language)

Your editable content lives as files in your GitHub repository
(`content/products.json`, `content/site.json`). When you save in the dashboard,
it writes those files to GitHub, and Netlify automatically rebuilds the site.
**Your changes appear live in about 1–2 minutes.** Because it's all in GitHub,
you also get free version history — every change is recorded and can be undone.

## One-time setup: get your access token

The dashboard signs you in with a GitHub token (so only you can edit).

1. Sign in to GitHub (the account that owns the `honeyvolcano` repository).
2. Go to **Settings → Developer settings → Fine-grained tokens → Generate new token**.
3. **Token name:** anything, e.g. "Honey Volcano admin". **Expiration:** your choice (e.g. 1 year).
4. **Repository access → Only select repositories →** choose **honeyvolcano**.
5. **Permissions → Repository permissions → Contents → Read and write.**
6. Click **Generate token** and **copy it** (you won't see it again).
7. Open `/admin`, paste the token, and click **Sign in**.

The token is stored only in your browser. To sign out, click **Log out** (this
removes the token from that browser). On a new device, sign in again.

> Keep the token private — anyone who has it can edit the site. If it ever leaks,
> delete it in GitHub (Developer settings) and generate a new one.

## What you can edit today

- **Products** — add, remove, reorder, rename, set the price in ISK, or mark a
  price as "TBA" (to be announced). Shown on the products / "Call to taste" page.
- **Contact & business note** — the phone number on the taste button, the phone
  and email in the footer, and the B2B discount note on the products page.

Click **Save** in a section; a "Saved ✓" message confirms it. Use **View site**
to open the live site in a new tab (refresh after ~1–2 minutes to see changes).

## What's not built yet (planned)

This is Phase 1 of the larger plan. Still to come: editing the home-page
sections/text and images, a media library, orders, inventory, customers, the
tasting pipeline, discounts/marketing, analytics, and multi-language editing.

## Things only you can provide (for later phases)

- Payment provider account/keys (e.g. Stripe/Teya/Rapyd) — for online orders.
- Email provider (e.g. Resend/Brevo) — for customer emails/newsletter.
- Exact Icelandic VAT rate for food products — for invoices.
- Legal texts (privacy policy, terms, cookie notice).
- Any domain/email DNS changes.
