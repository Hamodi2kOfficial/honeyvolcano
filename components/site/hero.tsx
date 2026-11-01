"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HeartHandshake, Leaf, Scale, ShieldCheck } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { OverlayDialog } from "@/components/ui/overlay-dialog";
import { Stamp } from "@/components/ui/stamp";
import { BeeIcon, HoneyJarIcon } from "@/components/ui/bee-icons";
import { useAsset } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { DUR, EASE, TRAVEL } from "@/lib/motion";

/**
 * The hero: the film is the whole first screen, and the page emerges from it.
 *
 * One edge of the film dissolves into fog — a blur masked to that edge, with
 * the page's own background colour washing over it — and the logo, the line
 * and the call sit inside that fog rather than on a panel beside it. The edge
 * is the left on wide screens and the bottom on narrow ones, because a phone
 * has no side to spare.
 *
 * The six seals are no longer scattered around the film. They are one row
 * directly beneath it, pressing in as the visitor scrolls to them.
 */

/**
 * The wash that settles into the fog, so the text has something to sit on
 * and the film does not simply stop. `--bg` is the raw token behind the
 * `background` colour; the Tailwind name does not exist as a CSS variable.
 */
/*
 * There was a second pair of gradients here, a "scrim" drawn in a box behind
 * the text column to lift the words off the picture. It worked, and it left
 * the edges of its own box visible across the film — a pale rectangle round
 * the logo and the tagline. A radial gradient is clipped by the element it
 * is painted on, so unless it reaches full transparency before the element
 * ends, the element's corners are a hard edge.
 *
 * These two do the same job with no box to show: each is painted across the
 * whole film, so the only edges they have are the film's own.
 */
const WASH_SIDE =
  "linear-gradient(90deg," +
  " color-mix(in oklab, var(--bg) 92%, transparent) 0%," +
  " color-mix(in oklab, var(--bg) 74%, transparent) 20%," +
  " color-mix(in oklab, var(--bg) 42%, transparent) 40%," +
  " color-mix(in oklab, var(--bg) 14%, transparent) 58%," +
  " color-mix(in oklab, var(--bg) 0%, transparent) 74%)";
const WASH_UP =
  "linear-gradient(0deg," +
  " color-mix(in oklab, var(--bg) 94%, transparent) 0%," +
  " color-mix(in oklab, var(--bg) 76%, transparent) 18%," +
  " color-mix(in oklab, var(--bg) 42%, transparent) 36%," +
  " color-mix(in oklab, var(--bg) 12%, transparent) 54%," +
  " color-mix(in oklab, var(--bg) 0%, transparent) 70%)";

/**
 * `mark` is the emoji the owner put in front of the matching value on the
 * About page. It is how a seal finds its own explanation: the six values are
 * in a different order in different languages, so position cannot be trusted.
 */
const SEALS = [
  { key: "s1", icon: <BeeIcon />, mark: "🐝" },
  { key: "s2", icon: <Leaf />, mark: "🌿" },
  { key: "s3", icon: <Scale />, mark: "⚖️" },
  { key: "s4", icon: <HoneyJarIcon />, mark: "🍯" },
  { key: "s5", icon: <ShieldCheck />, mark: "🇱🇹" },
  { key: "s6", icon: <HeartHandshake />, mark: "🤝" },
] as const;

function HeroFilm({ still }: { still: boolean }) {
  const film = useAsset("video.file", "/reliable-source.mp4");
  const poster = useAsset("video.poster", "/sections/film-poster.webp");
  const ref = React.useRef<HTMLVideoElement>(null);

  // Autoplay is muted and inline, which every current browser allows. If one
  // still refuses, the film simply sits on its first frame — nothing breaks.
  // A visitor who has asked for less motion gets that first frame on purpose.
  React.useEffect(() => {
    if (still) return;
    ref.current?.play().catch(() => {});
  }, [still]);

  return (
    // The poster is the three of them. It is the first thing on screen while
    // the film loads, and it is what stands there for good if the browser
    // refuses to autoplay or the visitor has asked for less motion — so the
    // hero is never an empty rectangle.
    <video
      ref={ref}
      src={film}
      poster={poster}
      muted
      loop={!still}
      playsInline
      autoPlay={!still}
      preload="metadata"
      aria-label="Honey Volcano — three friends sharing a jar of raw Lithuanian honey"
      className="hv-film absolute inset-0 h-full w-full object-cover"
    />
  );
}

