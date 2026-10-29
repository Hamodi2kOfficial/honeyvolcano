"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, Receipt } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { ContactForm } from "@/components/site/contact-form";
import { HiveDecor } from "@/components/site/hive-decor";
import { CallButton } from "@/components/ui/call-button";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";
import { callAriaLabel, formatPhone, telHref } from "@/lib/phone";

function BusinessDetails() {
  const { t } = useI18n();
  const { site } = useLiveContent();

  const rows = [
    { icon: Receipt, label: t.contact.vat, value: "161171" },
    {
      icon: Phone,
      label: t.contact.phoneLabel,
      value: formatPhone(site.phoneIntl),
      href: telHref(site.phoneIntl),
      aria: callAriaLabel(site.phoneIntl),
    },
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: MapPin,
      label: t.contact.addressLabel,
      value: "Miðholt 1, 270 Mosfellsbær, Iceland",
    },
  ];

  return (
    <Reveal className="rounded-[22px] border border-border bg-surface/50 p-7 md:p-8">
      <h2 className="font-display text-[12px] uppercase tracking-[0.26em] text-accent">
        {t.contact.detailsHeading}
      </h2>
      <p className="mt-4 font-serif text-xl font-light text-foreground">Jordanas Golovinas</p>

      <dl className="mt-6 flex flex-col gap-4">
        {rows.map(({ icon: Icon, label, value, href, aria }) => (
          <div key={label} className="flex items-start gap-3.5">
            <Icon aria-hidden className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" />
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                {label}
              </dt>
              <dd className="mt-0.5 text-[15px] font-light text-foreground">
                {href ? (
                  <a
                    href={href}
                    aria-label={aria}
                    className="break-all text-accent transition-colors hover:text-accent-strong"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <HiveDecor />

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-[120px] md:px-8 md:pt-[150px]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealWords
            as="h1"
            text={t.contact.title}
            className="font-serif text-[34px] font-light leading-tight text-foreground md:text-[46px]"
          />
          <p className="mx-auto mt-4 max-w-lg text-[15px] font-light leading-relaxed text-foreground-muted">
            {t.contact.lead}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
            <Image
              src="/sections/contact.webp"
              alt="A jar of honey, a spoon and a cup of tea on a wooden table by a window"
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 1279px) 92vw, 1100px"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* 1 — write to us */}
          <Reveal>
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              {t.contact.writeHeading}
            </h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-foreground-muted">
              {t.contact.writeBody}
            </p>
            <ContactForm className="mt-7" />
          </Reveal>

          {/* 2 — call directly, plus who we are */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0.08} className="rounded-[22px] border border-accent/35 bg-accent/[0.06] p-7 md:p-8">
              <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
                {t.contact.callHeading}
              </h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-foreground-muted">
                {t.contact.callBody}
              </p>
              <div className="mt-6">
                <CallButton size="lg" showCopy className="[&>a]:w-full sm:[&>a]:w-auto" />
              </div>
            </Reveal>

            <BusinessDetails />
          </div>
        </div>
      </section>
    </main>
  );
}
