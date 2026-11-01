"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE, IN_VIEW } from "@/lib/motion";

/**
 * One scroll reveal for the whole site, so every section arrives the same way.
 *
 * Transform and opacity only, 8–24px of travel, and nothing at all when the
 * visitor has asked for reduced motion — the content is simply there.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Whether the surrounding group has already revealed itself.
 *
 * The group holds the scroll trigger and the children follow it, which works
 * until a child is added after the group has fired. The trigger is `once`, so
 * it never fires again: the new child mounts hidden and stays hidden for
 * good. That is what emptied the About page's values when the language was
 * switched — changing language changes the titles, the titles are the keys,
 * so React replaced all six cards and every one of them came back invisible.
 *
 * A child that arrives late reads this and starts shown instead.
 */
const RevealedContext = React.createContext(false);

/** Staggers its children in on scroll. Pair with <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={IN_VIEW}
      onViewportEnter={() => setRevealed(true)}
      variants={{ shown: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      <RevealedContext.Provider value={revealed}>{children}</RevealedContext.Provider>
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const revealed = React.useContext(RevealedContext);

  return (
    <motion.div
      // `undefined` means "inherit the group's state", which is right while
      // the group is still waiting. Once it has gone, a fresh child starts
      // where the others already are rather than at the beginning.
      initial={revealed ? "shown" : undefined}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 22 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
