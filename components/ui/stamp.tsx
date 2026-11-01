"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { DUR, EASE, STAGGER, TRAVEL } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * One of the six promises: a large icon, and the words under it.
 *
 * No plate, no border, no hexagon — the mark sits straight on the page. Six
 * bordered boxes in a row read as a toolbar; six drawn marks read as a seal
 * of quality, which is what these are. It also lets the icon be twice the
 * size in the same space.
 *
 * These live in the first screen, so they arrive on mount rather than waiting
 * for a scroll that may never come: on a phone the row is the first thing
 * under the film, and a visitor who does not scroll must still see them.
 */
export function Stamp({
  children,
  icon,
  index = 0,
  className,
  onSelect,
  expanded,
  controls,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  /** Position in the row, used only for the stagger. */
  index?: number;
  className?: string;
  /** Makes the seal a button that opens its explanation. */
  onSelect?: () => void;
  expanded?: boolean;
  /** Id of the panel the button opens, for `aria-controls`. */
  controls?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const Tag = onSelect ? motion.button : motion.div;

  return (
    <Tag
      {...(onSelect
        ? { type: "button" as const, onClick: onSelect, "aria-expanded": expanded, "aria-controls": controls }
        : {})}
      initial={reduced ? false : { opacity: 0, y: TRAVEL.text, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.5 + index * STAGGER.loose,
        duration: DUR.base,
        ease: EASE,
      }}
      className={cn(
        "group flex w-full flex-col items-center gap-2.5 text-center sm:gap-3",
        onSelect &&
          "cursor-pointer rounded-2xl p-1.5 outline-none transition-colors duration-300 hover:bg-accent/[0.07] focus-visible:ring-2 focus-visible:ring-accent/70",
        expanded && "bg-accent/[0.09]",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "text-accent transition-transform duration-300 ease-out",
          "group-hover:-translate-y-0.5 group-hover:scale-110",
          "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100",
          "[&_svg]:h-10 [&_svg]:w-10 sm:[&_svg]:h-12 sm:[&_svg]:w-12",
          // a touch of weight, so a 48px line icon still reads as a mark
          "[&_svg]:stroke-[1.4]",
          expanded && "-translate-y-0.5 scale-110"
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "max-w-[15ch] text-[12px] font-semibold uppercase leading-tight tracking-[0.14em] transition-colors duration-300 group-hover:text-accent sm:text-[13px]",
          expanded ? "text-accent" : "text-foreground-muted"
        )}
      >
        {children}
      </span>
    </Tag>
  );
}
