"use client";

import * as React from "react";
import { motion } from "motion/react";

/**
 * Re-mounts on every route change (unlike layout.tsx). A soft dark curtain
 * lifts to reveal each page, while the content eases in — giving a smooth
 * transition between Home, the Gallery and the order page.
 *
 * The content fade is opacity-only (no transform/filter) so it never turns the
 * wrapper into a containing block for the fixed navbar. The reveal motion lives
 * on a separate fixed overlay.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-[100] bg-[#0b0805]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, #0e0a06 0%, #0b0805 60%, #060403 100%)",
        }}
      />
    </>
  );
}
