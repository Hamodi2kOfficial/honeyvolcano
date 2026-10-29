"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { HiveDecor } from "@/components/site/hive-decor";
import { ProductCatalog } from "@/components/site/product-catalog";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { CallButton } from "@/components/ui/call-button";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { useAsset, useLiveContent } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export default function ProductsPage() {
  const forms = useLiveContent().marketing?.forms;
  const logo = useAsset("products.logo", "/logo-full.png");
  const { t } = useI18n();

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background">

      {/* Jars, drips, comb and bees drifting down both margins — decorative,
          behind the content, and only where there is margin to spare. */}
      <HiveDecor />

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-[120px] text-center md:px-8 md:pt-[140px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent) 18%, transparent), transparent 66%)",
            }}
          />
          <Image
            src={logo}
            alt="Honey Volcano"
            width={360}
            height={360}
            priority
            className="h-auto w-[150px] rounded-md md:w-[190px]"
          />
        </motion.div>

        {/* The first thing to do on this page, directly under the logo. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
          className="mt-8"
        >
          <CallButton size="lg" showCopy />
        </motion.div>

        <RevealWords
          as="h1"
          text={t.products.title}
          className="mt-10 font-serif text-[30px] font-light leading-tight text-foreground md:text-[40px]"
        />
        <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-foreground-muted">
          {t.products.subtitle}
        </p>
      </section>

      <ProductCatalog />

      {/* Or leave your details instead of calling — lands in the owner's inbox */}
      {forms?.onProductsPage !== false && (
        <Reveal className="relative z-10 mx-auto mb-28 w-full max-w-lg px-5 md:px-8">
          <div className="rounded-3xl border border-border bg-surface/60 p-7 text-left backdrop-blur-md md:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              {t.products.tasteEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-foreground">
              {t.products.tasteHeading}
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-foreground-muted">
              {t.products.tasteBody}
            </p>

            <div className="mt-7">
              <CallButton size="md" className="[&>a]:w-full" />
            </div>

            <EnquiryForm
              className="mt-7 text-left"
              source="Products page — taste request"
              buttonLabel={t.products.button}
              askPhone={forms?.askPhone !== false}
            />

            <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-5">
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
          </div>
        </Reveal>
      )}
    </main>
  );
}
