"use client";

import Link from "next/link";

import { VolcanoMark } from "@/components/ui/volcano-mark";
import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { callAriaLabel, formatPhone, telHref } from "@/lib/phone";

/**
 * The site footer: who the business is, how to reach it, and where everything
 * lives. Rendered once in the root layout, so it is on every page.
 *
 * The phone is a tel: link with the country code and the email a mailto: — the
 * two things a visitor is most likely to want from a footer.
 */
export function SiteFooter() {
  const { t } = useI18n();
  const { site } = useLiveContent();
  const pretty = formatPhone(site.phoneIntl);
  const year = 2026;

  const pages = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/where-to-buy", label: t.nav.stores },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
    { href: "/gallery", label: t.nav.gallery },
  ];

  return (
    <footer className="border-t border-border bg-bg-soft pb-28 pt-16 lg:pb-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[1.3fr_1fr_1.1fr]">
        {/* Who */}
        <div>
          <div className="flex items-center gap-2.5 text-accent">
            <VolcanoMark className="h-8 w-8" />
            <span className="font-display text-base tracking-[0.26em]">HONEY&nbsp;VOLCANO</span>
          </div>
          <p className="mt-4 text-sm font-light leading-relaxed text-foreground-muted">
            {t.footer.tagline}
            <br />
            {t.footer.made}
          </p>
          <p className="mt-5 font-display text-[11px] uppercase tracking-[0.3em] text-accent/80">
            {t.about.tagline}
          </p>
        </div>

        {/* Where */}
        <nav aria-label={t.footer.pages}>
          <h2 className="font-display text-[11px] uppercase tracking-[0.28em] text-foreground">
            {t.footer.pages}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm font-light text-foreground-muted transition-colors hover:text-accent"
                >
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/privacy"
                className="text-sm font-light text-foreground-muted transition-colors hover:text-accent"
              >
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </nav>

        {/* How */}
        <div>
          <h2 className="font-display text-[11px] uppercase tracking-[0.28em] text-foreground">
            {t.footer.contact}
          </h2>
          <address className="mt-4 flex flex-col gap-2 text-sm font-light not-italic leading-relaxed text-foreground-muted">
            <span className="text-foreground">Jordanas Golovinas</span>
            <span>
              {t.contact.vat} 161171
            </span>
            <a
              href={telHref(site.phoneIntl)}
              aria-label={callAriaLabel(site.phoneIntl)}
              className="w-fit tabular-nums text-accent transition-colors hover:text-accent-strong"
            >
              {pretty}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="w-fit break-all text-accent transition-colors hover:text-accent-strong"
            >
              {site.email}
            </a>
            <span>Miðholt 1, 270 Mosfellsbær, Iceland</span>
          </address>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-border px-5 pt-6 md:px-8">
        <p className="text-center text-xs font-light text-foreground-muted">
          © {year} Honey Volcano · honeyvolcano.com. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
