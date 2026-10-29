"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useLiveContent } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { formatPrice, type Product } from "@/lib/content";

/**
 * The home page's shortlist: the four dearest jars, newest-first by price.
 *
 * Each card links through to the full catalogue and carries its own call
 * button, so a visitor can go straight from "that one" to the phone.
 */
function FeaturedCard({ product }: { product: Product }) {
  const { t } = useI18n();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface/60 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-soft)] motion-reduce:hover:translate-y-0">
      <Link
        href="/products"
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-square w-full overflow-hidden bg-bg-soft"
      >
        {product.image && (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 23vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {product.weight && (
          <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
            {product.weight}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-light leading-snug text-foreground">
            <Link href="/products" className="transition-colors hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <span className="mt-1 shrink-0 whitespace-nowrap font-display text-[13px] tracking-wide text-accent">
            {product.tba ? t.products.tba : formatPrice(product)}
          </span>
        </div>

        <CallButton
          size="sm"
          showNumber={false}
          variant="outline"
          className="mt-auto [&>a]:w-full"
        />
      </div>
    </article>
  );
}

export function FeaturedProducts() {
  const { products } = useLiveContent();
  const { t } = useI18n();

  const featured = products
    .filter((p) => p.featured && !p.tba)
    .sort((a, b) => (b.priceISK ?? 0) - (a.priceISK ?? 0))
    .slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="relative bg-bg-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            {t.home.featEyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[32px] font-light leading-tight text-foreground md:text-[44px]">
            {t.home.featHeading}
          </h2>
          <p className="mt-4 text-[15px] font-light leading-relaxed text-foreground-muted">
            {t.home.featBody}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <RevealItem key={p.id} className="h-full">
              <FeaturedCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-accent/45 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
          >
            {t.home.featAll}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
