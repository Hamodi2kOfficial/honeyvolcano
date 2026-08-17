"use client";

import { useI18n } from "@/components/i18n";

function Hex() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden className="text-accent/50">
      <path d="M5 .5l4 2.3v4.4L5 9.5 1 7.2V2.8z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Track({ words }: { words: string[] }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {words.map((w, i) => (
        <div key={i} className="flex items-center">
          <span className="mx-7 whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-accent/80 md:text-base">
            {w}
          </span>
          <Hex />
        </div>
      ))}
    </div>
  );
}

export function Marquee() {
  const { t } = useI18n();
  const words = [
    t.story.stat1,
    t.product.f1t,
    t.story.stat3,
    t.product.f3t,
    t.story.stat2,
    t.product.f2t,
  ];

  return (
    <div className="relative overflow-hidden border-y border-border bg-bg-soft py-4">
      <div className="flex w-max animate-marquee">
        <Track words={words} />
        <Track words={words} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg-soft)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg-soft)] to-transparent" />
    </div>
  );
}
