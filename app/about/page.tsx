"use client";

import Image from "next/image";
import { Link } from "@/components/ui/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { MaskReveal, Parallax, ScrollZoom, SectionTint } from "@/components/ui/scroll-motion";
import { VolcanoMark } from "@/components/ui/volcano-mark";
import { useI18n } from "@/components/i18n";

/**
 * About Honey Volcano.
 *
 * Every word on this page is the owner's, used exactly as he wrote it. The
 * page therefore takes its shape from the language rather than imposing one:
 * the number of paragraphs differs (Lithuanian has three, English eight),
 * some languages close with a sign-off and some do not, and the values carry
 * a description only where he wrote one.
 *
 * The values show the emoji he put in front of each one rather than icons of
 * our own, because those emoji are his. Nothing here is translated, trimmed
 * or filled in.
 */
function Values() {
  const { t } = useI18n();

  return (
    <section className="relative bg-bg-soft py-20 md:py-28">
      <SectionTint />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal className="text-center">
          <VolcanoMark className="mx-auto h-9 w-9 text-accent" />
          <h2 className="mt-5 font-serif text-[32px] font-light text-foreground md:text-[42px]">
            {t.about.valuesHeading}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Keyed by position, not by the title. He writes exactly six
              values in a fixed order in every language, so position is what
              identifies them — and keying on the title made React throw away
              all six cards and build new ones every time the language
              changed, which is how they came back blank. */}
          {t.about.values.map((value, i) => (
            <RevealItem key={i} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-[18px] border border-accent/25 bg-accent/[0.05] p-6 transition-colors duration-300 hover:border-accent/55 hover:bg-accent/[0.09]">
                {/* No `uppercase` here: he capitalised these himself, and in
                    some languages only part of the line is shouted.
                    `pre-line` keeps the break in the one value he wrote as two
                    lines — a hand on the first, a heart on the second. */}
                <h3 className="whitespace-pre-line font-display text-[16px] leading-snug tracking-[0.1em] text-accent">
                  {value.title}
                </h3>
                {value.body && (
                  <p className="text-sm font-light leading-relaxed text-foreground-muted">
                    {value.body}
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
  const { eyebrow, title, tagline, intro, cta, outro, close1, close2 } = t.about;

  // The opening block holds the first few paragraphs beside the picture; the
  // rest run down the middle of the page. A language with only three keeps
  // them all in the opening.
  const opening = intro.slice(0, 3);
  const rest = intro.slice(3);

  return (
    <main className="relative bg-background">

      {/* ---- Opening: the plains where it starts ---- */}
      <section className="relative overflow-hidden pt-[120px] md:pt-[150px]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          <Reveal>
            {/* No `uppercase`: he wrote "Apie mus" in sentence case and
                "🍯 O NAS" in capitals. Both should stay as he typed them. */}
            {eyebrow && (
              <p className="text-[13px] font-semibold tracking-[0.3em] text-accent">{eyebrow}</p>
            )}
            <RevealWords
              as="h1"
              text={title}
              className="mt-4 font-display text-[37px] leading-tight tracking-[0.12em] text-foreground md:text-[50px]"
            />
            {tagline && (
              <p className="mt-3 font-serif text-xl font-light italic text-accent md:text-2xl">
                {tagline}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-5 text-[19px] font-light leading-relaxed text-foreground-muted md:text-base">
              {opening.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Reveal>

          <Parallax strength={50}>
            <MaskReveal from="right" delay={0.08}>
              <ScrollZoom className="rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
                <Image
                  src="/sections/lithuanian-plains.webp"
                  alt="Painted wooden beehives at the edge of a Lithuanian wildflower meadow in summer"
                  width={1920}
                  height={1072}
                  priority
                  sizes="(max-width: 1023px) 92vw, 48vw"
                  className="h-auto w-full"
                />
              </ScrollZoom>
            </MaskReveal>
          </Parallax>
        </div>
      </section>

      {/* ---- The three of them ---- */}
      {/* This was a painted volcano with honey running down it. He asked for
          the real photograph instead. It is close to square, so it sits in a
          frame of its own width rather than being stretched across the page
          the way the old banner was. */}
      <Reveal className="relative">
        <div className="mx-auto max-w-[620px] px-5 md:px-8">
          <MaskReveal from="bottom">
            <ScrollZoom className="relative rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
              <Image
                src="/gallery/3faces.jpg"
                alt="Three women smiling together, each holding a jar of Honey Volcano honey"
                width={1191}
                height={1168}
                sizes="(max-width: 660px) 92vw, 620px"
                className="h-auto w-full"
              />
            </ScrollZoom>
          </MaskReveal>
        </div>
      </Reveal>

      {/* ---- The rest of his words, then the way to the products ---- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          {rest.length > 0 && (
            <div className="flex flex-col gap-5 text-[19px] font-light leading-relaxed text-foreground-muted md:text-base">
              {rest.map((line, i) => (
                <Reveal as="p" key={i}>
                  {line}
                </Reveal>
              ))}
            </div>
          )}

          {/* He wrote the link to the products in brackets inside the text —
              "(Zobacz listę produktów)", "(Подробнее...)" — and the button
              carries those exact words. In Spanish he wrote no such bracket,
              so Spanish gets no button rather than one worded by us. */}
          {cta && (
            <Reveal delay={0.1} className="mt-9 flex justify-center">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-accent/45 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
              >
                {cta}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Reveal>
          )}

          {outro.length > 0 && (
            <div className="mt-10 flex flex-col gap-5 text-[19px] font-light leading-relaxed text-foreground-muted md:text-base">
              {outro.map((line, i) => (
                <Reveal as="p" key={i} delay={0.15}>
                  {line}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- Hand to hand ---- */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
          <Parallax strength={50}>
            <MaskReveal from="left">
              <ScrollZoom className="rounded-[26px] border border-border shadow-[var(--shadow-soft)]">
                <Image
                  src="/sections/hand-to-hand.webp"
                  alt="A beekeeper's hands passing a jar of honey into a younger pair of hands"
                  width={1920}
                  height={1280}
                  sizes="(max-width: 1023px) 92vw, 48vw"
                  className="h-auto w-full"
                />
              </ScrollZoom>
            </MaskReveal>
          </Parallax>
          {/* Only the call. The heading and paragraph that used to sit here
              were borrowed from the home page — words he never wrote for this
              page, in the middle of words he did. */}
          <Reveal delay={0.1}>
            <ShieldCheck aria-hidden className="h-6 w-6 text-accent" />
            <div className="mt-7">
              <CallButton size="md" />
            </div>
          </Reveal>
        </div>
      </section>

      <Values />

      {/* ---- Sign-off, where he wrote one ---- */}
      <section className="py-20 text-center md:py-28">
        <Reveal className="mx-auto max-w-xl px-5 md:px-8">
          <VolcanoMark className="mx-auto h-10 w-10 text-accent" />
          {close1 && (
            <p className="mt-6 font-display text-xl tracking-[0.3em] text-foreground md:text-2xl">
              {close1}
            </p>
          )}
          {close2 && (
            <p className="mt-3 font-serif text-2xl font-light italic text-accent md:text-3xl">
              {close2}
            </p>
          )}
          <div className="mt-9 flex justify-center">
            <CallButton size="lg" showCopy />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
