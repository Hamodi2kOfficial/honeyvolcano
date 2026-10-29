"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/lib/motion";

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
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

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
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ shown: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
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
  return (
    <motion.div
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
