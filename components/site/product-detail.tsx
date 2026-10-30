"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { X } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { useI18n } from "@/components/i18n";
import { formatPrice, type Product } from "@/lib/content";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The opened product: the card itself grows into it.
 *
 * The picture, the frame and the name carry the same `layoutId` as the card
 * behind, so opening is one continuous movement rather than a card fading out
 * and a panel fading in. Closing runs the same movement backwards.
 *
 * It closes four ways, because people reach for different ones: the X, the
 * backdrop, Escape, and a downward swipe. Focus is trapped while it is open
 * and handed back to the card that opened it.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProductDetail({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const reduced = useReducedMotion() ?? false;
  const panel = React.useRef<HTMLDivElement>(null);
  const [flavour, setFlavour] = React.useState(0);

  const flavours = product.flavours ?? [];
  const shown = flavours[flavour];
  const image = shown?.image ?? product.image;
  const weight = shown?.weight ?? product.weight;
  const description = t.productDesc[product.id as keyof typeof t.productDesc];

  // Escape to close, Tab kept inside, and the page behind held still.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
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

    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  // Land on the close button, so the first Tab moves into the panel.
  React.useEffect(() => {
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 650) onClose();
  };

  const titleId = `hv-detail-${product.id}`;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Backdrop — clicking anywhere off the panel closes it. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: DUR.quick, ease: EASE }}
        onClick={onClose}
        aria-hidden
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        layoutId={reduced ? undefined : `hv-card-${product.id}`}
        initial={reduced ? { opacity: 0 } : undefined}
        animate={reduced ? { opacity: 1 } : undefined}
        exit={reduced ? { opacity: 0 } : undefined}
        drag={reduced ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        dragDirectionLock
        onDragEnd={onDragEnd}
        transition={{ duration: DUR.base, ease: EASE }}
        className="relative z-10 flex max-h-[92svh] w-full max-w-sm flex-col overflow-hidden rounded-t-[26px] border border-accent/30 bg-surface shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] sm:max-w-md sm:rounded-[26px]"
      >
        {/* the grab handle, and a target for the swipe on a phone */}
        <span
          aria-hidden
          className="absolute left-1/2 top-2.5 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground-muted/35 sm:hidden"
        />

        <button
          type="button"
          data-close
          onClick={onClose}
          aria-label={t.products.close}
          className="absolute right-3 top-3 z-20 inline-grid h-10 w-10 place-items-center rounded-full border border-border bg-background/80 text-foreground-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
        >
          <X aria-hidden className="h-4.5 w-4.5" />
        </button>

        <motion.div
          layoutId={reduced ? undefined : `hv-image-${product.id}`}
          // the card's own 4:5, but never so tall that the price and the call
          // fall off the bottom of the screen
          className="relative aspect-[4/5] max-h-[min(46svh,440px)] w-full shrink-0 overflow-hidden bg-bg-soft"
        >
          {image && (
            <Image
              key={image}
              src={image}
              alt={shown ? shown.name : product.name}
              fill
              sizes="(max-width: 639px) 100vw, 440px"
              className="object-cover"
            />
          )}
          {weight && (
            <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
              {weight}
            </span>
          )}
        </motion.div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <motion.h2
              id={titleId}
              layoutId={reduced ? undefined : `hv-name-${product.id}`}
              className="font-serif text-2xl font-light leading-snug text-foreground"
            >
              {shown ? shown.name : product.name}
            </motion.h2>
            <span className="mt-1.5 shrink-0 whitespace-nowrap font-display text-sm tracking-wide text-accent">
              {product.tba ? t.products.tba : formatPrice(product)}
            </span>
          </div>

          {description && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: DUR.quick, ease: EASE }}
              className="text-[15px] font-light leading-relaxed text-foreground-muted"
            >
              {description}
            </motion.p>
          )}

          {flavours.length > 0 && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: DUR.quick, ease: EASE }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                {t.products.flavours}
              </p>
              <div
                role="tablist"
                aria-label={t.products.flavours}
                className="mt-2.5 flex flex-wrap gap-1.5"
              >
                {flavours.map((f, i) => (
                  <button
                    key={f.id}
                    role="tab"
                    type="button"
                    aria-selected={i === flavour}
                    onClick={() => setFlavour(i)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-[11px] leading-tight transition-colors",
                      i === flavour
                        ? "border-accent/60 bg-accent/12 text-accent"
                        : "border-border text-foreground-muted hover:border-accent/40 hover:text-foreground"
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: DUR.quick, ease: EASE }}
            className="mt-auto pt-1"
          >
            <CallButton size="md" className="[&>a]:w-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
