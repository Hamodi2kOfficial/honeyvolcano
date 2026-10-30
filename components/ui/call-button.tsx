"use client";

import * as React from "react";
import { Check, Copy, Phone } from "lucide-react";
import { motion } from "motion/react";

import { IcelandFlag } from "@/components/ui/flags";
import { useLiveContent } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { callAriaLabel, formatPhone, telHref } from "@/lib/phone";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  // 44px minimum on every variant — these are thumb targets, not decorations.
  sm: "h-11 px-5 text-[13px] gap-2",
  md: "h-12 px-7 text-[15px] gap-2.5",
  lg: "h-14 px-9 text-[16px] gap-3",
};

/**
 * The one Call to taste button.
 *
 * It is a real `tel:` link with the country code, so a tap on a phone opens
 * the dialer with the number ready and a click on a desktop hands off to
 * whatever calling app is installed. The number itself is always visible
 * beside the label (not hidden behind a press), and `showCopy` adds a separate
 * copy button for people on a desktop with no calling app.
 */
export function CallButton({
  variant = "solid",
  size = "md",
  label,
  showNumber = true,
  showCopy = false,
  className,
  onCall,
}: {
  variant?: Variant;
  size?: Size;
  /** Defaults to the translated "Call to taste". */
  label?: string;
  showNumber?: boolean;
  showCopy?: boolean;
  className?: string;
  onCall?: () => void;
}) {
  const { site } = useLiveContent();
  const { t } = useI18n();
  const intl = site.phoneIntl;
  const pretty = formatPhone(intl);
  const text = label ?? t.cta.call;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <a
        href={telHref(intl)}
        aria-label={callAriaLabel(text, pretty)}
        onClick={() => {
          track("taste");
          onCall?.();
        }}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold tracking-[0.01em]",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] active:scale-[0.99]",
          "motion-reduce:transition-none motion-reduce:hover:scale-100",
          variant === "solid" &&
            "text-on-accent shadow-[0_12px_30px_-12px_var(--accent)] ring-1 ring-accent-strong/45",
          variant === "outline" &&
            "border border-accent/45 text-accent hover:border-accent hover:bg-accent/10",
          variant === "ghost" && "text-foreground/80 hover:text-accent",
          SIZES[size]
        )}
        style={
          variant === "solid"
            ? {
                backgroundImage:
                  "linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 48%, var(--copper) 120%)",
              }
            : undefined
        }
      >
        {variant === "solid" && (
          // travelling shimmer — pure transform/opacity, skipped when reduced
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 motion-reduce:hidden"
            style={{
              backgroundImage:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
              backgroundSize: "240% 100%",
              backgroundRepeat: "no-repeat",
            }}
            animate={{ backgroundPositionX: ["160%", "-60%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
          />
        )}

        <Phone aria-hidden className="relative h-4 w-4 shrink-0" />
        <span className="relative">{text}</span>
        {showNumber && (
          <span className="relative hidden items-center gap-2 border-l border-current/25 pl-2.5 font-normal tabular-nums opacity-90 sm:inline-flex">
            <IcelandFlag className="h-3.5" />
            {pretty}
          </span>
        )}
      </a>

      {showCopy && <CopyNumber value={pretty} />}
    </span>
  );
}

/** Desktop convenience: copy the number instead of launching a calling app. */
export function CopyNumber({ value }: { value: string }) {
  const [done, setDone] = React.useState(false);
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard blocked — the number is on screen anyway */
        }
      }}
      aria-label={done ? t.cta.copied : `${t.cta.copy} ${value}`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
    >
      {done ? (
        <Check aria-hidden className="h-4 w-4 text-success" />
      ) : (
        <Copy aria-hidden className="h-4 w-4" />
      )}
    </button>
  );
}
