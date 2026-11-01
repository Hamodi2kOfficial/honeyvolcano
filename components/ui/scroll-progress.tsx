"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * A hairline of honey across the top of the window that fills as you read.
 *
 * It is the one piece of motion on the site tied directly to the scroll
 * position rather than to arriving in view, which is what makes a long page
 * feel like it is going somewhere. `scaleX` on a spring: one compositor
 * property, no layout, no paint.
 *
 * Hidden under `prefers-reduced-motion` — a bar that tracks the scroll is
 * exactly the kind of constant movement that setting asks us to stop.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion() ?? false;
  const width = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent/40 via-accent to-amber"
    />
  );
}
