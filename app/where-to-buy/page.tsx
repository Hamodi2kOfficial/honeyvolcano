"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, MapPin, Navigation } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { CallButton } from "@/components/ui/call-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { useI18n } from "@/components/i18n";
import { stores, type Store } from "@/data/stores";
import { cn } from "@/lib/utils";

// Leaflet touches `window` as it loads, and this site is a static export —
// so the map is browser-only, with a reserved box so nothing shifts.
const StoreMap = dynamic(() => import("@/components/site/store-map").then((m) => m.StoreMap), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-[22px] border border-border bg-bg-soft md:h-[560px]" />
  ),
});

function StoreCard({
  store,
  onFocus,
}: {
  store: Store;
  onFocus: (id: string) => void;
}) {
  const { t } = useI18n();
  const canMap = store.lat != null && store.lng != null;

  return (
    <article className="flex h-full flex-col gap-3 rounded-[18px] border border-border bg-surface/50 p-5 transition-colors duration-300 hover:border-accent/45">
      <div>
        <h3 className="font-serif text-lg font-light leading-snug text-foreground">{store.name}</h3>
        <p className="mt-1.5 flex items-start gap-2 text-sm font-light leading-relaxed text-foreground-muted">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
          <span>
            {store.address}
            <br />
            {store.postcode} {store.town}
          </span>
        </p>
      </div>

      <p className="flex items-start gap-2 text-[13px] font-light leading-relaxed text-foreground-muted">
        <Clock aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
        {store.hours ? (
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {t.stores.hours}
            </span>
            {store.hours.map((h) => (
              <span key={h} className="block">
                {h}
              </span>
            ))}
          </span>
        ) : (
          <span className="italic">{t.stores.hoursUnknown}</span>
        )}
      </p>

      {canMap && (
        <button
          type="button"
          onClick={() => onFocus(store.id)}
          className="mt-auto inline-flex h-10 w-fit items-center gap-2 rounded-full border border-accent/40 px-4 text-[13px] text-accent transition-colors hover:border-accent hover:bg-accent/10"
        >
          <Navigation aria-hidden className="h-3.5 w-3.5" />
          {t.stores.flyTo}
        </button>
      )}
    </article>
  );
}

export default function WhereToBuyPage() {
  const { t } = useI18n();
  const [focus, setFocus] = React.useState<{ id: string; at: number } | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  const flyTo = React.useCallback((id: string) => {
    setFocus({ id, at: Date.now() });
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Shops in the capital area first, then the rest, each group alphabetical.
  const sorted = React.useMemo(
    () => [...stores].sort((a, b) => a.town.localeCompare(b.town) || a.name.localeCompare(b.name)),
    []
  );

  return (
    <main className="relative bg-background">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 pb-10 pt-[120px] md:px-8 md:pt-[150px]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <RevealWords
            as="h1"
            text={t.stores.title}
            className="font-serif text-[34px] font-light leading-tight text-foreground md:text-[46px]"
          />
          <p className="mt-4 text-[15px] font-light leading-relaxed text-foreground-muted">
            {t.stores.intro}
          </p>

          <div className="mt-7 flex flex-col items-center gap-4">
            <p className="rounded-full border border-accent/35 bg-accent/[0.07] px-5 py-2.5 text-[13px] font-medium text-accent">
              {t.stores.priceNote}
            </p>
            <p className="text-sm font-light text-foreground-muted">{t.stores.tasteNote}</p>
            <CallButton size="md" showCopy />
          </div>
        </Reveal>
      </section>

      {/* ---- The map ---- */}
      <section ref={mapRef} className="mx-auto max-w-6xl scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <StoreMap focus={focus} />
        </Reveal>
      </section>

      {/* ---- The list ---- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
            {t.stores.listHeading}
          </h2>
          <span className="text-sm font-light text-foreground-muted">
            {stores.length} {t.stores.count}
          </span>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {sorted.map((store) => (
            <RevealItem key={store.id} className="h-full">
              <StoreCard store={store} onFocus={flyTo} />
            </RevealItem>
          ))}
        </RevealGroup>

      </section>

      {/* ---- Become a stockist ---- */}
      <section className="pb-24">
        <Reveal className="mx-auto max-w-3xl px-5 md:px-8">
          <div
            className={cn(
              "rounded-[26px] border border-accent/35 bg-accent/[0.06] px-7 py-10 text-center md:px-12"
            )}
          >
            <h2 className="font-serif text-[26px] font-light leading-tight text-foreground md:text-[34px]">
              {t.stores.stockistHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] font-light leading-relaxed text-foreground-muted">
              {t.stores.stockistBody}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-full border border-accent/45 px-7 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
              >
                {t.stores.stockistContact}
              </Link>
              <CallButton size="md" showNumber={false} />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
