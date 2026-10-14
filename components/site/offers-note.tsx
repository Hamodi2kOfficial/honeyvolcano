"use client";

import { Tag } from "lucide-react";

import { useLiveContent } from "@/components/live-content";
import { liveOffers } from "@/lib/marketing";
import { track } from "@/lib/track";

/**
 * Current offers, shown with the catalogue. There is no checkout yet, so a
 * code is something the customer mentions when they call or order — which is
 * exactly how the business works today.
 */
export function OffersNote() {
  const offers = liveOffers(useLiveContent().marketing?.offers);
  if (offers.length === 0) return null;

  return (
    <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/[0.06] p-4"
        >
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-accent">−{offer.percent}%</span>{" "}
              {offer.description}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(offer.code).catch(() => {});
                track("offer");
              }}
              title="Copy the code"
              className="mt-1.5 rounded-md border border-dashed border-accent/50 px-2.5 py-1 font-mono text-xs tracking-[0.12em] text-accent transition-colors hover:bg-accent/10"
            >
              {offer.code}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
