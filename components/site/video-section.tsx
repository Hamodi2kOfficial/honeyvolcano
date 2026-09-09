"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";

import { HoneycombCanvas } from "@/components/ui/honeycomb-canvas";
import { HoneyCta } from "@/components/ui/honey-cta";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";

export function VideoSection() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const playedRef = useRef(false);

  // Play the film once, the moment it scrolls into view.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      video.play().then(
        () => setNeedsTap(false),
        () => {
          // Autoplay blocked — let the viewer start it with a tap.
          playedRef.current = false;
          setNeedsTap(true);
        }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            tryPlay();
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const startTap = () => {
    const video = videoRef.current;
    if (!video) return;
    playedRef.current = true;
    setNeedsTap(false);
    video.play().catch(() => setNeedsTap(true));
  };

  return (
    <section className="relative overflow-hidden bg-[#0b0805] py-20 md:py-28">
      {/* Interactive honey cells */}
      <HoneycombCanvas />

      {/* Catch-phrase watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none whitespace-nowrap font-display text-3xl uppercase leading-none tracking-[0.3em] text-white/[0.05] sm:text-5xl md:text-7xl"
      >
        Let happiness erupt
      </span>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5">
        {/* Film */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative w-full overflow-hidden rounded-3xl ring-1 ring-accent/25 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
        >
          <video
            ref={videoRef}
            src="/reliable-source.mp4"
            muted
            playsInline
            preload="metadata"
            onEnded={() => setDone(true)}
            onClick={startTap}
            className="h-auto w-full"
          />

          {/* Tap-to-play fallback if autoplay is blocked */}
          {needsTap && (
            <button
              type="button"
              onClick={startTap}
              aria-label="Play"
              className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[1px]"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent/90 text-[#1c1206] shadow-lg">
                <Play className="ml-0.5 h-7 w-7" fill="currentColor" />
              </span>
            </button>
          )}
        </motion.div>

        {/* Button — reveals only once the film has finished. The wrapper keeps
            its height so the reveal never shifts the layout. */}
        <div className="flex h-24 items-center justify-center md:h-28">
          <motion.div
            initial={false}
            animate={
              done
                ? { opacity: 1, y: 0, pointerEvents: "auto" }
                : { opacity: 0, y: 16, pointerEvents: "none" }
            }
            transition={{ duration: 0.7, ease: EASE }}
          >
            <HoneyCta href="/products" size="lg">
              {t.video.button}
            </HoneyCta>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
