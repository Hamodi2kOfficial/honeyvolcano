"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { EruptMark } from "@/components/ui/erupt-mark";
import { IcelandFlag, LithuaniaFlag } from "@/components/ui/flags";
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
      <EruptMark className="bottom-4 left-1/2 -translate-x-1/2 text-4xl text-accent/[0.045] sm:text-6xl md:text-8xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="order-2 md:order-1"
        >
          <motion.h2
            variants={rise}
            custom={0}
            className="whitespace-pre-line font-serif text-4xl font-light leading-[1.08] text-foreground md:text-5xl lg:text-6xl"
          >
            {t.trust.heading}
          </motion.h2>
          <motion.p
            variants={rise}
            custom={1}
            className="mt-7 text-base font-light uppercase tracking-[0.2em] text-foreground/80"
          >
            {t.trust.line}
          </motion.p>
          <motion.div
            variants={rise}
            custom={2}
            className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-sm font-light uppercase tracking-[0.2em] text-foreground/70"
          >
            <span>{t.trust.authorized}</span>
            <IcelandFlag className="h-4" />
            <LithuaniaFlag className="h-4" />
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
              src="/trust-jar.png"
              alt="A jar of Honey Volcano raw honey among wild lupine and mountains"
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
