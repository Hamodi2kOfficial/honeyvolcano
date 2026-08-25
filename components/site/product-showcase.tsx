"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

function Feature({
  title,
  align,
  delay,
}: {
  title: string;
  align: "left" | "right";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={
        align === "right"
          ? "text-center md:text-right"
          : "text-center md:text-left"
      }
    >
      <h3 className="text-shimmer font-display text-xl tracking-[0.15em] md:text-2xl">
        {title}
      </h3>
    </motion.div>
  );
}

export function ProductShowcase() {
  const { t } = useI18n();

  return (
    <section
      id="honey"
      className="relative overflow-hidden bg-bg-soft py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-accent">
            {t.product.eyebrow}
          </p>
          <h2 className="font-serif text-5xl font-light text-foreground md:text-6xl">
            {t.product.heading}
          </h2>
        </motion.div>

        {/* Jar + features */}
        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          {/* left features */}
          <div className="flex flex-col gap-12 md:items-end">
            <Feature title={t.product.f1t} align="right" delay={0.1} />
            <Feature title={t.product.f2t} align="right" delay={0.2} />
          </div>

          {/* jar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: EASE }}
            className="mx-auto w-[240px] md:w-[300px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* slow-rotating conic halo */}
              <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.55), transparent 55%, rgba(229,184,105,0.4), transparent)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
              />
              <Image
                src="/jar-clear.png"
                alt="Honey Volcano raw forest honey jar"
                width={696}
                height={1024}
                priority={false}
                className="relative h-auto w-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
          </motion.div>

          {/* right feature */}
          <div className="flex flex-col justify-center md:items-start">
            <Feature title={t.product.f3t} align="left" delay={0.3} />
          </div>
        </div>
      </div>
    </section>
  );
}
