"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { callAriaLabel, formatPhone, telHref } from "@/lib/phone";
import { track } from "@/lib/track";

/**
 * The call button that follows you down every page on a phone.
 *
 * Sits above the home indicator on iOS (safe-area inset) and is hidden from
 * the desktop layout, where the navigation bar's own call button is always on
 * screen. It is a plain tel: link, so one tap opens the dialer.
 */
export function StickyCall() {
  const { site } = useLiveContent();
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const pretty = formatPhone(site.phoneIntl);

  // Hidden on the first screen. Every page already opens with a call button,
  // so a second one bolted to the bottom would only cover the content — on a
  // small phone it was hiding the hero's own seals. It slides in once the
  // visitor has scrolled past that first action and needs it again.
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      aria-hidden={!shown}
      initial={false}
      animate={shown ? { y: 0, opacity: 1 } : { y: reduced ? 0 : 90, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <div className="mx-auto w-full max-w-md px-4">
        <a
          href={telHref(site.phoneIntl)}
          aria-label={callAriaLabel(site.phoneIntl)}
          onClick={() => track("taste")}
          className="flex h-14 items-center justify-center gap-3 rounded-full text-[15px] font-semibold text-on-accent shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65)] ring-1 ring-accent-strong/50"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 48%, var(--copper) 120%)",
          }}
        >
          <Phone aria-hidden className="h-[18px] w-[18px]" />
          <span>{t.cta.call}</span>
          <span className="font-normal tabular-nums opacity-90">{pretty}</span>
        </a>
      </div>
    </motion.div>
  );
}
