"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A honeycomb seal.
 *
 * The hexagon is a clip-path on a bordered box, so the text inside stays
 * selectable and translatable (a baked SVG label would not). The entrance is
 * a stamp press: it lands from slightly too big and slightly rotated, which
 * reads as pressure rather than a fade.
 */
export function Stamp({
  children,
  icon,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** Position in the row, used only for the stagger. */
  index?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 1.35, rotate: index % 2 ? 5 : -5 }}
      animate={{ opacity: 1, scale: 1, rotate: index % 2 ? 1.2 : -1.2 }}
      transition={{
        delay: 0.55 + index * 0.11,
        duration: 0.5,
        ease: [0.34, 1.4, 0.4, 1],
      }}
      className={cn("group relative", className)}
    >
      <div
        className={cn(
          "relative flex min-h-[66px] items-center justify-center gap-2.5 border border-accent/35 bg-accent/[0.06] px-7 py-3 text-center backdrop-blur-sm",
          "transition-colors duration-300 group-hover:border-accent/70 group-hover:bg-accent/[0.12]"
        )}
        style={{
          // flat-top hexagon, cut from both ends so it reads as a pressed seal
          clipPath:
            "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)",
        }}
      >
        {/* the inner hairline a real stamp leaves inside its border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[5px] border border-accent/20"
          style={{
            clipPath:
              "polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)",
          }}
        />
        {icon && (
          <span aria-hidden className="shrink-0 text-accent [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        )}
        <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-accent sm:text-[11px]">
          {children}
        </span>
      </div>
    </motion.div>
  );
}