/**
 * The six promises, one line under the film — and what each one means.
 *
 * Pressing a seal opens its explanation below the row. The words are not
 * written here: each seal is one of the six values on the About page, so the
 * panel shows the owner's own fuller wording for it, matched by the emoji he
 * put in front of it rather than by position, because the order of the six
 * differs between languages. Where he wrote a value as a name only, with no
 * sentence under it, the panel shows the name and nothing invented.
 */
function sealDetail(
  values: { title: string; body: string }[],
  mark: string,
  index: number,
) {
  // Most languages lead each value with its emoji, and the order of the six
  // differs between them, so the emoji is what identifies a value. Icelandic
  // is written differently — he puts the emoji at the end of the sentence
  // before — and there position is the only thing to go on. His Icelandic
  // happens to run in the same order as the seals, which is why this works.
  const byMark = values.find((v) => v.title.startsWith(mark));
  const hit = byMark ?? values[index];
  return hit ? { title: hit.title, body: hit.body } : null;
}

function SealRow() {
  const { t } = useI18n();
  const [open, setOpen] = React.useState<number | null>(null);

  // Escape, the backdrop, scroll locking and the focus trap all belong to
  // OverlayDialog now.
  const detail =
    open === null ? null : sealDetail(t.about.values, SEALS[open].mark, open);

  return (
    // The film and this row have to share the first screen of a phone: all
    // six promises are meant to be there without scrolling, and the type is
    // larger than it was, so the film gives up the height.
    <div className="mx-auto w-full max-w-[1400px] px-4 py-5 md:px-7 md:py-9">
      {/* Three and three on a phone, all six on one line from md up. Nothing
          scrolls sideways any more: every promise is on screen the moment the
          page opens, which is the whole point of them. */}
      <ul
        aria-label={t.hero.sealsLabel}
        className="grid grid-cols-3 gap-x-2 gap-y-7 sm:gap-x-4 md:grid-cols-6 md:gap-x-5"
      >
        {SEALS.map((seal, i) => (
          <li key={seal.key} className="flex">
            <Stamp
              index={i}
              icon={seal.icon}
              expanded={open === i}
              controls="hv-seal-detail"
              onSelect={() => setOpen((cur) => (cur === i ? null : i))}
            >
              {t.stamps[seal.key]}
            </Stamp>
          </li>
        ))}
      </ul>

      {/* The explanation used to open underneath the row, which on a phone
          put it below the fold — you pressed a seal and nothing appeared to
          happen. It now comes up in the middle of the screen with the page
          blurred behind it. */}
      <OverlayDialog
        open={detail !== null}
        onClose={() => setOpen(null)}
        label={t.hero.sealsLabel}
        closeLabel={t.hero.sealsClose}
      >
        {detail && (
          <div id="hv-seal-detail">
            <span
              aria-hidden
              className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent [&_svg]:h-9 [&_svg]:w-9 [&_svg]:stroke-[1.4]"
            >
              {SEALS[open!].icon}
            </span>
            <p className="whitespace-pre-line font-display text-[19px] leading-snug tracking-[0.12em] text-accent sm:text-[21px]">
              {detail.title}
            </p>
            {detail.body && (
              <p className="mt-4 text-[20px] font-light leading-relaxed text-foreground-muted sm:text-[21px]">
                {detail.body}
              </p>
            )}
            <div className="mt-7 flex justify-center">
              <CallButton size="md" />
            </div>
          </div>
        )}
      </OverlayDialog>
    </div>
  );
}

