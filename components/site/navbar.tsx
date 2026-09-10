"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { HoneyCta } from "@/components/ui/honey-cta";
import { LanguageSwitcher } from "@/components/site/controls";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export function Navbar() {
  const { t } = useI18n();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 md:px-8">
        {/* Left: gallery link */}
        <nav className="flex shrink-0 items-center">
          <Link
            href="/gallery"
            className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-accent"
          >
            {t.nav.gallery}
          </Link>
        </nav>

        {/* Center: wordmark — absolutely centered so side widths can't pull it off-centre (hidden on small screens) */}
        <a
          href="#top"
          className="absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-display text-lg tracking-[0.28em] text-accent sm:block md:text-xl"
        >
          HONEY&nbsp;VOLCANO
        </a>

        {/* Right: call-to-taste + language */}
        <div className="flex shrink-0 items-center gap-2.5">
          <HoneyCta href="/products" size="sm">
            {t.products.call}
          </HoneyCta>
          <LanguageSwitcher />
        </div>
      </div>

      {/* glass base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 border-b border-white/5 bg-[#0e0c0a]/40 backdrop-blur-md"
      />
    </motion.header>
  );
}
