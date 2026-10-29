"use client";

import * as React from "react";
import Image from "next/image";

import { CallButton } from "@/components/ui/call-button";
import { OffersNote } from "@/components/site/offers-note";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { formatPrice, type Product } from "@/lib/content";
import { cn } from "@/lib/utils";

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
 * A product card. When the product comes in several jars (the delicacies), the
 * flavours are tabs inside the card: the picture, the name and the weight all
 * change together, so the customer can see exactly which jars exist without
 * leaving the card or opening anything.
 */
function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const flavours = product.flavours ?? [];
  const [active, setActive] = React.useState(0);
  const shown = flavours[active];

  const image = shown?.image ?? product.image;
  const weight = shown?.weight ?? product.weight;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface/60 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-soft)] motion-reduce:hover:translate-y-0">
      <div className="relative aspect-square w-full overflow-hidden border-b border-border/70 bg-bg-soft">
        {image ? (
          <Image
            key={image}
            src={image}
            alt={shown ? shown.name : product.name}
            fill
            sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 31vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <JarPlaceholder />
          </div>
        )}
        {weight && (
          <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
            {weight}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-light leading-snug text-foreground">
            {product.name}
          </h3>
          <span className="mt-1 shrink-0 whitespace-nowrap font-display text-sm tracking-wide text-accent">
            {product.tba ? t.products.tba : formatPrice(product)}
          </span>
        </div>

        {flavours.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
              {t.products.flavours}
            </p>
            <div role="tablist" aria-label={t.products.flavours} className="mt-2.5 flex flex-wrap gap-1.5">
              {flavours.map((f, i) => (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-[11px] leading-tight transition-colors",
                    i === active
                      ? "border-accent/60 bg-accent/12 text-accent"
                      : "border-border text-foreground-muted hover:border-accent/40 hover:text-foreground"
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <CallButton size="sm" showNumber={false} className="mt-6 [&>a]:w-full" />
      </div>
    </article>
  );
}

/** The 500 g and the 1 kg jar in one frame, so the difference is not a claim. */
function SizeComparison() {
  const { t } = useI18n();
  return (
    <Reveal className="mx-auto mt-14 max-w-4xl">
      <div className="overflow-hidden rounded-[22px] border border-border bg-surface/50">
        <div className="relative">
          <Image
            src="/products/raw-honey-sizes.webp"
            alt="The 500 g jar beside the 1 kg jar, photographed together at the same distance"
            width={1600}
            height={1195}
            sizes="(max-width: 1023px) 92vw, 60vw"
            className="h-auto w-full"
          />
          <span className="absolute bottom-3 left-[18%] -translate-x-1/2 rounded-full border border-accent/40 bg-background/85 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-accent backdrop-blur-sm">
            {t.products.size500}
          </span>
          <span className="absolute bottom-3 left-[68%] -translate-x-1/2 rounded-full border border-accent/40 bg-background/85 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-accent backdrop-blur-sm">
            {t.products.size1kg}
          </span>
        </div>
        <div className="px-6 py-5 text-center">
          <h3 className="font-serif text-xl font-light text-foreground">
            {t.products.sizeHeading}
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-light leading-relaxed text-foreground-muted">
            {t.products.sizeBody}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function ProductCatalog() {
  const { products, site } = useLiveContent();
  const { t } = useI18n();

  return (
    <section id="catalog" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 md:px-8">
      <Reveal className="text-center">
        <h2 className="font-serif text-4xl font-light text-foreground md:text-5xl">
          {t.products.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] font-light leading-relaxed text-foreground-muted">
          {t.products.intro}
        </p>
      </Reveal>

      <SizeComparison />

      {/* Business orders note — the owner's exact words, kept prominent */}
      <Reveal
        delay={0.1}
        className="mx-auto mt-10 max-w-3xl rounded-2xl border border-accent/40 bg-accent/[0.08] px-6 py-5 text-center text-base font-semibold leading-relaxed text-accent md:text-lg"
      >
        {site.businessNote}
      </Reveal>

      <OffersNote />

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <RevealItem key={product.id} className="h-full">
            <ProductCard product={product} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
