"use client";

import { Navbar } from "@/components/site/navbar";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/components/i18n";

/** The date the wording below was last changed. Update it when you edit it. */
const UPDATED = "29 October 2026";

export default function PrivacyPage() {
  const { t } = useI18n();

  const sections = [
    [t.privacy.s1h, t.privacy.s1b],
    [t.privacy.s2h, t.privacy.s2b],
    [t.privacy.s3h, t.privacy.s3b],
    [t.privacy.s4h, t.privacy.s4b],
    [t.privacy.s5h, t.privacy.s5b],
    [t.privacy.s6h, t.privacy.s6b],
    [t.privacy.s7h, t.privacy.s7b],
    [t.privacy.s8h, t.privacy.s8b],
  ];

  return (
    <main className="relative bg-background">
      <Navbar />

      <article className="mx-auto max-w-2xl px-5 pb-24 pt-[120px] md:px-8 md:pt-[150px]">
        <Reveal>
          <h1 className="font-serif text-[34px] font-light leading-tight text-foreground md:text-[44px]">
            {t.privacy.title}
          </h1>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            {t.privacy.updated}: {UPDATED}
          </p>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
            {t.privacy.intro}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map(([heading, body], i) => (
            <Reveal key={heading} delay={i * 0.02}>
              <h2 className="font-display text-[13px] uppercase tracking-[0.2em] text-accent">
                {heading}
              </h2>
              <p className="mt-3 text-[15px] font-light leading-relaxed text-foreground-muted">
                {body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          as="p"
          className="mt-14 rounded-2xl border border-border bg-bg-soft px-6 py-5 text-[13px] font-light italic leading-relaxed text-foreground-muted"
        >
          {t.privacy.note}
        </Reveal>
      </article>
    </main>
  );
}
