"use client";

import { EruptMark } from "@/components/ui/erupt-mark";
import { useI18n } from "@/components/i18n";

const PHONE = "+3548340999";
const EMAIL = "golovinasjordanas@gmail.com";

export function FooterCta() {
  const { t } = useI18n();

  return (
    <footer className="relative overflow-hidden bg-background">
      <EruptMark className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-accent/[0.04] sm:text-6xl md:text-7xl" />

      <div className="relative mx-auto max-w-4xl border-t border-border px-6 py-12">
        <p className="text-center text-xs font-light leading-relaxed text-foreground-muted">
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
        </p>
      </div>
    </footer>
  );
}
