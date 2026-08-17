"use client";

import * as React from "react";
import { motion } from "motion/react";

import { Input } from "@/components/ui/input";
import { OriginButton } from "@/components/ui/origin-button";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type BrandIconProps = { className?: string };

function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FooterCta() {
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
    <footer className="relative overflow-hidden bg-background pt-24 md:pt-36">
      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: EASE }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <h2 className="font-serif text-5xl font-light text-foreground md:text-7xl">
          {t.cta.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base font-light text-foreground-muted">
          {t.cta.subtitle}
        </p>

        {status === "done" ? (
          <p className="mt-9 font-serif text-xl font-light italic text-accent">
            {t.cta.success}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-9 flex max-w-md flex-col items-center gap-3 sm:flex-row"
          >
            <Input
              type="email"
              inputMode="email"
              aria-label={t.cta.placeholder}
              placeholder={t.cta.placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="flex-1"
            />
            <OriginButton
              type="submit"
              className="h-12 w-full border-accent/50 px-8 text-accent sm:w-auto"
            >
              {t.cta.button}
            </OriginButton>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm font-light text-red-400">{t.cta.invalid}</p>
        )}
      </motion.div>

      {/* Footer bar */}
      <div className="mx-auto mt-24 max-w-7xl border-t border-border px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-base tracking-[0.28em] text-accent">
              HONEY&nbsp;VOLCANO
            </p>
            <p className="mt-1 text-xs font-light uppercase tracking-[0.25em] text-foreground-muted">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {[
              { Icon: InstagramIcon, label: "Instagram" },
              { Icon: FacebookIcon, label: "Facebook" },
              { Icon: XIcon, label: "X" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-accent/25 text-foreground/70 transition-colors hover:border-accent/60 hover:text-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs font-light text-foreground-muted">
          © 2026 Honey Volcano · honeyvolcano.com. {t.footer.rights} · {t.footer.made}
        </p>
      </div>
    </footer>
  );
}
