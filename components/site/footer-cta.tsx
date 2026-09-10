"use client";

import { motion } from "motion/react";

import { HoneyCta } from "@/components/ui/honey-cta";
import { EruptMark } from "@/components/ui/erupt-mark";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

const PHONE = "+3548340999";
const EMAIL = "golovinasjordanas@gmail.com";

export function FooterCta() {
  const { t } = useI18n();

  return (
    <footer className="relative overflow-hidden bg-background">
      <EruptMark className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-accent/[0.04] sm:text-6xl md:text-7xl" />

      {/* Call-to-taste at the very bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex flex-col items-center px-6 pb-4 pt-20 md:pt-28"
      >
        <HoneyCta href="/products" size="lg">
          {t.products.call}
        </HoneyCta>
      </motion.div>

      <div className="relative mx-auto mt-14 max-w-4xl border-t border-border px-6 py-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center text-xs font-light leading-relaxed text-foreground-muted"
        >
          © 2026 Honey Volcano · honeyvolcano.com. {t.footer.rights} ·{" "}
          <a
            href={`tel:${PHONE}`}
            className="whitespace-nowrap text-foreground/80 transition-colors hover:text-accent"
          >
            {PHONE}
          </a>{" "}
          ·{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            {EMAIL}
          </a>
        </motion.p>
      </div>
    </footer>
  );
}
