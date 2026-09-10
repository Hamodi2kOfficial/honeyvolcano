"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-[#0b0805] text-white"
    >
      {/* Honeycomb backdrop (the former picture band, now the hero) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[9%] h-[118%]">
        <Image
          src="/honeycomb.png"
          alt="Golden honeycomb dripping with raw amber honey"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Contrast scrim: darker toward the centre so the logo reads cleanly */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 44%, rgba(6,4,3,0.5) 0%, rgba(6,4,3,0.3) 46%, rgba(6,4,3,0.58) 100%)",
        }}
      />

      {/* Catch-phrase watermark */}
      <EruptWatermark />

      {/* Center content — the logo + tagline */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            className="relative w-[280px] md:w-[420px]"
          >
            <Image
              src="/logo-home.png"
              alt="Honey Volcano"
              width={1024}
              height={1024}
              priority
              quality={100}
              className="h-auto w-full"
              style={{ filter: "drop-shadow(0 24px 70px rgba(0,0,0,0.55))" }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1, ease: EASE }}
          className="mt-6 max-w-xs font-display text-[11px] uppercase leading-relaxed tracking-[0.42em] text-[#F3CE72]/90 md:max-w-none md:text-sm"
        >
          {t.hero.tagline}
        </motion.p>
      </div>
    </section>
  );
}

function EruptWatermark() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-4xl uppercase leading-none tracking-[0.3em] text-white/[0.13] sm:text-6xl md:text-8xl"
    >
      Let happiness erupt
    </span>
  );
}
