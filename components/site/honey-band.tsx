"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export function HoneyBand() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-[80vh] min-h-[460px] items-center overflow-hidden bg-[#151515] text-white"
    >
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[14%] h-[128%]">
        <Image
          src="/honeycomb.png"
          alt="Golden honeycomb dripping with raw amber honey"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(21,21,21,0.30) 0%, rgba(21,21,21,0.50) 42%, rgba(21,21,21,0.92) 100%)",
        }}
      />

      <div className="relative z-10 ml-auto w-full max-w-xl px-6 text-right md:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
          className="whitespace-pre-line font-serif text-4xl font-light italic leading-[1.12] md:text-6xl"
        >
          {t.band.quote}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="ml-auto mt-6 max-w-md text-base font-light text-white/70"
        >
          {t.band.sub}
        </motion.p>
      </div>
    </section>
  );
}
