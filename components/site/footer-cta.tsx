"use client";

import { CallButton } from "@/components/ui/call-button";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { EruptMark } from "@/components/ui/erupt-mark";
import { useI18n } from "@/components/i18n";

/**
 * The closing call: the catchphrase, big, with the one action the site is for.
 * (The business details and page links live in the site footer, which the root
 * layout puts on every page.)
 */
export function FooterCta() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <EruptMark className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-accent/[0.05] sm:text-6xl md:text-7xl" />

      <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <RevealWords as="h2" text={t.cta.heading} className="font-serif text-[32px] font-light leading-tight text-foreground md:text-[46px]" />
        <p className="max-w-md text-[15px] font-light leading-relaxed text-foreground-muted">
          {t.cta.subtitle}
        </p>
        <CallButton size="lg" showCopy />
      </Reveal>
    </section>
  );
}
