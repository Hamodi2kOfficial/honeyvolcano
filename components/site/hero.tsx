"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { HoneyCta } from "@/components/ui/honey-cta";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-[#090405] text-white"
    >
      {/* Center content — the logo on a matching black backdrop */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: EASE }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            className="relative w-[300px] md:w-[440px]"
          >
            <Image
              src="/logo-full.png"
              alt="Honey Volcano — Raw Forest Honey"
              width={640}
              height={640}
              priority
              className="h-auto w-full"
              style={{ filter: "drop-shadow(0 20px 70px rgba(212,175,55,0.22))" }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1, ease: EASE }}
          className="mt-4 font-display text-xs uppercase tracking-[0.5em] text-[#D4AF37]/90 md:text-sm"
        >
          {t.footer.tagline}
        </motion.p>

        {/* Signature CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 1, ease: EASE }}
          className="mt-9"
        >
          <HoneyCta href="/products">{t.nav.cta}</HoneyCta>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-white/40"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
