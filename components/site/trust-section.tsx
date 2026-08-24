"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

const rise = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.12 },
  }),
};

export function TrustSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="relative overflow-hidden bg-background py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="order-2 md:order-1"
        >
          <motion.p
            variants={rise}
            custom={0}
            className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-accent"
          >
            {t.trust.eyebrow}
          </motion.p>
          <motion.h2
            variants={rise}
            custom={1}
            className="whitespace-pre-line font-serif text-4xl font-light leading-[1.08] text-foreground md:text-5xl lg:text-6xl"
          >
            {t.trust.heading}
          </motion.h2>
          <motion.p
            variants={rise}
            custom={2}
            className="mt-7 max-w-md text-base font-light leading-relaxed text-foreground-muted"
          >
            {t.trust.body}
          </motion.p>

          <motion.div
            variants={rise}
            custom={3}
            className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6"
          >
            {[t.trust.point1, t.trust.point2].map((s) => (
              <span
                key={s}
                className="text-sm font-light uppercase tracking-[0.2em] text-foreground/80"
              >
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="order-1 md:order-2"
        >
          <motion.div
            style={{ y: imgY }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-accent/20"
          >
            <Image
              src="/jar-lupine.jpg"
              alt="A jar of Honey Volcano raw forest honey among wild lupine and mountains"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
