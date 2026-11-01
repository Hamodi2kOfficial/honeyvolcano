/**
 * The dashboard's workspace.
 *
 * One sign-in (username + password), no GitHub, no database. Everything the
 * owner arranges — the home page, the gallery, pictures, products, contact
 * details — is kept in this browser (localStorage) and can be exported as the
 * site's content files at any time from the Publish screen.
 *
 * The shapes here are exactly the shapes the public site reads, so a page
 * built in the dashboard drops straight into content/ and goes live.
 */
import galleryData from "@/content/gallery.json";
import homeData from "@/content/home.json";
import productsData from "@/content/products.json";
import siteData from "@/content/site.json";

import { mergeHomeSections, type HomeContent, type Img, type Section } from "@/lib/home-model";
import { defaultMarketing, type Marketing } from "@/lib/marketing";

export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin";

const SESSION_KEY = "hv-admin-session";
const PASSWORD_KEY = "hv-admin-key";
const PUBLISHED_KEY = "hv-admin-published";
const WORKSPACE_KEY = "hv-admin-workspace";

export type Product = {
  id: string;
  name: string;
  priceISK: number | null;
  tba: boolean;
  image?: string;
};
export type SiteFile = {
  phone: string;
  phoneIntl: string;
  email: string;
  businessNote: string;
};
export type GallerySlide = { id: string; src: string; alt: string; text: string };

export type Workspace = {
  home: HomeContent;
  gallery: { slides: GallerySlide[] };
  /** Every picture available to the editor — the site's own files plus uploads. */
  media: Img[];
  products: Product[];
  site: SiteFile;
  /** Rewrites of the designed sections' words, by language then key. */
  copy: Record<string, Record<string, string>>;
  /** Replacements for the designed sections' pictures and film. */
  assets: Record<string, string>;
  /** Announcement strip, offers, share preview and form settings. */
  marketing: Marketing;
};

/** Pictures that ship with the site, offered first in every picture picker. */
const BUNDLED_MEDIA: Img[] = [
  { src: "/gallery/g-mountain.jpg", alt: "Jar in a lupine mountain meadow" },
  { src: "/gallery/g-comb.jpg", alt: "Golden honeycomb dripping raw honey" },
  { src: "/gallery/g-pour.jpg", alt: "Raw honey drizzling into a jar" },
  { src: "/gallery/g-spread.jpg", alt: "Honey jar with honeycomb and wildflowers" },
  { src: "/gallery/polenandcomb.jpg", alt: "Bee pollen and honeycomb" },
  { src: "/gallery/3faces.jpg", alt: "Honey Volcano — let happiness erupt" },
  { src: "/gallery/snack1s.jpg", alt: "Honey delicacy" },
  { src: "/gallery/1.jpg", alt: "Honey Volcano" },
  { src: "/gallery/2.jpg", alt: "Honey Volcano" },
  { src: "/gallery/3.jpg", alt: "Honey Volcano" },
  { src: "/gallery/4.jpg", alt: "Honey Volcano" },
  { src: "/trust-jar.jpg", alt: "Jar among wild lupine and mountains" },
  { src: "/honeycomb.jpg", alt: "Honeycomb texture" },
  { src: "/lifestyle.jpg", alt: "Honey Volcano lifestyle photo" },
  { src: "/product-jar-cut.png", alt: "Honey Volcano jar" },
  { src: "/logo-full.png", alt: "Honey Volcano logo" },
];

export function freshWorkspace(): Workspace {
  return {
    home: JSON.parse(JSON.stringify(homeData)) as HomeContent,
    gallery: JSON.parse(JSON.stringify(galleryData)) as { slides: GallerySlide[] },
    media: BUNDLED_MEDIA.map((m) => ({ ...m })),
    products: JSON.parse(JSON.stringify(productsData.products)) as Product[],
    site: { ...(siteData as SiteFile) },
    copy: {},
    assets: {},
    marketing: defaultMarketing(),
  };
}

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return freshWorkspace();
    const saved = JSON.parse(raw) as Partial<Workspace>;
    const fresh = freshWorkspace();
    const ws = { ...fresh, ...saved };
    // A layout saved before a section existed cannot mention it, and taking
    // it wholesale would hide the section from the dashboard too — so the
    // owner would press publish and quietly bake the loss into the live site.
    if (saved.home?.sections) {
      ws.home = { ...ws.home, sections: mergeHomeSections(saved.home.sections, fresh.home.sections) };
    }
    return ws;
  } catch {
    return freshWorkspace();
  }
}

