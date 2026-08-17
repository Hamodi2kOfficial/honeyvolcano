"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { HoneycombCanvas } from "@/components/ui/honeycomb-canvas";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/site/controls";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProductsPage() {
  const { t } = useI18n();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "done" | "error">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <main className="dark relative min-h-[100svh] overflow-hidden bg-[#0b0a08] text-white">
      <HoneycombCanvas />
      <AuroraBackground className="mix-blend-screen" />
      {/* Dark stage: solid behind the logo/title, softening lower so the honey
          cells stay alive around the taste card — keeps everything legible. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0b0a08 0%, rgba(11,10,8,0.95) 34%, rgba(11,10,8,0.62) 56%, rgba(11,10,8,0.5) 74%, rgba(11,10,8,0.76) 100%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-light text-white/70 transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.products.back}
        </Link>
        <span className="hidden font-display text-base tracking-[0.28em] text-accent sm:block">
          HONEY&nbsp;VOLCANO
        </span>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-28 pt-14 text-center md:pt-20">
        {/* logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: EASE }}
          className="relative"
        >
          {/* soft circular gold halo (behind the square logo) */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.16), transparent 66%)" }}
          />
          <Image
            src="/logo-full.jpg"
            alt="Honey Volcano"
            width={360}
            height={360}
            priority
            className="h-auto w-[168px] rounded-md md:w-[208px]"
          />
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5"
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {t.products.badge}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: EASE }}
          className="mt-7 font-serif text-4xl font-light leading-[1.12] md:text-6xl"
        >
          {t.products.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: EASE }}
          className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-white/70"
        >
          {t.products.subtitle}
        </motion.p>

        {/* Taste request card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: EASE }}
          className="mt-16 w-full max-w-lg rounded-3xl border border-accent/20 bg-white/[0.03] p-8 text-left backdrop-blur-md md:p-10"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-accent">
            {t.products.tasteEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-white">
            {t.products.tasteHeading}
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-white/70">
            {t.products.tasteBody}
          </p>

          {status === "done" ? (
            <p className="mt-7 font-serif text-lg font-light italic text-accent">
              {t.products.success}
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                inputMode="email"
                aria-label={t.products.placeholder}
                placeholder={t.products.placeholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="flex-1"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-xl px-7 font-semibold text-[#1c1206] shadow-[0_10px_28px_-10px_rgba(212,175,55,0.6)] ring-1 ring-[#f0d38a]/40 transition-transform duration-300 hover:scale-[1.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #F3CE72 0%, #E5B869 42%, #C79A3B 100%)",
                }}
              >
                {t.products.button}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm font-light text-red-400">{t.products.invalid}</p>
          )}

          {/* the reassurance line */}
          <div className="mt-6 flex items-center gap-2.5 border-t border-white/10 pt-5">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="shrink-0 text-accent">
              <path
                d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M8.5 12l2.3 2.3L15.5 9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm font-light italic text-accent/90">{t.products.tasteNote}</p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
