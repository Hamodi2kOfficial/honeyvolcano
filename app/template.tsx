"use client";

import * as React from "react";
import { motion } from "motion/react";

import { EASE } from "@/lib/motion";

/**
 * Re-mounts on every route change (unlike layout.tsx), so each page gently
 * fades/rises in — a soft transition between Home and the Gallery instead of
 * an instant jump.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
