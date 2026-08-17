"use client";

import { motion } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

const soft = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE, delay: i * 0.15 },
  }),
};

export function BeekeeperLetter() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-[#151515] py-28 text-[#f4f4f4] md:py-40">
      {/* soft gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
      />

      {/* faint drifting honeycomb hexagons */}
      {[
        { left: "7%", top: "16%", size: 120, dur: 46 },
        { left: "82%", top: "20%", size: 92, dur: 58 },
        { left: "13%", top: "66%", size: 78, dur: 50 },
        { left: "80%", top: "64%", size: 132, dur: 64 },
      ].map((h, i) => (
        <motion.svg
          key={i}
          aria-hidden
          viewBox="0 0 100 115"
          width={h.size}
          height={h.size * 1.15}
          className="pointer-events-none absolute text-[#D4AF37]"
          style={{ left: h.left, top: h.top, opacity: 0.06 }}
          animate={{ rotate: 360 }}
          transition={{ duration: h.dur, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M50 2 L95 28 V86 L50 112 L5 86 V28 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </motion.svg>
      ))}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <motion.p
          variants={soft}
          custom={0}
          className="mb-8 text-xs font-light uppercase tracking-[0.4em] text-[#D4AF37]/80"
        >
          {t.letter.eyebrow}
        </motion.p>

        <motion.h2
          variants={soft}
          custom={1}
          className="whitespace-pre-line font-serif text-4xl font-light italic leading-[1.15] text-[#f4f4f4] md:text-6xl"
        >
          {t.letter.heading}
        </motion.h2>

        <motion.p
          variants={soft}
          custom={2}
          className="mx-auto mt-10 max-w-xl text-lg font-light leading-relaxed text-[#f4f4f4]/70"
        >
          {t.letter.p1}
        </motion.p>
        <motion.p
          variants={soft}
          custom={3}
          className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-[#f4f4f4]/70"
        >
          {t.letter.p2}
        </motion.p>
        <motion.p
          variants={soft}
          custom={4}
          className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-[#f4f4f4]/70"
        >
          {t.letter.p3}
        </motion.p>

        <motion.p
          variants={soft}
          custom={5}
          className="mt-12 font-serif text-xl font-light italic tracking-wide text-[#D4AF37]"
        >
          {t.letter.signature}
        </motion.p>
      </motion.div>
    </section>
  );
}
