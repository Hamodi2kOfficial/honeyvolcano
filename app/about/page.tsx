"use client";

import Image from "next/image";
import { Link } from "@/components/ui/link";
import { ArrowRight, Handshake, Leaf, PackageOpen, Scale, ShieldCheck, Sparkles } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { VolcanoMark } from "@/components/ui/volcano-mark";
import { IcelandFlag, LithuaniaFlag } from "@/components/ui/flags";
import { useI18n } from "@/components/i18n";

/** The six values, as seals that match the ones in the hero. */
function Values() {
  const { t } = useI18n();
  const items = [
    { icon: <Sparkles />, title: t.about.v1t, body: t.about.v1d },
    { icon: <Leaf />, title: t.about.v2t, body: t.about.v2d },
    { icon: <Scale />, title: t.about.v3t, body: t.about.v3d },
    { icon: <PackageOpen />, title: t.about.v4t, body: t.about.v4d },
    {
      icon: (
        <span className="inline-flex items-center gap-1">
          <LithuaniaFlag className="h-3.5" />
          <IcelandFlag className="h-3.5" />
        </span>
      ),
      title: t.about.v5t,
      body: t.about.v5d,
    },
    { icon: <Handshake />, title: t.about.v6t, body: t.about.v6d },
  ];

  return (
    <section className="bg-bg-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <VolcanoMark className="mx-auto h-9 w-9 text-accent" />
          <h2 className="mt-5 font-serif text-[30px] font-light text-foreground md:text-[40px]">
            {t.about.valuesHeading}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v) => (
            <RevealItem key={v.title} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-[18px] border border-accent/25 bg-accent/[0.05] p-6 transition-colors duration-300 hover:border-accent/55 hover:bg-accent/[0.09]">
                <span aria-hidden className="text-accent [&_svg]:h-5 [&_svg]:w-5">
                  {v.icon}
                </span>
                <h3 className="font-display text-[12px] uppercase leading-snug tracking-[0.16em] text-accent">
                  {v.title}
                </h3>
                {/* Spanish and Russian give the values as names only, so the
                    card is the name — no empty paragraph underneath it. */}
                {v.body && (
                  <p className="text-sm font-light leading-relaxed text-foreground-muted">
                    {v.body}
                  </p>
                )}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="relative bg-background">

      {/* ---- Opening: the plains where it starts ---- */}
      <section className="relative overflow-hidden pt-[120px] md:pt-[150px]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
              {t.about.eyebrow}
            </p>
            <RevealWords
              as="h1"
              text={t.about.title}
              className="mt-4 font-display text-[34px] leading-tight tracking-[0.12em] text-foreground md:text-[48px]"
            />
            <p className="mt-3 font-serif text-xl font-light italic text-accent md:text-2xl">
              {t.about.tagline}
            </p>

            <div className="mt-8 flex flex-col gap-5 text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
              <Image
                src="/sections/lithuanian-plains.webp"
                alt="Painted wooden beehives at the edge of a Lithuanian wildflower meadow in summer"
                width={1920}
                height={1072}
                priority
                sizes="(max-width: 1023px) 92vw, 48vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- The volcano image, full width ---- */}
      <Reveal className="relative">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden px-5 md:px-8">
          <div className="relative overflow-hidden rounded-[26px] border border-border">
            <Image
              src="/sections/honey-lava.webp"
              alt="Golden honey flowing slowly down the black basalt slopes of a volcano at dusk"
              width={1920}
              height={1072}
              sizes="100vw"
              className="h-auto w-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
            />
          </div>
        </div>
      </Reveal>

      {/* ---- The middle of the story ---- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <div className="flex flex-col gap-5 text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
            <Reveal as="p">{t.about.p4}</Reveal>
            <Reveal as="p">{t.about.p5}</Reveal>
            <Reveal as="p" className="font-serif text-xl italic text-foreground">
              {t.about.p6}
            </Reveal>
            <Reveal as="p">{t.about.p7}</Reveal>
          </div>

          <Reveal delay={0.1} className="mt-9 flex justify-center">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-accent/45 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              {t.about.openList}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal
            as="p"
            delay={0.15}
            className="mt-10 text-[15px] font-light leading-relaxed text-foreground-muted md:text-base"
          >
            {t.about.p8}
          </Reveal>
        </div>
      </section>

      {/* ---- Hand to hand ---- */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
              <Image
                src="/sections/hand-to-hand.webp"
                alt="A beekeeper's hands passing a jar of honey into a younger pair of hands"
                width={1920}
                height={1280}
                sizes="(max-width: 1023px) 92vw, 48vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ShieldCheck aria-hidden className="h-6 w-6 text-accent" />
            <h2 className="mt-4 whitespace-pre-line font-serif text-[28px] font-light leading-tight text-foreground md:text-[36px]">
              {t.home.s2Heading}
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-foreground-muted">
              {t.home.s2Body}
            </p>
            <div className="mt-7">
              <CallButton size="md" />
            </div>
          </Reveal>
        </div>
      </section>

      <Values />

      {/* ---- Sign-off ---- */}
      <section className="py-20 text-center md:py-28">
        <Reveal className="mx-auto max-w-xl px-5 md:px-8">
          <VolcanoMark className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-6 font-display text-xl tracking-[0.3em] text-foreground md:text-2xl">
            {t.about.close1}
          </p>
          <p className="mt-3 font-serif text-2xl font-light italic text-accent md:text-3xl">
            {t.about.close2}
          </p>
          <div className="mt-9 flex justify-center">
            <CallButton size="lg" showCopy />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
