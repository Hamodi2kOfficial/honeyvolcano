"use client";

import Image from "next/image";
import { Link } from "@/components/ui/link";
import { ArrowRight, FlaskConical, HandHeart, Thermometer } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useAsset } from "@/components/live-content";
import { useI18n } from "@/components/i18n";

/**
 * The first section under the hero: raw honey and every other bee product.
 * Picture on one side, the three reasons on the other.
 */
export function RawAndBeeSection() {
  const { t } = useI18n();
  const image = useAsset("rawAndBee.image", "/sections/all-bee-products.webp");

  const points = [
    { icon: Thermometer, title: t.home.rawP1t, body: t.home.rawP1d },
    { icon: FlaskConical, title: t.home.rawP2t, body: t.home.rawP2d },
    { icon: HandHeart, title: t.home.rawP3t, body: t.home.rawP3d },
  ];

  return (
    <section className="relative bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
            {t.home.rawEyebrow}
          </p>
          <h2 className="mt-4 whitespace-pre-line font-serif text-[32px] font-light leading-[1.15] text-foreground md:text-[44px]">
            {t.home.rawHeading}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
            {t.home.rawBody}
          </p>

          <RevealGroup className="mt-9 flex flex-col gap-6">
            {points.map(({ icon: Icon, title, body }) => (
              <RevealItem key={title} className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                  <Icon aria-hidden className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block font-display text-[13px] uppercase tracking-[0.16em] text-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm font-light leading-relaxed text-foreground-muted">
                    {body}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-2 border-b border-accent/40 pb-1 text-sm font-medium text-accent transition-colors hover:border-accent"
          >
            {t.home.featAll}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
            <Image
              src={image}
              alt="Raw honey, honeycomb, bee pollen, bee bread and honey treats laid out on a dark oak table"
              width={1920}
              height={1072}
              sizes="(max-width: 1023px) 92vw, 48vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
