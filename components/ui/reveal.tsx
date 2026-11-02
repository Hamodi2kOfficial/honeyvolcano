"use client";

import * as React from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";

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
  const controls = useAnimationControls();
  const Tag = motion[as];

  // Arriving is for things you are about to read. Something the scroll has
  // already carried off the top of the window has no arrival to show, so it
  // is simply put in its final state: on a flick down a long page that is
  // most of the section, and animating all of them was work nobody could
  // ever see. It still ends up visible, which is the part that matters —
  // leaving it hidden is the bug this replaced.
  const show = React.useCallback(
    (entry: IntersectionObserverEntry | null) => {
      // The observer already measured it for us; asking the element again
      // would force a layout in the middle of a scroll.
      const past = (entry?.boundingClientRect.bottom ?? 1) < 0;
      void controls.start({
        opacity: 1,
        y: 0,
        transition: past || reduced ? { duration: 0 } : { duration: 0.7, ease: EASE, delay },
      });
    },
    [controls, delay, reduced]
  );

  // Both of these are attached whatever the motion preference. useReducedMotion
  // reports null on the first render and the truth on the second, so `initial`
  // can be the hidden state before we know — and dropping the animation once we
  // do know left the content hidden for good. For a reduced-motion visitor the
  // reveal still runs; it just takes no time.
  return (
    <Tag
      initial={reduced ? false : { opacity: 0, y }}
      animate={controls}
      onViewportEnter={show}
      viewport={IN_VIEW}
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
