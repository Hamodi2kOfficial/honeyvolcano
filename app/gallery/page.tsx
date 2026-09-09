/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Tile =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "overlay"; src: string; alt: string; text: string }
  | { kind: "text"; text: string };

const TILES: Tile[] = [
  { kind: "photo", src: "/gallery/1.png", alt: "Honey Volcano" },
  { kind: "photo", src: "/gallery/2.png", alt: "Honey Volcano" },
  { kind: "photo", src: "/gallery/snack1.jpg", alt: "Honey delicacy" },
  { kind: "overlay", src: "/gallery/honeycomb-macro.png", alt: "Honeycomb", text: "Let happiness erupt" },
  { kind: "photo", src: "/gallery/3faces.png", alt: "Let happiness erupt" },
  { kind: "photo", src: "/gallery/3.png", alt: "Honey Volcano" },
  { kind: "text", text: "Natural & Real" },
  { kind: "photo", src: "/gallery/snack2.jpg", alt: "Honey delicacy" },
  { kind: "overlay", src: "/gallery/lupine-jar.png", alt: "Honey in the mountains", text: "Let energy erupt" },
  { kind: "photo", src: "/gallery/4.png", alt: "Honey Volcano" },
  { kind: "photo", src: "/gallery/snack3.jpg", alt: "Honey delicacy" },
];

export default function GalleryPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll one screen every 5s, looping. Pauses while the viewer is
  // actively scrolling, then resumes after a short idle.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let userActive = false;
    let idle: ReturnType<typeof setTimeout>;
    const markActive = () => {
      userActive = true;
      clearTimeout(idle);
      idle = setTimeout(() => (userActive = false), 6000);
    };
    for (const ev of ["wheel", "touchmove", "pointerdown", "keydown"] as const) {
      el.addEventListener(ev, markActive, { passive: true });
    }

    const tick = setInterval(() => {
      if (userActive) return;
      const step = el.clientHeight * 0.85;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      el.scrollTo({ top: atBottom ? 0 : el.scrollTop + step, behavior: "smooth" });
    }, 5000);

    return () => {
      clearInterval(tick);
      clearTimeout(idle);
      for (const ev of ["wheel", "touchmove", "pointerdown", "keydown"] as const) {
        el.removeEventListener(ev, markActive);
      }
    };
  }, []);

  return (
    <main className="dark relative h-[100svh] bg-[#0b0805] text-white">
      {/* back home */}
      <Link
        href="/"
        aria-label="Back to home"
        className="fixed left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div
        ref={scrollerRef}
        data-lenis-prevent
        className="h-full overflow-y-auto overscroll-contain"
      >
        <div className="columns-1 gap-4 p-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {TILES.map((tile, i) => {
            if (tile.kind === "text") {
              return (
                <div
                  key={i}
                  className="flex aspect-[4/3] break-inside-avoid items-center justify-center rounded-2xl ring-1 ring-accent/20"
                  style={{ background: "linear-gradient(150deg,#1a120a,#0b0805)" }}
                >
                  <span className="px-6 text-center font-serif text-3xl font-light italic text-accent md:text-4xl">
                    {tile.text}
                  </span>
                </div>
              );
            }
            return (
              <div key={i} className="relative break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-white/10">
                <img src={tile.src} alt={tile.alt} loading="lazy" className="w-full" />
                {tile.kind === "overlay" && (
                  <div className="absolute inset-0 grid place-items-center bg-black/35">
                    <span className="px-4 text-center font-display text-2xl uppercase leading-tight tracking-[0.18em] text-white md:text-3xl">
                      {tile.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
