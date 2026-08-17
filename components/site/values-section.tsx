"use client";

import { motion } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

function HexCheck() {
  return (
    <svg viewBox="0 0 24 26" width="26" height="28" aria-hidden className="text-accent">
      <path
        d="M12 1l9.5 5.5v13L12 25l-9.5-5.5v-13z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <path
        d="M8 13l2.8 2.8L16 10.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay: i * 0.08 },
  }),
};

export function ValuesSection() {
  const { t } = useI18n();
  const points = [
    { title: t.values.t1, desc: t.values.d1 },
    { title: t.values.t2, desc: t.values.d2 },
    { title: t.values.t3, desc: t.values.d3 },
    { title: t.values.t4, desc: t.values.d4 },
  ];

  return (
    <section id="values" className="relative overflow-hidden bg-background py-24 md:py-36">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            variants={rise}
            custom={0}
            className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-accent"
          >
            {t.values.eyebrow}
          </motion.p>
          <motion.h2
            variants={rise}
            custom={1}
            className="whitespace-pre-line font-serif text-4xl font-light leading-[1.1] text-foreground md:text-5xl"
          >
            {t.values.heading}
          </motion.h2>
          <motion.p
            variants={rise}
            custom={2}
            className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-foreground-muted"
          >
            {t.values.lead}
          </motion.p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-9 sm:grid-cols-2">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              variants={rise}
              custom={3 + i}
              className="flex gap-4"
            >
              <div className="mt-0.5 shrink-0">
                <HexCheck />
              </div>
              <div>
                <h3 className="font-display text-base tracking-[0.08em] text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-foreground-muted">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={rise}
          custom={7}
          className="mx-auto mt-16 max-w-2xl border-t border-border pt-10 text-center font-serif text-2xl font-light italic leading-snug text-accent md:text-3xl"
        >
          {t.values.vision}
        </motion.p>
      </motion.div>
    </section>
  );
}
