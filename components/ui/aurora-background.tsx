"use client";

import { motion } from "motion/react";

/**
 * Ambient animated aurora layer — adapted from a 21st.dev component
 * (dhileepkumargm/aurora-background), recolored to the Honey Volcano gold
 * palette, ported to `motion/react`, and made SSR-deterministic so it never
 * causes hydration drift. Drop it as an absolute layer behind hero content.
 */

// Hand-fixed positions as clean strings — no runtime math, so the server (Node)
// and client (Chrome) render byte-identical HTML (Math.sin can differ across
// engines and would trip React hydration).
const STARS: {
  left: string;
  top: string;
  op: number;
  dur: number;
  delay: number;
  s: string;
}[] = [
  { left: "6%", top: "18%", op: 0.5, dur: 4.2, delay: 0.2, s: "2px" },
  { left: "13%", top: "64%", op: 0.4, dur: 3.4, delay: 1.1, s: "2px" },
  { left: "18%", top: "34%", op: 0.7, dur: 4.8, delay: 0.6, s: "3px" },
  { left: "24%", top: "82%", op: 0.35, dur: 3.1, delay: 2.0, s: "2px" },
  { left: "29%", top: "12%", op: 0.6, dur: 4.5, delay: 0.9, s: "2px" },
  { left: "34%", top: "50%", op: 0.45, dur: 3.8, delay: 1.6, s: "2px" },
  { left: "40%", top: "26%", op: 0.65, dur: 4.1, delay: 0.4, s: "3px" },
  { left: "45%", top: "70%", op: 0.4, dur: 3.5, delay: 2.3, s: "2px" },
  { left: "51%", top: "16%", op: 0.55, dur: 4.6, delay: 1.0, s: "2px" },
  { left: "56%", top: "44%", op: 0.5, dur: 3.9, delay: 0.7, s: "2px" },
  { left: "61%", top: "78%", op: 0.35, dur: 3.2, delay: 1.9, s: "2px" },
  { left: "66%", top: "30%", op: 0.7, dur: 4.7, delay: 0.3, s: "3px" },
  { left: "71%", top: "58%", op: 0.45, dur: 3.6, delay: 1.4, s: "2px" },
  { left: "76%", top: "20%", op: 0.6, dur: 4.3, delay: 0.8, s: "2px" },
  { left: "82%", top: "68%", op: 0.4, dur: 3.3, delay: 2.1, s: "2px" },
  { left: "87%", top: "38%", op: 0.55, dur: 4.4, delay: 0.5, s: "2px" },
  { left: "92%", top: "74%", op: 0.35, dur: 3.7, delay: 1.7, s: "2px" },
  { left: "95%", top: "48%", op: 0.6, dur: 4.0, delay: 1.2, s: "3px" },
  { left: "10%", top: "46%", op: 0.45, dur: 3.9, delay: 2.5, s: "2px" },
  { left: "48%", top: "88%", op: 0.4, dur: 3.4, delay: 0.1, s: "2px" },
];

export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Pulsing radial gradients */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 32% 42%, rgba(212,175,55,0.20) 0%, transparent 60%), radial-gradient(circle at 68% 58%, rgba(229,184,105,0.16) 0%, transparent 62%)",
        }}
      />

      {/* Drifting blurred gold blobs */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.30), transparent 70%)" }}
        animate={{ x: [-40, 50, -40], y: [-20, 25, -20], scale: [1, 1.2, 1] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(229,184,105,0.24), transparent 70%)" }}
        animate={{ x: [40, -50, 40], y: [20, -25, 20], scale: [1, 1.3, 1] }}
        transition={{ duration: 42, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/3 h-1/3 w-1/3 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(180,140,40,0.22), transparent 70%)" }}
        animate={{ x: [20, -20, 20], y: [-26, 26, -26], rotate: [0, 360, 0] }}
        transition={{ duration: 52, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Twinkling gold dust — hardcoded string positions/sizes so SSR and
          client HTML match exactly (no hydration mismatch). */}
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#E5B869]"
          style={{ left: s.left, top: s.top, width: s.s, height: s.s }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, s.op, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default AuroraBackground;
