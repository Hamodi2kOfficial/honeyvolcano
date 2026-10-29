/**
 * Every word and every picture of the designed sections, described once.
 *
 * The site's own copy lives in components/i18n.tsx in six languages. The owner
 * can now overwrite any of it from the dashboard, one language at a time: an
 * override replaces that text in that language only, so the five professional
 * translations are never silently lost. Pictures work the same way — an
 * override replaces the file the component ships with.
 *
 * Keys are the path into the translation dictionary ("hero.tagline"), so a
 * field added here is editable the moment it is listed.
 */
import type { BuiltinKind } from "@/lib/home-model";

export type TextField = {
  /** Path into the translation dictionary, e.g. "values.t1". */
  key: string;
  label: string;
  /** Rows for a multi-line box; omit for a single-line input. */
  lines?: number;
  hint?: string;
};

export type AssetField = {
  /** Our own name for the slot, e.g. "hero.logo". */
  key: string;
  label: string;
  kind: "image" | "video";
  /** What the site ships with, shown when nothing has been chosen. */
  fallback: string;
  hint?: string;
};

export type ContentGroup = {
  text: TextField[];
  assets: AssetField[];
};

/** The designed home-page sections, in the order they appear on the page. */
export const BUILTIN_CONTENT: Record<BuiltinKind, ContentGroup> = {
  hero: {
    text: [
      { key: "hero.tagline", label: "Tagline under the logo" },
      { key: "hero.lead", label: "Line under the film", lines: 2 },
      { key: "stamps.s1", label: "Seal 1" },
      { key: "stamps.s2", label: "Seal 2" },
      { key: "stamps.s3", label: "Seal 3" },
      { key: "stamps.s4", label: "Seal 4" },
      { key: "stamps.s5", label: "Seal 5" },
      { key: "stamps.s6", label: "Seal 6" },
    ],
    assets: [
      { key: "hero.logo", label: "Logo", kind: "image", fallback: "/logo-home.png" },
      {
        key: "video.file",
        label: "The film in the hero",
        kind: "video",
        fallback: "/reliable-source.mp4",
        hint: "An .mp4 file. Keep it short — it loads for every visitor.",
      },
    ],
  },
  rawAndBee: {
    text: [
      { key: "home.rawEyebrow", label: "Small line above the heading" },
      { key: "home.rawHeading", label: "Heading", lines: 2 },
      { key: "home.rawBody", label: "Paragraph", lines: 4 },
      { key: "home.rawP1t", label: "Reason 1 — title" },
      { key: "home.rawP1d", label: "Reason 1 — text", lines: 2 },
      { key: "home.rawP2t", label: "Reason 2 — title" },
      { key: "home.rawP2d", label: "Reason 2 — text", lines: 2 },
      { key: "home.rawP3t", label: "Reason 3 — title" },
      { key: "home.rawP3d", label: "Reason 3 — text", lines: 2 },
    ],
    assets: [
      {
        key: "rawAndBee.image",
        label: "Picture",
        kind: "image",
        fallback: "/sections/all-bee-products.webp",
      },
    ],
  },
  featured: {
    text: [
      { key: "home.featEyebrow", label: "Small line above the heading" },
      { key: "home.featHeading", label: "Heading" },
      { key: "home.featBody", label: "Paragraph", lines: 3 },
      { key: "home.featAll", label: "“See all products” link" },
    ],
    assets: [],
  },
  story1: {
    text: [
      { key: "home.s1Eyebrow", label: "Small line above the heading" },
      { key: "home.s1Heading", label: "Heading", lines: 2 },
      { key: "home.s1Body", label: "Paragraph", lines: 3 },
    ],
    assets: [
      { key: "story1.image", label: "Picture", kind: "image", fallback: "/gallery/3faces.jpg" },
    ],
  },
  story2: {
    text: [
      { key: "home.s2Eyebrow", label: "Small line above the heading" },
      { key: "home.s2Heading", label: "Heading", lines: 2 },
      { key: "home.s2Body", label: "Paragraph", lines: 3 },
    ],
    assets: [
      {
        key: "story2.image",
        label: "Picture",
        kind: "image",
        fallback: "/sections/hand-to-hand.webp",
      },
    ],
  },
  story3: {
    text: [
      { key: "home.s3Eyebrow", label: "Small line above the heading" },
      { key: "home.s3Heading", label: "Heading", lines: 2 },
      { key: "home.s3Body", label: "Paragraph", lines: 3 },
    ],
    assets: [
      {
        key: "story3.image",
        label: "Picture",
        kind: "image",
        fallback: "/sections/breakfast.webp",
      },
    ],
  },
  construction: {
    text: [
      { key: "uc.label", label: "Plate label" },
      { key: "home.ucHeading", label: "Heading" },
      { key: "home.ucBody", label: "Text under the heading", lines: 2 },
      { key: "uc.more", label: "Button" },
    ],
    assets: [],
  },
  video: {
    text: [{ key: "video.button", label: "Button under the film" }],
    assets: [
      {
        key: "video.file",
        label: "The film",
        kind: "video",
        fallback: "/reliable-source.mp4",
        hint: "An .mp4 file. Keep it short — it loads for every visitor.",
      },
    ],
  },
  trust: {
    text: [
      { key: "trust.heading", label: "Heading", lines: 2, hint: "Each line break starts a new line on the page." },
      { key: "trust.authorized", label: "Label above the flags" },
    ],
    assets: [{ key: "trust.image", label: "Photo", kind: "image", fallback: "/trust-jar.jpg" }],
  },
  values: {
    text: [
      { key: "values.eyebrow", label: "Small line above the heading" },
      { key: "values.heading", label: "Heading", lines: 2 },
      { key: "values.lead", label: "Opening paragraph", lines: 4 },
      { key: "values.t1", label: "Promise 1 — title" },
      { key: "values.d1", label: "Promise 1 — text", lines: 2 },
      { key: "values.t2", label: "Promise 2 — title" },
      { key: "values.d2", label: "Promise 2 — text", lines: 2 },
      { key: "values.t3", label: "Promise 3 — title" },
      { key: "values.d3", label: "Promise 3 — text", lines: 2 },
      { key: "values.t4", label: "Promise 4 — title" },
      { key: "values.d4", label: "Promise 4 — text", lines: 2 },
      { key: "values.vision", label: "Closing promise", lines: 2 },
    ],
    assets: [],
  },
  letter: {
    text: [
      { key: "letter.eyebrow", label: "Small line above the heading" },
      { key: "letter.heading", label: "Heading", lines: 2 },
      { key: "letter.p1", label: "Paragraph 1", lines: 3 },
      { key: "letter.p2", label: "Paragraph 2", lines: 3 },
      { key: "letter.p3", label: "Paragraph 3", lines: 3 },
      { key: "letter.signature", label: "Signature" },
    ],
    assets: [],
  },
  showcase: {
    text: [
      { key: "product.heading", label: "Heading" },
      { key: "product.f1t", label: "Phrase 1" },
      { key: "product.f2t", label: "Phrase 2" },
      { key: "product.f3t", label: "Phrase 3" },
    ],
    assets: [
      { key: "showcase.jar", label: "Jar picture", kind: "image", fallback: "/product-jar-cut.png", hint: "Works best as a cut-out with a transparent background (PNG)." },
    ],
  },
  cta: {
    text: [
      { key: "cta.heading", label: "Heading" },
      { key: "cta.subtitle", label: "Text under the heading", lines: 2 },
      { key: "cta.call", label: "Call button label" },
    ],
    assets: [],
  },
};

