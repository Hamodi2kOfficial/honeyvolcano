"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // `lerp` rather than `duration`: duration re-runs a fixed-length ease on
    // every wheel tick, which stutters when ticks arrive faster than the ease
    // finishes. A lerp just chases the target each frame, so a long scroll
    // and a nudge both feel like one continuous movement.
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      touchMultiplier: 1.5,
      syncTouch: true,
      // A trackpad's own inertia plus ours reads as sludge; this keeps the
      // momentum phase from being smoothed a second time.
      syncTouchLerp: 0.1,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
