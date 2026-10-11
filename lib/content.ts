import galleryData from "@/content/gallery.json";
import homeData from "@/content/home.json";
import productsData from "@/content/products.json";
import siteData from "@/content/site.json";

import type { HomeContent } from "@/lib/home-model";

/**
 * Single source of truth for owner-editable content. These JSON files live in
 * the repo (content/), so the public site reads them at build time (fully
 * static) and the /admin dashboard is where the owner edits them.
 */

export type Product = {
  id: string;
  name: string;
  priceISK: number | null;
  tba: boolean;
  /** Optional product photo path, e.g. "/products/raw-honey-500.png". */
  image?: string;
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
};

/** The content baked into this build — the starting point and the fallback. */
export const buildTimeContent: SiteBundle = {
  home,
  gallery: { slides: gallerySlides },
  products,
  site,
};