/** Text that is not part of a home-page section: menus, the products page… */
export const PAGE_GROUPS: {
  id: string;
  label: string;
  hint: string;
  content: ContentGroup;
}[] = [
  {
    id: "nav",
    label: "Menu & buttons",
    hint: "The links at the top of every page, and the footer.",
    content: {
      text: [
        { key: "nav.home", label: "Home link" },
        { key: "nav.products", label: "Products link" },
        { key: "nav.stores", label: "“Where to buy” link" },
        { key: "nav.about", label: "About link" },
        { key: "nav.best", label: "“What's best for me?” link" },
        { key: "nav.bestSoon", label: "“What's best for me?” tooltip" },
        { key: "nav.contact", label: "Contact link" },
        { key: "nav.gallery", label: "Gallery link" },
        { key: "cta.call", label: "“Call to taste” button" },
        { key: "footer.tagline", label: "Footer — tagline" },
        { key: "footer.made", label: "Footer — line under the tagline" },
        { key: "footer.rights", label: "Footer — rights line" },
      ],
      assets: [],
    },
  },
  {
    id: "products",
    label: "Products page",
    hint: "honeyvolcano.com/products — the catalogue and the taste request.",
    content: {
      text: [
        { key: "products.badge", label: "Gold badge", hint: "Currently “Coming Soon”. Leave empty to hide it." },
        { key: "products.title", label: "Heading", lines: 2 },
        { key: "products.subtitle", label: "Text under the heading", lines: 3 },
        { key: "products.tasteEyebrow", label: "Taste block — small line" },
        { key: "products.tasteHeading", label: "Taste block — heading" },
        { key: "products.tasteBody", label: "Taste block — text", lines: 3 },
        { key: "products.tasteNote", label: "Taste block — note under the button" },
      ],
      assets: [
        { key: "products.logo", label: "Logo on the products page", kind: "image", fallback: "/logo-full.png" },
      ],
    },
  },
  {
    id: "uc",
    label: "“Under construction” plate",
    hint: "Shown over any section you mark as still being worked on.",
    content: {
      text: [
        { key: "uc.label", label: "Plate label" },
        { key: "uc.soon", label: "Second line" },
      ],
      assets: [],
    },
  },
];

/** Flattened list of every editable text key, for counting progress. */
export function allTextKeys(): string[] {
  const keys = Object.values(BUILTIN_CONTENT).flatMap((g) => g.text.map((f) => f.key));
  const pageKeys = PAGE_GROUPS.flatMap((g) => g.content.text.map((f) => f.key));
  return [...keys, ...pageKeys];
}

/** Applies the owner's text overrides on top of a translation dictionary. */
export function applyCopyOverrides<T extends Record<string, Record<string, string>>>(
  dictionary: T,
  overrides: Record<string, string> | undefined
): T {
  if (!overrides) return dictionary;
  let result: T | null = null;
  for (const [path, value] of Object.entries(overrides)) {
    if (typeof value !== "string" || value.trim() === "") continue;
    const [group, field] = path.split(".");
    if (!group || !field) continue;
    const base = (dictionary as Record<string, Record<string, string>>)[group];
    if (!base || !(field in base)) continue;
    // Copy lazily: untouched sites keep the original object entirely.
    result ??= { ...dictionary } as T;
    const target = result as unknown as Record<string, Record<string, string>>;
    if (target[group] === base) target[group] = { ...base };
    target[group][field] = value;
  }
  return result ?? dictionary;
}
