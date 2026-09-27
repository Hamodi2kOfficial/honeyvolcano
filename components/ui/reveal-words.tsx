"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";

/**
 * Word-by-word blur-and-rise reveal (adapted from a 21st.dev pattern to our
 * motion/react stack). Inherits the parent's typography — pass the same
 * className you'd give the heading. Use only for single-line text (it collapses
 * whitespace, so it won't preserve manual line breaks).
 */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
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
  const words = text.trim().split(/\s+/);
  const Comp = TAGS[as];

  return (
    <Comp
      ref={ref as never}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          variants={word}
          className="inline-block"
          style={{ marginRight: "0.25em", willChange: "transform, opacity, filter" }}
        >
          {w}
        </motion.span>
      ))}
    </Comp>
  );
}
