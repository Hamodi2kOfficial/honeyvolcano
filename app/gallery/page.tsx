"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { EASE } from "@/lib/motion";

type Slide = { src: string; alt: string; text?: string };

const SLIDES: Slide[] = [
  { src: "/gallery/g-mountain.jpg", alt: "Honey Volcano jar in a lupine mountain meadow", text: "Let energy erupt" },
  { src: "/gallery/1.jpg", alt: "Honey Volcano" },
  { src: "/gallery/g-comb.jpg", alt: "Golden honeycomb dripping raw honey", text: "Let happiness erupt" },
  { src: "/gallery/2.jpg", alt: "Honey Volcano" },
  { src: "/gallery/g-pour.jpg", alt: "Raw honey drizzling into a jar" },
  { src: "/gallery/g-spread.jpg", alt: "Honey jar with honeycomb and wildflowers", text: "Natural & Real" },
  { src: "/gallery/3.jpg", alt: "Honey Volcano" },
  { src: "/gallery/g-beekeeper.jpg", alt: "Beekeeper holding a honeycomb frame at golden hour" },
  { src: "/gallery/snack1s.jpg", alt: "Honey delicacy" },
  { src: "/gallery/4.jpg", alt: "Honey Volcano" },
];

const DURATION = 5000;

export default function GalleryPage() {
  const [idx, setIdx] = useState(0);
  const n = SLIDES.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const schedule = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIdx((i) => (i + 1) % n), DURATION);
  }, [n]);

  useEffect(() => {
    schedule();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [schedule]);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % n);
    schedule();
  }, [n, schedule]);
  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + n) % n);
    schedule();
  }, [n, schedule]);
  const goTo = useCallback(
    (i: number) => {
      setIdx(i);
      schedule();
    },
    [schedule]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
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
      className="dark relative h-[100svh] w-full overflow-hidden bg-[#0b0805] text-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((slide, i) => {
        const active = i === idx;
        return (
          <motion.div
            key={slide.src}
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center p-5 pt-16 pb-20 md:p-14"
            style={{ zIndex: active ? 1 : 0 }}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: active ? 1.04 : 1 }}
              transition={{ duration: 7, ease: "linear" }}
              className="relative h-full w-full max-w-4xl"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="rounded-2xl object-contain"
              />
              {slide.text && (
                <div className="absolute inset-0 grid place-items-center px-6">
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                    className="text-center font-display text-3xl uppercase leading-tight tracking-[0.16em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] sm:text-5xl md:text-6xl"
                  >
                    {slide.text}
                  </motion.span>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* back home */}
      <Link
        href="/"
        aria-label="Back to home"
        className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {/* arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent md:left-4 md:h-11 md:w-11"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent md:right-4 md:h-11 md:w-11"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </main>
  );
}
