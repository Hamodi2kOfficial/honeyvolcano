# Round 2 — what changed

Branch `honey-volcano-rebuild`. Lint, typecheck and production build are clean;
the Playwright suite is **106 passed, 0 failed, 4 skipped**; every page scores
**90 or better in all four Lighthouse categories**.

The full old → new list for every text change is in
[`round2-text-changes.md`](./round2-text-changes.md) — 162 strings across six
languages.

---

## A — The hero

The film is now the whole first screen (86–94svh depending on width), with the
navigation floating over it.

**The fog is the video dissolving, not a panel laid over it.** The first
version used a masked `backdrop-filter`, which blanked every screenshot — and
anything that breaks a headless capture breaks the screenshot suite too. The
video now carries a mask that fades it out toward one edge, so what shows
through *is* the page background. Cheaper, composites cleanly, and it reads as
fog rather than as a scrim. A colour wash deepens it under the words.

The fading edge is the **left** from 1024px up and the **bottom** below that.
It was set at 768px first; at tablet portrait the text column ran straight out
of the fog and onto bright video, so it moved.

The logo sits in the fog, aligned to the navigation's own container so it lands
under the brand mark rather than near the edge.

**The seals are one line directly under the film**, pressing in as you scroll
to them — from 130% scale with a slight rotation, staggered. Six across from
1024px; below that the row scrolls sideways with snap, stays one line, and
carries `tabindex` so a keyboard can reach it.

**Icons.** lucide has no bee and no honey jar, so both were drawn to lucide's
own grammar — 24px box, no fill, 1.6 stroke, round joins — and sit beside
Leaf, Scale, ShieldCheck and HeartHandshake as one set.

| Seal | Icon |
|---|---|
| Direct from bees | bee *(drawn for this)* |
| Natural & real | leaf |
| Fair & affordable | scale |
| All bee products | honey jar *(drawn for this)* |
| Authorised in LT & IS | shield |
| Hand to hand • Heart to heart | handshake + heart |

The two flags that were on the fifth seal are gone, as the brief's icon list
asked.

**Also:** a visitor who has asked for reduced motion now gets the film's first
frame instead of a playing video.

---

## B — Products

**Removed:** the "Our products" heading, the "Prices in Icelandic króna…"
line, and the whole "500 g or 1 kg?" comparison. The orphaned
`raw-honey-sizes.webp` went with them, and the six dead strings came out of all
six languages.

**One frame for every photo — 4:5.** Before changing anything, all ten images
were cropped to 4:5 on a contact sheet and checked: every subject stays whole
and centred, so none needed re-cutting. The cards had been `aspect-square` with
`object-cover`, which was quietly slicing the top and bottom off the two
portrait jar shots.

| | What changed |
|---|---|
| **500 g** | The hex jar, cut out of its white background and composited onto the same dark set as the rest. Gold lid, visibly smaller than the 1 kg beside it. |
| **Multicoloured** | Now the original `honeybox.jpg` from the gallery, not the generated wooden box. |
| **Pollen** | A tight crop of **the owner's own photograph**, `polenandcomb.jpeg`. |

That last one is a change from the plan. The pollen image was never a
generated shot — it is the photograph of the glass cone on the Icelandic
hillside. The problem was framing, not content: the product sat small and
off-centre, so the eye went to the bee-bread jar instead. A tight crop fixes it
and keeps the real photograph. **It also saved the credits budgeted for it:
1 credit spent this round, 27 of 150 used, 123 left.**

**On bee bread:** seen side by side at card size, the complaint was fair — the
jar does read as loose pollen. It is correctly labelled, the pair is now
distinguishable (bright yellow outdoors against a dark studio jar), and its
description does the rest: *"Pollen the hive fermented into bread. Deeper,
tangier than pollen."* Regenerating the photograph to show proper dark perga
plugs is about 2 credits, on request.

