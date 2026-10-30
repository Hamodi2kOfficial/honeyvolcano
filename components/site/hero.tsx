"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HeartHandshake, Leaf, Scale, ShieldCheck } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
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
const WASH_SIDE =
  "linear-gradient(90deg, color-mix(in oklab, var(--bg) 86%, transparent) 0%, color-mix(in oklab, var(--bg) 58%, transparent) 32%, transparent 64%)";
const WASH_UP =
  "linear-gradient(0deg, color-mix(in oklab, var(--bg) 88%, transparent) 0%, color-mix(in oklab, var(--bg) 62%, transparent) 34%, transparent 68%)";

const SEALS = [
  { key: "s1", icon: <BeeIcon /> },
  { key: "s2", icon: <Leaf /> },
  { key: "s3", icon: <Scale /> },
  { key: "s4", icon: <HoneyJarIcon /> },
  { key: "s5", icon: <ShieldCheck /> },
  { key: "s6", icon: <HeartHandshake /> },
] as const;

function HeroFilm({ still }: { still: boolean }) {
  const film = useAsset("video.file", "/reliable-source.mp4");
  const ref = React.useRef<HTMLVideoElement>(null);

  // Autoplay is muted and inline, which every current browser allows. If one
  // still refuses, the film simply sits on its first frame — nothing breaks.
  // A visitor who has asked for less motion gets that first frame on purpose.
  React.useEffect(() => {
    if (still) return;
    ref.current?.play().catch(() => {});
  }, [still]);

  return (
    <video
      ref={ref}
      src={film}
      muted
      loop={!still}
      playsInline
      autoPlay={!still}
      preload="metadata"
      aria-label="Honey Volcano — raw honey from a reliable source"
      className="hv-film absolute inset-0 h-full w-full object-cover"
    />
  );
}

/** The six promises, one line under the film. */
function SealRow() {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-7 md:px-7 md:py-10">
      {/* Below lg the row scrolls sideways rather than breaking into a block:
          it stays one line, and tabIndex keeps it reachable from a keyboard. */}
      <ul
        tabIndex={0}
        aria-label={t.hero.sealsLabel}
        className="hv-rail flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-[14px] lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible"
      >
        {SEALS.map((seal, i) => (
          <li
            key={seal.key}
            className="w-[47%] min-w-[152px] shrink-0 snap-center sm:w-[31%] lg:w-auto lg:min-w-0"
          >
            <Stamp index={i} icon={seal.icon}>
              {t.stamps[seal.key]}
            </Stamp>
          </li>
        ))}
      </ul>
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
      <div className="relative h-[86svh] min-h-[560px] w-full overflow-hidden md:h-[90svh] xl:h-[94svh]">
        <HeroFilm still={reduced} />

        {/* The film itself dissolves toward one edge (`.hv-film`), so what
            the fog is made of is the page's own background showing through.
            These two only deepen it under the words. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{ background: WASH_UP }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: WASH_SIDE }}
        />
        {/* where the film meets the seals */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent"
        />

        {/* ---- In the fog: the logo, the line, the call ---- */}
        <div className="absolute inset-0 flex items-end lg:items-center">
          {/* matches the navbar's own container, so the logo in the fog sits
              directly under the brand mark rather than near the edge */}
          <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-7 lg:pb-0">
            <div className="flex flex-col items-center text-center lg:max-w-[470px] lg:items-start lg:text-left xl:max-w-[520px]">
              <motion.div
                {...intro(0.1)}
                className="w-[112px] sm:w-[140px] md:w-[180px] lg:w-[220px]"
              >
                <Image
                  src={logo}
                  alt="Honey Volcano"
                  width={1024}
                  height={1024}
                  priority
                  quality={95}
                  sizes="(max-width: 767px) 140px, (max-width: 1023px) 180px, 220px"
                  className="h-auto w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                />
              </motion.div>

              {/* Reads as a tagline, but it is what this page is about, so it
                  carries the h1 — the home page had none at all before. */}
              <motion.h1
                {...intro(0.25)}
                className="mt-5 font-display text-[11px] font-normal uppercase leading-relaxed tracking-[0.3em] text-accent sm:text-[12px] md:mt-6 md:text-[13px] md:tracking-[0.26em]"
              >
                {t.hero.tagline}
              </motion.h1>

              <motion.p
                {...intro(0.34)}
                className="mt-3 max-w-md text-[15px] font-light leading-relaxed text-foreground-muted md:mt-4 md:text-base"
              >
                {t.hero.lead}
              </motion.p>

              <motion.div {...intro(0.44)} className="mt-6 md:mt-8">
                <CallButton
                  size="lg"
                  showCopy
                  className="[&>a]:max-sm:h-12 [&>a]:max-sm:px-6 [&>a]:max-sm:text-[14px]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- One line of seals, straight under the film ---- */}
      <SealRow />
    </section>
  );
}
