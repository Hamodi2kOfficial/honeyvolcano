"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { DUR, EASE, IN_VIEW } from "@/lib/motion";
import { useCoarsePointer } from "@/lib/use-coarse-pointer";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven pieces, all from the one motion system in lib/motion.
 *
 * Adapted from a 21st.dev scroll-reveal pattern, with one change: the
 * original drives `width` and `borderRadius`, which are layout and paint on
 * every frame of a scroll. These drive transform and opacity only, with the
 * single exception of the clip-path wipe below, which runs once per element
 * and is composited for a simple inset.
 *
 * Every one of these returns its children untouched under
 * `prefers-reduced-motion`, so the page is still, complete and readable.
 *
 * Two of them — Parallax and SectionTint — stand down on a touch screen.
 * They are the two that run a spring every frame of every scroll for the
 * whole length of a section, and the two whose absence is hardest to
 * notice: 60px of drift and a tint that fades in and out. A thumb scroll is
 * the one moment a phone has no frames to spare, and it is already smooth
 * on its own. The reveals, the wipes and the settling zoom all stay.
 *
 * These are scroll-*linked*: the spring smooths the raw progress so that
 * Lenis's own easing and this motion do not fight each other.
 */

const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };

/** How far through its own passage across the viewport a section is, 0 to 1. */
function usePassage(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return useSpring(scrollYProgress, SPRING);
}

/**
 * Drifts its child against the scroll, so the picture and the words beside it
 * do not move as one slab. `strength` is the total travel in pixels.
 */
export function Parallax({
  children,
  strength = 60,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const progress = usePassage(ref);
  const y = useTransform(progress, [0, 1], [strength / 2, -strength / 2]);

  if (reduced || coarse) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Settles a picture from slightly too close as its section comes up. Scale
 * only — the frame around it never changes size, so nothing reflows.
 */
export function ScrollZoom({
  children,
  from = 1.12,
  className,
}: {
  children: React.ReactNode;
  from?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const smooth = useSpring(scrollYProgress, SPRING);
  const scale = useTransform(smooth, [0, 1], [from, 1]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ scale }}>{children}</motion.div>
    </div>
  );
}

/**
 * Wipes a picture open from one edge as it arrives. Once, then it stays open.
 * `inset()` is the cheap clip-path shape — a rectangle, not an arbitrary path.
 */
export function MaskReveal({
  children,
  from = "left",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  from?: "left" | "right" | "bottom";
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const closed =
    from === "left"
      ? "inset(0% 100% 0% 0% round 26px)"
      : from === "right"
        ? "inset(0% 0% 0% 100% round 26px)"
        : "inset(100% 0% 0% 0% round 26px)";

  if (reduced) return <div className={className}>{children}</div>;

  // The clip goes on an inner element, never on the observed one. An element
  // clipped to nothing cannot reliably report itself as visible, so watching
  // it directly leaves the wipe shut forever — which is exactly what happened
  // the first time this was written.
  return (
    <motion.div
      className={className}
      initial="closed"
      whileInView="open"
      viewport={IN_VIEW}
    >
      <motion.div
        variants={{ closed: { clipPath: closed }, open: { clipPath: "inset(0% 0% 0% 0% round 26px)" } }}
        transition={{ duration: DUR.grand, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * A warm wash that rises and falls as a section passes, so the page changes
 * colour between sections instead of switching at a hard edge. Decorative and
 * behind everything, and it only ever animates opacity.
 */
export function SectionTint({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const progress = usePassage(ref);
  const opacity = useTransform(progress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);

  if (reduced || coarse) return null;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        style={{
          opacity,
          background:
            "radial-gradient(120% 60% at 50% 50%, color-mix(in oklab, var(--accent) 10%, transparent) 0%, transparent 70%)",
        }}
        className={cn("absolute inset-0", className)}
      />
    </div>
  );
}