export function saveWorkspace(ws: Workspace) {
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(ws));
    return true;
  } catch {
    // Storage full (usually too many uploaded photos) or disabled.
    return false;
  }
}

export function resetWorkspace() {
  try {
    localStorage.removeItem(WORKSPACE_KEY);
  } catch {}
}

export function checkLogin(user: string, pass: string): boolean {
  return user.trim().toLowerCase() === ADMIN_USER && pass === ADMIN_PASS;
}

export function hasSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
export function startSession() {
  try {
    localStorage.setItem(SESSION_KEY, "1");
  } catch {}
}
export function endSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

// ---------------------------------------------------------------- exporting

/** The four files the site reads, as they would sit in content/. */
export function contentFiles(ws: Workspace): { name: string; json: string }[] {
  return [
    { name: "home.json", json: pretty(ws.home) },
    { name: "gallery.json", json: pretty(ws.gallery) },
    { name: "products.json", json: pretty({ products: ws.products }) },
    { name: "site.json", json: pretty(ws.site) },
    { name: "copy.json", json: pretty({ copy: ws.copy, assets: ws.assets }) },
    { name: "marketing.json", json: pretty(ws.marketing) },
  ];
}

function pretty(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Pictures added in the dashboard are stored inline, so they need uploading too. */
export function uploadedImages(ws: Workspace): Img[] {
  const seen = new Set<string>();
  const out: Img[] = [];
  const add = (img: Img | null | undefined) => {
    if (!img || !img.src.startsWith("data:") || seen.has(img.src)) return;
    seen.add(img.src);
    out.push(img);
  };
  ws.media.forEach(add);
  ws.gallery.slides.forEach((s) => add({ src: s.src, alt: s.alt }));
  ws.home.sections.forEach((s: Section) => {
    if (s.kind === "gallery") s.images.forEach(add);
    if (s.kind === "imageText") add(s.image);
    if (s.kind === "cards") s.cards.forEach((c) => add(c.image));
  });
  return out;
}

/** Rough size of the workspace, so the owner can see when storage is filling. */
export function workspaceSize(ws: Workspace): string {
  const bytes = new Blob([JSON.stringify(ws)]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ------------------------------------------------------- live publishing

/**
 * The owner's password for this site, kept in their own browser so they do not
 * retype it on every edit. It is only ever sent to this site's own API.
 */
export function getPassword(): string {
  try {
    return localStorage.getItem(PASSWORD_KEY) ?? "";
  } catch {
    return "";
  }
}
export function setPassword(password: string) {
  try {
    localStorage.setItem(PASSWORD_KEY, password);
  } catch {}
}
export function clearPassword() {
  try {
    localStorage.removeItem(PASSWORD_KEY);
  } catch {}
}

/** Exactly what gets published: the site's content plus the picture library. */
export function publishableBundle(ws: Workspace) {
  return {
    home: ws.home,
    gallery: ws.gallery,
    products: ws.products,
    site: ws.site,
    media: ws.media,
    copy: ws.copy,
    assets: ws.assets,
    marketing: ws.marketing,
  };
}

/** A fingerprint of the published state, so the dashboard can say "not yet live". */
export function fingerprint(ws: Workspace): string {
  return JSON.stringify(publishableBundle(ws));
}

export function getPublishedMark(): string {
  try {
    return localStorage.getItem(PUBLISHED_KEY) ?? "";
  } catch {
    return "";
  }
}
export function setPublishedMark(mark: string) {
  try {
    localStorage.setItem(PUBLISHED_KEY, mark);
  } catch {}
}

/** Builds a workspace from whatever the site is currently serving. */
export function workspaceFromPublished(
  published: Partial<Workspace> | null | undefined
): Workspace {
  const base = freshWorkspace();
  if (!published) return base;
  return {
    ...base,
    ...published,
    // Keep the pictures that ship with the site available alongside uploads.
    media: mergeMedia(published.media ?? [], base.media),
    copy: published.copy ?? {},
    assets: published.assets ?? {},
    marketing: { ...defaultMarketing(), ...(published.marketing ?? {}) },
  };
}

function mergeMedia(first: Img[], second: Img[]): Img[] {
  const seen = new Set<string>();
  const out: Img[] = [];
  for (const img of [...first, ...second]) {
    if (!img?.src || seen.has(img.src)) continue;
    seen.add(img.src);
    out.push(img);
  }
  return out;
}
