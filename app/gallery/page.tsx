"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/components/i18n";
import { useLiveContent } from "@/components/live-content";

const DURATION = 5000;

export default function GalleryPage() {
  const { t } = useI18n();
  // The slideshow is owner-managed: order, pictures and phrases come from /admin.
  const SLIDES = useLiveContent().gallery.slides;
  const [rawIdx, setIdx] = useState(0);
  // Auto-advancing media has to be stoppable (WCAG 2.2.2), and a slideshow
  // you cannot hold still is one you cannot properly look at.
  const [paused, setPaused] = useState(false);
  // Which way the last move went, so the pictures drift with it.
  const [dir, setDir] = useState(1);
  const n = SLIDES.length;
  // The owner can publish a shorter slideshow while someone is looking at it.
  const idx = n > 0 ? rawIdx % n : 0;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const schedule = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (n < 2 || paused) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % n), DURATION);
  }, [n, paused]);

  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [schedule]);

  const next = useCallback(() => {
    if (n === 0) return;
    setDir(1);
    setIdx((i) => (i + 1) % n);
    schedule();
  }, [n, schedule]);
  const prev = useCallback(() => {
    if (n === 0) return;
    setDir(-1);
    setIdx((i) => (i - 1 + n) % n);
    schedule();
  }, [n, schedule]);
  const goTo = useCallback(
    (i: number) => {
      setDir(i >= idx ? 1 : -1);
      setIdx(i);
      schedule();
    },
    [schedule, idx]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -45) next();
    else if (dx > 45) prev();
    touchX.current = null;
  };

  return (
    <main
      className="relative h-[100svh] w-full overflow-hidden bg-background text-foreground"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* warm brand glow so the page reads as part of the site */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* The slideshow carries no visible heading, but the page still needs
          one for search engines and for anyone arriving by screen reader. */}
      <h1 className="sr-only">{t.nav.gallery}</h1>

      {SLIDES.map((slide, i) => {
        const active = i === idx;
        return (
          <motion.div
            key={slide.id}
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0, x: active ? 0 : dir * -28 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 flex flex-col items-center px-5 pb-16 pt-[5.75rem] md:px-16 md:pb-20 md:pt-[7rem]"
            style={{ zIndex: active ? 1 : 0 }}
          >
            {/* Phrase sits above the photo (on the dark ground) so it never covers the image */}
            {slide.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                className="mb-4 flex shrink-0 flex-col items-center gap-2.5"
              >
                <span className="text-center font-display text-2xl uppercase leading-tight tracking-[0.18em] text-accent sm:text-3xl md:text-4xl">
                  {slide.text}
                </span>
                <span aria-hidden className="h-px w-12 bg-accent/50" />
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: active && !paused ? 1.07 : 1,
                x: active && !paused ? (i % 2 ? -10 : 10) : 0,
              }}
              transition={{ duration: DURATION / 1000, ease: "linear" }}
              className="relative w-full max-w-4xl flex-1"
            >
              {slide.src.startsWith("data:") ? (
                // A picture added in the dashboard before it was uploaded —
                // next/image cannot take an inline image, a plain one can.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full rounded-2xl object-contain object-center"
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="rounded-2xl object-contain object-center"
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}


      {/* arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/70 text-foreground-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:left-4"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/70 text-foreground-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:right-4"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* The one action the site exists for — the sticky bar never shows
          here, because the slideshow does not scroll. */}
      <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2">
        <CallButton size="md" showNumber={false} />
      </div>

      {/* Hold the slideshow still. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? t.gallery.play : t.gallery.pause}
        className="absolute bottom-6 right-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface/70 text-foreground-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:right-6"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === idx ? "true" : undefined}
            className={`relative h-1.5 overflow-hidden rounded-full transition-all ${
              i === idx ? "w-8 bg-accent/25" : "w-1.5 bg-foreground-muted/50 hover:bg-accent/70"
            }`}
          >
            {/* how long this picture has left */}
            {i === idx && (
              <motion.span
                key={`${idx}-${paused}`}
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                initial={{ width: paused ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
