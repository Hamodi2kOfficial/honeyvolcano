import galleryData from "@/content/gallery.json";
import homeData from "@/content/home.json";
import productsData from "@/content/products.json";
import siteData from "@/content/site.json";

import type { HomeContent } from "@/lib/home-model";
import { defaultMarketing, type Marketing } from "@/lib/marketing";

/**
 * Single source of truth for owner-editable content. These JSON files live in
 * the repo (content/), so the public site reads them at build time (fully
 * static) and the /admin dashboard is where the owner edits them.
 */

/** One jar of a multi-flavour product, e.g. the honey delicacies. */
export type Flavour = {
  id: string;
  /** Exactly as it reads on the jar — we never invent a product name. */
  name: string;
  weight: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  priceISK: number | null;
  tba: boolean;
  /** Optional product photo path, e.g. "/products/raw-honey-500.webp". */
  image?: string;
  /** Net weight as printed on the jar, shown as a badge on the card. */
  weight?: string;
  /** Shown on the home page's selection of the most expensive jars. */
  featured?: boolean;
  /** Set when one product comes in several jars the customer picks between. */
  flavours?: Flavour[];
};

export type SiteContent = {
  phone: string;
  phoneIntl: string;
  email: string;
  businessNote: string;
};

export const products: Product[] = productsData.products as Product[];
export const site: SiteContent = siteData as SiteContent;

/** Display price for a product, e.g. "2299 ISK" or "Price TBA". */
export function formatPrice(p: Product): string {
  if (p.tba || p.priceISK == null) return "Price TBA";
  return `${p.priceISK} ISK`;
}

/** The home page layout (section order, visibility, owner-built blocks). */
export const home: HomeContent = homeData as unknown as HomeContent;

export type GallerySlide = { id: string; src: string; alt: string; text: string };
export const gallerySlides: GallerySlide[] = galleryData.slides as GallerySlide[];

/** Everything the owner can edit, in one bundle (see components/live-content). */
export type SiteBundle = {
  home: HomeContent;
  gallery: { slides: GallerySlide[] };
  products: Product[];
  site: SiteContent;
  /** Owner rewrites of the designed sections' words, by language then key. */
  copy?: Record<string, Record<string, string>>;
  /** Owner replacements for the designed sections' pictures and film. */
  assets?: Record<string, string>;
  /** Announcement strip, offer codes, share preview and form settings. */
  marketing?: Marketing;
};

/** The content baked into this build — the starting point and the fallback. */
export const buildTimeContent: SiteBundle = {
  home,
  gallery: { slides: gallerySlides },
  products,
  site,
  copy: {},
  assets: {},
  marketing: defaultMarketing(),
};
