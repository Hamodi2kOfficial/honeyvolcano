"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";

import { DUR, EASE, STAGGER, TRAVEL } from "@/lib/motion";

/**
 * The site's one headline reveal: word by word, rising into place, once.
 *
 * Adapted from a 21st.dev word-stagger pattern onto our motion/react stack.
 * Two things differ from the original. It keeps explicit line breaks, so the
 * two-line headings this site is built on can use the same treatment as
 * everything else instead of needing their own. And it animates transform and
 * opacity only — the original's per-word blur is a paint on every frame, and
 * this site holds itself to compositor-only motion.
 *
 * The full text is on the element as `aria-label` and the pieces are hidden
 * from assistive tech, so a screen reader hears one heading, not a word list.
 * Under `prefers-reduced-motion` the heading is simply there.
 */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.04 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: TRAVEL.text },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE },
  },
};

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

export function RevealWords({
  text,
  className,
  as = "h2",
  once = true,
}: {
  text: string;
  className?: string;
  as?: keyof typeof TAGS;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, margin: "-8% 0px" });
  const reduced = useReducedMotion() ?? false;
  const Comp = TAGS[as];

  // Lines first, then words, so a "\n" in the dictionary still breaks the line.
  const lines = text.split("\n").map((line) => line.trim().split(/\s+/));

  if (reduced) {
    return (
      <Comp className={className} style={{ whiteSpace: "pre-line" }}>
        {text}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref as never}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((words, li) => (
        <span key={li} aria-hidden className="block">
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              variants={word}
              className="inline-block"
              style={{ marginRight: "0.25em" }}
            >
              {w}
            </motion.span>
          ))}
        </span>
      ))}
    </Comp>
  );
}