**The detail view** uses the same `layoutId` morph as 21st.dev's Morphing
Dialog, rebuilt on plain `motion` — that component ships on Base UI plus three
Radix packages, and this project has none of them. Card, picture and name carry
matching ids, so opening is one continuous movement. It closes on the X, the
backdrop, Escape, or a downward swipe; focus is trapped and lands on the close
button; the page behind is locked and released. The 4:5 picture is capped at
46svh, because at full height the price and the call fell off the bottom of a
900px screen.

Flavours moved off the card into the detail view, leaving the card showing the
three things people scan for: picture, name, price.

Descriptions are one line each, written from the real product details, in all
six languages.

**Also:** the products-page logo is the transparent `logo-home.png` with its
rounded box removed, and the decorative layer genuinely falls — twelve pieces
drifting down a fixed viewport layer, four on a phone, one CSS keyframe on
transform and opacity, nothing at all under `prefers-reduced-motion`.

---

## C — Navigation

The `VolcanoMark` SVG is gone; the brand is the real logo. Every item is its
icon, opening into its word on hover or focus — a grid column from `0fr` to
`1fr`, the one way to animate a box to its natural width without measuring it
in JavaScript. The text stays in the DOM throughout, so the link keeps its
accessible name whether the word shows or not. The active page's word stays
open. On a phone, icon and label are both there from the start.

Two of the seven icons are the custom ones from the hero: the honey jar for
Products, the bee for About.

**One judgement call:** the icon stays beside the word rather than vanishing
into it. Seven anonymous icons would hurt a business whose visitors are looking
for "Where to buy", and the icon leading the word still reads as the morph.

---

## D — Less text

27 strings rewritten in each of six languages — **162 in total**, every one
listed old → new in `round2-text-changes.md`. Headings are 2–6 words,
supporting lines at most 12. None of the banned words ("elevate", "discover",
"unleash", "seamless", "journey", "crafted") appear anywhere on the site in any
language; a search confirmed it.

**Not touched**, as instructed: the About page text in every language, the
stamp wording, the shop-page lines, the business details and the privacy
policy's substance.

**Call to taste** was added where it was missing: the gallery (a full-screen
slideshow that never scrolls, so the sticky bar never appeared there) and the
end of the values section.

**Text animation** is two styles, consistently applied: `RevealWords` for every
headline, `Reveal` for everything else. `RevealWords` was reworked to keep
explicit line breaks, which is what finally let the two-line section headings
use the same treatment as the rest instead of needing their own. Its per-word
blur was dropped — a paint on every frame, against this round's
transform-and-opacity rule.

---

## E — Motion that works together

`lib/motion.ts` is the single system: one house easing, five durations, three
staggers, three travel distances, and a stated hierarchy of
background → content → action. Everything else imports from it.

`components/ui/scroll-motion.tsx` holds the scroll-linked pieces, adapted from
a 21st.dev scroll-reveal pattern with one change: the original drives `width`
and `borderRadius`, which are layout and paint on every frame of a scroll.
These drive transform and opacity only.

- **`Parallax`** — the picture drifts against the words beside it
- **`ScrollZoom`** — the picture settles out of a slight zoom; scale only, so the frame never reflows
- **`MaskReveal`** — a clip-path wipe, once per element
- **`SectionTint`** — a warm wash rising and falling as a section passes, so the page changes colour between sections instead of switching at a hard edge

Raw spring smoothing sits between the scroll position and the motion, so
Lenis's easing and these do not fight.

**A bug worth recording:** the first `MaskReveal` watched the element it was
clipping. An element clipped to nothing cannot reliably report itself visible,
so the wipe stayed shut forever and the images never loaded. The clip now goes
on an inner element and the observer watches the uncropped wrapper.

---

## F — About Us

The Icelandic, Spanish and Russian texts are the owner's own, used exactly as
supplied, with only the clean-ups he listed:

- Translator notes in brackets removed; the Icelandic product reads
  **"býflugnabrauð (bee bread)"**
- **"(Skoða vöruúrval)"** and **"(Подробнее...)"** are now buttons to the
  Products page, and Spanish has the same button as **"Ver productos"**