export function Hero() {
  const logo = useAsset("hero.logo", "/logo-home.png");
  const { t } = useI18n();
  const reduced = useReducedMotion() ?? false;

  const intro = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: TRAVEL.text },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: DUR.grand * 0.65, ease: EASE },
  });

  return (
    <section id="top" className="relative bg-background">
      {/* ---- The film, the whole first screen ---- */}
      {/* The lg minimum is not decoration. On a short laptop window 70svh is
          less than the logo, the tagline, the line and the button stacked up,
          so the centred column rose until the logo's top went behind the fixed
          navbar — the logo looked cut off. The film now never gets shorter
          than what stands in it. */}
      {/* The film takes most of the first screen on a phone. The seals used
          to be squeezed in above the fold with it, which left the film short;
          the owner would rather see the film and scroll a little for them.
          The minimum still guarantees the column clears the navbar on a short
          window — 78svh wins above ~580px tall, the minimum below it. */}
      {/* On a phone the film takes whatever is left once the words below it
          have their space — about 370px for the logo, the line, the sentence
          and the call. A plain svh fraction cannot do that: the words are a
          fixed height while a fraction scales, so the call button fell off
          the bottom of a small phone and left a gap on a large one. Floor
          and ceiling keep it sane at both extremes. */}
      <div className="relative h-[calc(100svh-390px)] max-h-[58svh] min-h-[240px] w-full overflow-hidden md:h-[76svh] md:max-h-none md:min-h-[560px] xl:h-[78svh]">
        <HeroFilm still={reduced} />

        {/* The film itself dissolves toward one edge (`.hv-film`), so what
            the fog is made of is the page's own background showing through.
            These two only deepen it under the words. */}
        {/* Only from `md` up, where the words still sit on the film. On a
            phone they are underneath it now, so there is nothing to make
            readable and no reason to dim the picture at all. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block lg:hidden"
          style={{ background: WASH_UP }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: WASH_SIDE }}
        />
        {/* where the film ends and the page takes over */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/55 to-background/0"
        />
      </div>

      {/*
        One column of words, in two places depending on the screen.
        On a phone it is a block in the ordinary flow, directly under the
        film: the logo was covering the very thing it was sitting on. From
        `md` up there is room beside and under the words, so it goes back to
        being an overlay — the same height box as the film above it, which is
        why those height classes are repeated here rather than `inset-0`.
      */}
      <div className="relative z-10 md:absolute md:inset-x-0 md:top-0 md:flex md:h-[76svh] md:min-h-[560px] md:items-end md:pt-[76px] lg:items-center xl:h-[78svh]">
        {/* matches the navbar's own container, so the logo sits directly
            under the brand mark rather than near the edge */}
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-2 pt-7 md:px-7 md:pb-10 md:pt-0 lg:pb-0">
          <div className="relative flex flex-col items-center text-center lg:max-w-[470px] lg:items-start lg:text-left xl:max-w-[520px]">
            <motion.div
              {...intro(0.1)}
              // Smaller than it was at every size: it is a mark, not the
              // subject, and the subject is the film behind it.
              className="w-[96px] sm:w-[112px] md:w-[142px] lg:w-[176px]"
            >
              <Image
                src={logo}
                alt="Honey Volcano"
                width={1024}
                height={1024}
                priority
                quality={95}
                sizes="(max-width: 767px) 112px, (max-width: 1023px) 142px, 176px"
                className="h-auto w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              />
            </motion.div>

            {/* Reads as a tagline, but it is what this page is about, so it
                  carries the h1 — the home page had none at all before. */}
            <motion.h1
              {...intro(0.25)}
              // Not gold, and not light. This line lands on the brightest
              // part of the photograph — the honey running off the dipper —
              // and gold on gold cannot be read at any weight. The brand
              // colour is carried by the logo above it and the call button
              // below it; this one line is the text colour so it can be
              // read at a glance in both themes.
              className="hv-halo mt-5 font-display text-[14px] font-semibold uppercase leading-relaxed tracking-[0.26em] text-foreground sm:text-[16px] md:mt-6 md:text-[18px] md:tracking-[0.24em]"
            >
              {t.hero.tagline}
            </motion.h1>

            <motion.p
              {...intro(0.34)}
              className="hv-halo mt-3 max-w-md text-[19px] font-normal leading-relaxed text-foreground md:mt-4 md:text-base"
            >
              {t.hero.lead}
            </motion.p>

            <motion.div {...intro(0.44)} className="mt-6 md:mt-8">
              <CallButton
                size="lg"
                showCopy
                className="[&>a]:max-sm:h-12 [&>a]:max-sm:px-6 [&>a]:max-sm:text-[18px]"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ---- One line of seals, straight under the film ---- */}
      <SealRow />
    </section>
  );
}
