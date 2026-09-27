"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { IcelandFlag } from "@/components/ui/flags";
import { cn } from "@/lib/utils";

const PHONE = "8340999";

/**
 * Call-to-taste button. On press it simply *reveals* the phone number in place
 * — no tel: link, no launching a dialer or other app. The number appears so the
 * person can read it and call. Press again to hide it.
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
      <AnimatePresence mode="wait" initial={false}>
        {shown ? (
          <motion.span
            key="num"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5"
          >
            <IcelandFlag className="h-5" />
            <span className="select-all tracking-[0.12em] tabular-nums">{PHONE}</span>
          </motion.span>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
