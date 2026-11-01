import type { Dict } from "@/components/i18n";
import type { Flavour, Product } from "@/lib/content";

/**
 * The name of a jar in the language being read.
 *
 * The names live in content/products.json in English, because that is where
 * the owner edits them. The six translations live in the dictionaries, keyed
 * by the product's id — so a product the owner adds later still shows up,
 * under its English name, rather than disappearing.
 */
export function productName(t: Dict, product: Product): string {
  const names = t.productName as Record<string, string | undefined>;
  return names?.[product.id] || product.name;
}

export function flavourName(t: Dict, flavour: Flavour): string {
  const names = t.productName as Record<string, string | undefined>;
  return names?.[flavour.id] || flavour.name;
}
