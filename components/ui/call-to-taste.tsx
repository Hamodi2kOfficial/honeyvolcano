"use client";

import * as React from "react";

import { IcelandFlag } from "@/components/ui/flags";
import { cn } from "@/lib/utils";

const PHONE = "8340999";

/**
 * Call-to-taste button. On press it reveals the phone number in place — no
 * tel: link, no launching a dialer. Both states are always rendered and simply
 * cross-fade with CSS, so the toggle is bulletproof: it never depends on an
 * animation completing (works even if the tab was briefly backgrounded).
 * Press again to hide.
 */
export function CallToTaste({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [shown, setShown] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setShown((s) => !s)}
      aria-label={shown ? `Phone number ${PHONE}` : label}
      className={cn(
        "relative inline-flex h-12 min-w-[11rem] items-center justify-center overflow-hidden rounded-xl px-6 text-base font-semibold text-[#1c1206] shadow-[0_12px_28px_-12px_rgba(212,175,55,0.7)] ring-1 ring-[#f0d38a]/40 transition-transform duration-300 hover:scale-[1.03]",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(135deg, #F3CE72 0%, #E5B869 42%, #C79A3B 100%)",
      }}
    >
      {/* label */}
      <span
        className={cn(
          "flex items-center transition-all duration-300 ease-out",
          shown ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {label}
      </span>

      {/* phone number — cross-fades in over the label */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2.5 transition-all duration-300 ease-out",
          shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        <IcelandFlag className="h-5" />
        <span className="select-all tracking-[0.12em] tabular-nums">{PHONE}</span>
      </span>
    </button>
  );
}
