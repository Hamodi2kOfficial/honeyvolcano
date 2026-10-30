"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

import { CallButton } from "@/components/ui/call-button";
import { OffersNote } from "@/components/site/offers-note";
import { ProductDetail } from "@/components/site/product-detail";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { formatPrice, type Product } from "@/lib/content";

/** Faint jar silhouette shown while a product photo is still to come. */
function JarPlaceholder() {
  return (
    <svg viewBox="0 0 48 60" aria-hidden className="h-16 w-16 text-accent/25">
      <path
        d="M17 4h14M16 8h16v4l3 3v33a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V15l3-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 30h22" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/**
 * A product card: the picture, the name, the price, and the call.
 *
 * Every photo is shown in the same 4:5 frame, so the row reads as one set
 * rather than a pile of different crops. The picture and the name open the
 * product — the flavours and the longer description live in there, which
 * keeps the card down to the three things a customer scans for.
 */
function ProductCard({
  product,
  onOpen,
  open,
}: {
  product: Product;
  onOpen: () => void;
  open: boolean;
}) {
  const { t } = useI18n();
  const reduced = useReducedMotion() ?? false;
  const image = product.image;

  return (
    <motion.article
      layoutId={reduced ? undefined : `hv-card-${product.id}`}
      // While the detail is open this card is the thing that grew into it,
      // so it steps aside rather than sitting underneath as a duplicate.
      animate={{ opacity: open ? 0 : 1 }}
      transition={{ duration: 0.15 }}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface/60 transition-colors duration-300 hover:border-accent/50"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={product.name}
        className="block w-full text-left"
      >
        <motion.div
          layoutId={reduced ? undefined : `hv-image-${product.id}`}
          className="relative aspect-[4/5] w-full overflow-hidden border-b border-border/70 bg-bg-soft"
        >
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 31vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <JarPlaceholder />
            </div>
          )}
          {product.weight && (
            <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
              {product.weight}
            </span>
          )}
        </motion.div>

        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <motion.h3
            layoutId={reduced ? undefined : `hv-name-${product.id}`}
            className="font-serif text-xl font-light leading-snug text-foreground transition-colors group-hover:text-accent"
          >
            {product.name}
          </motion.h3>
          <span className="mt-1 shrink-0 whitespace-nowrap font-display text-sm tracking-wide text-accent">
            {product.tba ? t.products.tba : formatPrice(product)}
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col justify-end p-5 pt-4">
        <CallButton size="sm" showNumber={false} className="[&>a]:w-full" />
      </div>
    </motion.article>
  );
}

export function ProductCatalog() {
  const { products, site } = useLiveContent();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const open = products.find((p) => p.id === openId) ?? null;

  return (
    <section id="catalog" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 md:px-8">
      {/* Business orders note — the owner's exact words, kept prominent */}
      <Reveal className="mx-auto max-w-3xl rounded-2xl border border-accent/40 bg-accent/[0.08] px-6 py-5 text-center text-base font-semibold leading-relaxed text-accent md:text-lg">
        {site.businessNote}
      </Reveal>

      <OffersNote />

      <LayoutGroup>
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <RevealItem key={product.id} className="h-full">
              <ProductCard
                product={product}
                open={openId === product.id}
                onOpen={() => setOpenId(product.id)}
              />
            </RevealItem>
          ))}
        </RevealGroup>

        <AnimatePresence>
          {open && <ProductDetail key={open.id} product={open} onClose={() => setOpenId(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
