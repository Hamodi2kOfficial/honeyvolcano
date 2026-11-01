"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BeeIcon, FlowerIcon, HoneyJarIcon } from "@/components/ui/bee-icons";
import { DUR, EASE } from "@/lib/motion";

/**
 * The moment between one page and the next.
 *
 * Honey rises over the page, a bee crosses it, and it drains away — about
 * three quarters of a second, which is long enough to feel deliberate and
 * short enough that nobody waits for it. The curtain has a drip along its
 * top edge, drawn as a path rather than a picture so it stays crisp at any
 * width and costs nothing to load.
 *
 * It is pure decoration over a page that has already changed underneath, so
 * it is `aria-hidden` and takes no clicks. Anyone who has asked for reduced
 * motion gets no curtain at all — the new page is simply there.
 */

/** The wavy underside of a poured layer of honey. */
const DRIP =
  "M0,40 C60,10 120,70 180,40 C240,10 300,70 360,40 C420,10 480,70 540,40 C600,10 660,70 720,40 L720,120 L0,120 Z";

export function PageTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const [running, setRunning] = React.useState(false);

  // The first render is a page load, not a change between pages.
  const seen = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (seen.current === null) {
      seen.current = pathname;
      return;
    }
    if (seen.current === pathname || reduced) {
      seen.current = pathname;
      return;
    }
    seen.current = pathname;
    setRunning(true);
    const done = window.setTimeout(() => setRunning(false), 760);
    return () => window.clearTimeout(done);
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          key="hv-transition"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE } }}
        >
          {/* the honey itself, rising and then draining */}
          <motion.div
            className="absolute inset-0"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: DUR.base, ease: EASE }}
            style={{
              background:
                "linear-gradient(170deg, var(--accent-strong, #b8860b) 0%, var(--accent) 45%, var(--copper) 100%)",
            }}
          >
            {/* the drip along the leading edge */}
            <svg
              viewBox="0 0 720 120"
              preserveAspectRatio="none"
              className="absolute -top-[59px] left-0 h-[60px] w-full"
              style={{ color: "var(--accent-strong, #b8860b)" }}
            >
              <path d={DRIP} fill="currentColor" />
            </svg>

            {/* a bee crossing, and flowers rising to meet it */}
            <div className="absolute inset-0 grid place-items-center">
              <motion.span
                className="text-on-accent/90"
                initial={{ x: -140, opacity: 0, rotate: -8 }}
                animate={{ x: 140, opacity: 1, rotate: 8 }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
              >
                <BeeIcon className="h-16 w-16" strokeWidth={1.3} />
              </motion.span>
            </div>

            <div className="absolute inset-x-0 bottom-10 flex items-end justify-center gap-10 text-on-accent/55">
              {[FlowerIcon, HoneyJarIcon, FlowerIcon].map((Mark, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.4, ease: EASE }}
                >
                  <Mark className={i === 1 ? "h-11 w-11" : "h-9 w-9"} strokeWidth={1.4} />
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
