"use client";

import { Link } from "@/components/ui/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { useI18n } from "@/components/i18n";

/**
 * The last thing on the home page: a blurred plate saying work is in progress,
 * linking to the page that explains it. Nothing legible sits behind the blur —
 * the blurred layer is decorative, so there is no hidden text to hunt for.
 */
export function ConstructionSection() {
  const { t } = useI18n();

  return (
    <section className="relative isolate overflow-hidden bg-background py-20 md:py-28">
      {/* blurred honeycomb field behind the plate */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 blur-[14px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, color-mix(in oklab, var(--accent) 22%, transparent) 0 2px, transparent 2px 26px), repeating-linear-gradient(-60deg, color-mix(in oklab, var(--accent) 22%, transparent) 0 2px, transparent 2px 26px), repeating-linear-gradient(0deg, color-mix(in oklab, var(--copper) 16%, transparent) 0 2px, transparent 2px 26px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background/60 backdrop-blur-[3px]"
      />

      <Reveal className="mx-auto max-w-xl px-5 text-center md:px-8">
        {/* caution stripes, very faint */}
        <span
          aria-hidden
          className="mx-auto mb-7 block h-1.5 w-28 rounded-full opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--accent) 0 8px, transparent 8px 16px)",
          }}
        />

        <p className="font-display text-sm uppercase tracking-[0.42em] text-accent md:text-base">
          {t.uc.label}
        </p>

        <RevealWords as="h2" text={t.home.ucHeading} className="mt-5 font-serif text-[30px] font-light leading-tight text-foreground md:text-[40px]" />

        <p className="mt-4 text-[15px] font-light leading-relaxed text-foreground-muted">
          {t.home.ucBody}
        </p>

        <Link
          href="/under-construction"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-accent/45 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
        >
          {t.uc.more}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
