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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        {/* Left: nav links */}
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <a
            href="#story"
            className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-accent"
          >
            {t.nav.story}
          </a>
          <a
            href="#honey"
            className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-accent"
          >
            {t.nav.honey}
          </a>
          <Link
            href="/products"
            className="text-sm font-light tracking-wide text-white/70 transition-colors hover:text-accent"
          >
            {t.nav.products}
          </Link>
        </nav>

        {/* Center: wordmark */}
        <a
          href="#top"
          className="flex-1 text-center font-display text-lg tracking-[0.28em] text-accent md:text-xl"
        >
          HONEY&nbsp;VOLCANO
        </a>

        {/* Right: controls */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <HoneyCta href="/products" size="sm">
              {t.nav.cta}
            </HoneyCta>
          </div>
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
