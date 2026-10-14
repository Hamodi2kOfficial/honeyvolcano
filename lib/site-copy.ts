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
    text: [{ key: "hero.tagline", label: "Tagline under the logo" }],
    assets: [
      { key: "hero.logo", label: "Logo", kind: "image", fallback: "/logo-home.png" },
      {
        key: "hero.backdrop",
        label: "Background photo",
        kind: "image",
        fallback: "/honeycomb.jpg",
        hint: "Fills the whole first screen — use a wide, dark photo.",
      },
    ],
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
      { key: "footer.rights", label: "Footer — rights line" },
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
    hint: "The links at the top of every page.",
    content: {
      text: [
        { key: "nav.gallery", label: "Gallery link" },
        { key: "nav.cta", label: "Top-right button" },
        { key: "products.call", label: "“Call to taste” button" },
        { key: "products.back", label: "“Back to home” link" },
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
