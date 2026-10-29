"use client";

import { Link } from "@/components/ui/link";
import { ArrowLeft } from "lucide-react";

import { HiveDecor } from "@/components/site/hive-decor";
import { CallButton } from "@/components/ui/call-button";
import { Reveal } from "@/components/ui/reveal";
import { VolcanoMark } from "@/components/ui/volcano-mark";
import { useI18n } from "@/components/i18n";

export default function UnderConstructionPage() {
  const { t } = useI18n();

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-background">
      <HiveDecor />

      <section className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-32 text-center md:px-8">
        <Reveal>
          <VolcanoMark className="mx-auto h-12 w-12 text-accent" />

          <span
            aria-hidden
            className="mx-auto mt-8 block h-1.5 w-32 rounded-full opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--accent) 0 8px, transparent 8px 16px)",
            }}
          />

          <p className="mt-7 font-display text-sm uppercase tracking-[0.42em] text-accent md:text-base">
            {t.uc.label}
          </p>

          <h1 className="mt-5 font-serif text-[32px] font-light leading-tight text-foreground md:text-[42px]">
            {t.uc.title}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-foreground-muted">
            {t.uc.body}
          </p>

          <div className="mt-9 flex flex-col items-center gap-5">
            <CallButton size="lg" showCopy />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-light text-foreground-muted transition-colors hover:text-accent"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              {t.uc.back}
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
