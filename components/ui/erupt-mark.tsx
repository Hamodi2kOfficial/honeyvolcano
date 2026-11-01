"use client";

import { useI18n } from "@/components/i18n";

/**
 * Brand catch-phrase watermark, set very faintly in the background of a
 * section. Purely decorative; kept low-contrast so it reads as a subtle
 * texture, never as clutter. Position + colour come from `className`.
 *
 * The phrase was hardcoded in English, so an Icelandic or Russian visitor met
 * it three times in a language they had not chosen — while the owner's own
 * version of the same phrase sat a few lines further down the page. It now
 * comes from the dictionary like everything else.
 */
export function EruptMark({ className = "" }: { className?: string }) {
  const { t } = useI18n();

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none whitespace-nowrap font-display uppercase leading-none tracking-[0.18em] ${className}`}
    >
      {t.hero.slogan}
    </span>
  );
}
