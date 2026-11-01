"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A panel that comes up in the middle of the screen with the page blurred
 * behind it.
 *
 * Adapted from a 21st.dev blurred-background modal onto this site's motion
 * tokens. It closes on Escape, on the backdrop, and on its own button; while
 * it is open the page cannot scroll behind it and the Tab key stays inside.
 *
 * The content is rendered only while open, so nothing of it is readable to a
 * screen reader — or findable by Tab — when it is shut.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * False while the page is being rendered on the server and during hydration,
 * true from the next render on.
 *
 * The portal has to wait for that. Rendering it on hydration asks React to
 * match it against server HTML that was never produced, which throws a
 * hydration error — and a hydration error takes the whole page down with it,
 * so none of the buttons on the page work at all. `useSyncExternalStore`
 * gives the same answer as the server until hydration is finished, without
 * setting state inside an effect to do it.
 */
const subscribeToNothing = () => () => {};
function useHydrated() {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

export function OverlayDialog({
  open,
  onClose,
  label,
  closeLabel,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  /** Names the dialog for assistive tech. */
  label: string;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  const panel = React.useRef<HTMLDivElement>(null);
  const restoreTo = React.useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion() ?? false;
  const hydrated = useHydrated();

  React.useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Hold the page still, and keep its width so nothing jumps sideways when
    // the scrollbar goes.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 40);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.quick, ease: EASE }}
            className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-md"
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: DUR.base, ease: EASE }}
            className={cn(
              "relative z-10 w-full max-w-lg overflow-hidden rounded-[26px] border border-accent/30",
              "bg-surface p-7 text-center shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] sm:p-9",
              className
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-3 top-3 inline-grid h-10 w-10 place-items-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
