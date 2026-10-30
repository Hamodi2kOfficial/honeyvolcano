"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { DUR, EASE_PRESS, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A honeycomb seal: icon above, promise below.
 *
 * The hexagon is a clip-path on a bordered box, so the text inside stays
 * selectable and translatable (a baked SVG label would not). The cut corners
 * are percentages rather than pixels so the shape holds at every width the
 * row is asked to fit into.
 *
 * It lands as the row scrolls into view: down from slightly too big and
 * slightly rotated, which reads as pressure rather than a fade. Under
 * `prefers-reduced-motion` the seal is simply there.
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
      initial={reduced ? false : { opacity: 0, scale: 1.3, rotate: index % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, scale: 1, rotate: index % 2 ? 1 : -1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        delay: index * STAGGER.loose,
        duration: DUR.quick + 0.2,
        ease: EASE_PRESS,
      }}
      className={cn("group relative", className)}
    >
      <div
        className={cn(
          "relative flex min-h-[118px] flex-col items-center justify-center gap-2.5 border border-accent/35 bg-accent/[0.06] px-5 py-4 text-center backdrop-blur-sm",
          "sm:min-h-[132px] sm:gap-3 sm:px-6 sm:py-5",
          "transition-colors duration-300 group-hover:border-accent/70 group-hover:bg-accent/[0.12]"
        )}
        style={{
          // flat-sided hexagon, cut from both ends so it reads as a pressed seal
          clipPath:
            "polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0 50%)",
        }}
      >
        {/* the inner hairline a real stamp leaves inside its border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[6px] border border-accent/20"
          style={{
            clipPath:
              "polygon(11% 0, 89% 0, 100% 50%, 89% 100%, 11% 100%, 0 50%)",
          }}
        />
        {icon && (
          <span
            aria-hidden
            className="shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 [&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-8 sm:[&_svg]:w-8"
          >
            {icon}
          </span>
        )}
        <span className="max-w-[16ch] text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-accent sm:text-[11px] sm:tracking-[0.14em]">
          {children}
        </span>
      </div>
    </motion.div>
  );
}
