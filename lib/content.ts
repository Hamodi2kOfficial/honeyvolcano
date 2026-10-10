import productsData from "@/content/products.json";
import siteData from "@/content/site.json";

/**
 * Single source of truth for owner-editable content. These JSON files live in
 * the repo (content/), so the public site reads them at build time (fully
 * static) and the /admin dashboard edits them by committing back to GitHub.
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
