"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Handshake, Heart, Leaf, Scale, Sparkles } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { Stamp } from "@/components/ui/stamp";
import { IcelandFlag, LithuaniaFlag } from "@/components/ui/flags";
import { useAsset } from "@/components/live-content";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

/**
 * The hero: film in the middle, logo down one side, six seals around it.
 *
 * Layout changes shape rather than shrinking:
 *  • xl and up — a three-column grid. Logo and three seals on the left, the
 *    film in the centre, three more seals on the right. Nothing overlaps the
 *    film, because each lives in its own grid cell.
 *  • below xl — logo above the film, all six seals in a two-column grid
 *    directly beneath it, so every seal is on screen the moment you land.
 */

const STAMP_ICONS = [
  <Sparkles key="1" />,
  <Leaf key="2" />,
  <Scale key="3" />,
  null,
  <span key="5" className="inline-flex items-center gap-1">
    <LithuaniaFlag className="h-3" />
    <IcelandFlag className="h-3" />
  </span>,
  <span key="6" className="inline-flex items-center gap-1">
    <Handshake />
    <Heart />
  </span>,
];

function Stamps({ from, to, className }: { from: number; to: number; className?: string }) {
  const { t } = useI18n();
  const keys = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;
  return (
    <>
      {keys.slice(from, to).map((k, i) => (
        <Stamp key={k} index={from + i} icon={STAMP_ICONS[from + i]} className={className}>
          {t.stamps[k]}
        </Stamp>
      ))}
    </>
  );
}

function HeroFilm() {
  const film = useAsset("video.file", "/reliable-source.mp4");
  const ref = React.useRef<HTMLVideoElement>(null);

  // Autoplay is muted and inline, which every current browser allows. If one
  // still refuses, the film simply sits on its first frame — nothing breaks.
  React.useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-accent/25 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
      <video
        ref={ref}
        src={film}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label="Honey Volcano — raw honey from a reliable source"
        className="block aspect-video h-auto w-full bg-bg-soft object-cover"
      />
      {/* a touch of warmth over the film so it belongs to the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"
      />
    </div>
  );
}

export function Hero() {
  const logo = useAsset("hero.logo", "/logo-home.png");
  const { t } = useI18n();
  const reduced = useReducedMotion();

  const intro = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.85, ease: EASE },
  });

  return (
    <section
      id="top"
      className="relative flex items-center overflow-hidden bg-background pb-14 pt-[104px] xl:min-h-[100svh] xl:pb-20 xl:pt-[120px]"
    >
      {/* warm glow behind everything — decorative, never over the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
        <div className="grid items-center gap-8 xl:grid-cols-[minmax(240px,1fr)_minmax(0,2.1fr)_minmax(240px,1fr)] xl:items-stretch xl:gap-10">
          {/* ---- Left: the logo, and the first three seals on wide screens ---- */}
          <div className="flex flex-col items-center gap-7 xl:items-start xl:justify-between xl:gap-0">
            <motion.div {...intro(0.1)} className="w-[180px] sm:w-[220px] xl:w-full xl:max-w-[260px]">
              <Image
                src={logo}
                alt="Honey Volcano"
                width={1024}
                height={1024}
                priority
                quality={95}
                sizes="(max-width: 1279px) 220px, 260px"
                className="h-auto w-full"
              />
            </motion.div>

            <motion.p
              {...intro(0.25)}
              className="max-w-xs text-center font-display text-[11px] uppercase leading-relaxed tracking-[0.34em] text-accent xl:mt-5 xl:text-left"
            >
              {t.hero.tagline}
            </motion.p>

            <div className="hidden w-full flex-col gap-3 xl:flex">
              <Stamps from={0} to={3} />
            </div>
          </div>

          {/* ---- Centre: the film, the line and the call ---- */}
          <motion.div {...intro(0.18)} className="flex flex-col items-center justify-center gap-6">
            <HeroFilm />

            <p className="max-w-xl text-center text-[15px] font-light leading-relaxed text-foreground-muted md:text-base">
              {t.hero.lead}
            </p>

            <CallButton size="lg" showCopy />
          </motion.div>

          {/* ---- Right: the last three seals on wide screens ---- */}
          <div className="hidden w-full flex-col gap-3 xl:flex">
            {/* spacer: drops the three seals level with the ones on the left */}
            <span aria-hidden className="flex-1" />
            <Stamps from={3} to={6} />
          </div>
        </div>

        {/* ---- Below xl: all six seals, straight under the film ---- */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 xl:hidden">
          <Stamps from={0} to={6} />
        </div>
      </div>
    </section>
  );
}
