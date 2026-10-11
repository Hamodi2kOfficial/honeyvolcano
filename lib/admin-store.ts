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

import type { HomeContent, Img, Section } from "@/lib/home-model";

export const ADMIN_USER = "admin";
export const ADMIN_PASS = "admin";

const SESSION_KEY = "hv-admin-session";
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
  };
}

export function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) return freshWorkspace();
    const saved = JSON.parse(raw) as Partial<Workspace>;
    return { ...freshWorkspace(), ...saved };
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
