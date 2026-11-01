"use client";

import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/components/i18n";
import { formatDate } from "@/lib/format-date";

/** The date the wording below was last changed. Update it when you edit it. */
const UPDATED = new Date(Date.UTC(2026, 9, 31));

/**
 * Terms and conditions, laid out exactly like the privacy policy so the two
 * read as a pair. Nine short sections rather than a wall: this is a shop you
 * phone, so most of it is about what happens on that call.
 */
export default function TermsPage() {
  const { t, lang } = useI18n();

  const sections = [
    [t.terms.s1h, t.terms.s1b],
    [t.terms.s2h, t.terms.s2b],
    [t.terms.s3h, t.terms.s3b],
    [t.terms.s4h, t.terms.s4b],
    [t.terms.s5h, t.terms.s5b],
    [t.terms.s6h, t.terms.s6b],
    [t.terms.s7h, t.terms.s7b],
    [t.terms.s8h, t.terms.s8b],
    [t.terms.s9h, t.terms.s9b],
  ];

  return (
    <main className="relative bg-background">
      <article className="mx-auto max-w-2xl px-5 pb-24 pt-[120px] md:px-8 md:pt-[150px]">
        <Reveal>
          <h1 className="font-serif text-[37px] font-light leading-tight text-foreground md:text-[46px]">
            {t.terms.title}
          </h1>
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            {t.terms.updated}: {formatDate(UPDATED, lang)}
          </p>
          <p className="mt-6 text-[19px] font-light leading-relaxed text-foreground-muted md:text-base">
            {t.terms.intro}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map(([heading, body], i) => (
            <Reveal key={i} delay={i * 0.02}>
              <h2 className="font-display text-[16px] uppercase tracking-[0.2em] text-accent">
                {heading}
              </h2>
              <p className="mt-3 text-[19px] font-light leading-relaxed text-foreground-muted">
                {body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          as="p"
          className="mt-14 rounded-2xl border border-border bg-bg-soft px-6 py-5 text-[16px] font-light italic leading-relaxed text-foreground-muted"
        >
          {t.terms.note}
        </Reveal>
      </article>
    </main>
  );
}