- **"LEYFÐU GLEÐINNI AÐ GÓSA!"** corrected to **"GJÓSA"**
- The decorative trailing emoji were dropped from the value cards — the cards
  draw their own icons, and in the source the emoji sat against the wrong lines

Spanish and Russian give the six values as names only, so those cards are the
name alone rather than a name over an empty paragraph.

**Two things left exactly as written, which you may want to change:** the
Russian has **"изпробовал"** (for "испробовал") and **"что-то простого"** (for
"чего-то простого"). Both are in the supplied text, and the brief said to use
it as written and to ask before touching a typo.

---

## G — Testing

| | Result |
|---|---|
| Lint | clean |
| Typecheck | clean |
| Production build | clean, 12 static pages |
| Playwright | **106 passed, 0 failed, 4 skipped** |
| Screenshots | 7 widths × 2 themes × 8 pages |

**Lighthouse, desktop preset, against the exported site:**

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| / | 97 | 96 | 96 | 100 |
| /products/ | 97 | 98 | 96 | 100 |
| /about/ | 98 | 100 | 96 | 100 |
| /where-to-buy/ | 97 | 100 | 96 | 100 |
| /contact/ | 99 | 100 | 96 | 100 |
| /gallery/ | 94 | 96 | 96 | 100 |
| /privacy/ | 99 | 100 | 96 | 100 |

The first run scored **52** for performance. That was the test server, not the
site: `scripts/serve-out.js` ignored Range requests, so the browser fetched the
6 MB hero video six times over, and it served text uncompressed where Netlify
sends gzip. The server now supports both, which also makes the Playwright suite
honest about what a visitor loads. With that fixed the same page scores 97.

Best practices sits at 96 on every page because `/api/track` and `/api/content`
404 locally — those are Netlify Functions that do not exist in a static export.
They resolve on the deployed site.

### Three real bugs found while testing

1. **The theme did not survive a reload.** Choose dark, refresh, and you were
   back in light. React owns `className` on `<html>`, and the prerendered value
   has no theme in it — a static export cannot know one — so hydration wrote
   its own className back and wiped the class the pre-paint script had set.
   `suppressHydrationWarning` silences the complaint but does not stop the
   patch. The choice is now re-asserted in the same commit React hydrates in,
   so nothing flashes.
2. **"Call to taste" could not be activated by voice.** The button reads "Call
   to taste" but its accessible name was "Call Honey Volcano at +354 834 0999",
   which fails WCAG 2.5.3 (Label in Name): someone driving the page by voice
   could read the button aloud and have nothing happen. Every call control's
   name now opens with the words on it. Same fix for the language switcher.
3. **The business-details list was not a valid description list.** A `<dl>` may
   wrap each pair in one `<div>`, and that div may hold only `dt` and `dd`;
   there were two levels of wrapper with the icon between them. The icon moved
   inside the term. Contact's accessibility went 93 → 100.

A fourth, smaller one: several tests were racing hydration — clicking before
React had attached a handler, and passing or failing by luck. `<html>` now
carries `data-hv-ready` once hydration is done, and the tests that interact
wait for it.

### The suite

Updated for the new behaviour, not loosened:

- the seals are one line under the film, all six, each with an icon
- a product opens, shows its line and price, and closes on Escape and on the X,
  releasing the page behind it
- flavours live in the opened product and switch the picture
- every product picture fills the same 4:5 frame
- the cut sections are gone — the comparison, the heading and the price line
- the seals arrive on scroll and end fully readable

---

## Still outstanding

- **`public/reliable-source.mp4` is 6.4 MB with no poster frame.** It is the
  largest thing on the site by far. There is no ffmpeg on this machine, so it
  cannot be compressed or have a frame extracted here.
- The video carries a large branded logo card partway through; when that frame
  is on screen it sits beside the page's own logo.
- **Spanish and Russian still need a native reader** outside the About page,
  which is now the owner's own text.
- Four stockists have no map pin until someone supplies a street address.
- **After any deploy the owner must open `/admin` and publish once**, or his
  previously published section layout keeps the new home-page sections hidden.
- The pull request has never been opened.
