"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  buildTimeContent,
  mergeProducts,
  mergeSlides,
  type SiteBundle,
} from "@/lib/content";
import { defaultMarketing } from "@/lib/marketing";
import { layoutStamp, mergeHomeSections } from "@/lib/home-model";
import { track } from "@/lib/track";

/**
 * Live content.
 *
 * The site is statically exported, so every page ships with the content that
 * was in the repo at build time — fast, SEO-friendly, and it works even if
 * nothing else does. On top of that, as soon as the page loads we ask the
 * website's own little content API whether the owner has published something
 * newer. If they have, the page swaps to it without a rebuild, so an edit made
 * in /admin is on the live site seconds later.
 *
 * If the API is missing or slow, nothing breaks: visitors simply see the
 * content that was baked in.
 */
const LiveContentContext = createContext<SiteBundle>(buildTimeContent);

export function useLiveContent(): SiteBundle {
  return useContext(LiveContentContext);
}

export function LiveContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteBundle>(buildTimeContent);

  // One anonymous page view per load.
  useEffect(() => {
    track("view");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);

    fetch("/api/content", { signal: controller.signal, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { content?: Partial<SiteBundle> | null } | null) => {
        if (!data?.content) return;

        // Everything the dashboard saves is a snapshot of the site as it was
        // that day, and it is only ever a partial one: it carries the fields
        // that existed when it was saved and nothing added since. Taking any
        // of it wholesale therefore deletes whatever came later.
        //
        // That is not hypothetical. The copy saved on 27 October lists all
        // seven products and gives none of them an `image`, a `weight`, a
        // `featured` flag or `flavours` — so the moment this API came back,
        // every product photo disappeared from the live site, the weights went
        // with them, "Our favourites" had nothing to show and the flavour tabs
        // emptied. The rule throughout is the same one `mergeProducts` was
        // written for: a field the saved copy actually states wins, including
        // `false`, because that is the owner's decision; a field it never
        // mentions falls back to what this build ships.
        const saved = data.content;
        const next: SiteBundle = {
          ...buildTimeContent,
          ...saved,
          products: saved.products
            ? mergeProducts(saved.products, buildTimeContent.products)
            : buildTimeContent.products,
          gallery: saved.gallery?.slides
            ? {
                slides: mergeSlides(
                  saved.gallery.slides,
                  buildTimeContent.gallery.slides
                ),
              }
            : buildTimeContent.gallery,
          site: { ...buildTimeContent.site, ...saved.site },
          // defaultMarketing() first so the result is always whole: both of
          // the others are optional and two partials do not make a Marketing.
          marketing: {
            ...defaultMarketing(),
            ...buildTimeContent.marketing,
            ...saved.marketing,
          },
        };
        // A saved layout is only applied to the design it was arranged
        // against. An older one described a site with a second video section
        // and sections still ticked "under construction", and merging kept
        // every one of them — the film played twice and finished sections wore
        // a building plate. A layout that is unstamped, or stamped for a
        // different design, is left alone and this build's own sections are
        // used. Rearranging anything in the dashboard stamps it afresh.
        const designStamp = layoutStamp(buildTimeContent.home.sections);
        if (data.content.home?.stamp === designStamp) {
          next.home = {
            ...next.home,
            sections: mergeHomeSections(
              data.content.home.sections,
              buildTimeContent.home.sections
            ),
          };
        } else {
          next.home = buildTimeContent.home;
        }
        setContent(next);
      })
      .catch(() => {
        /* no API, offline, or aborted — the baked-in content stays */
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <LiveContentContext.Provider value={content}>{children}</LiveContentContext.Provider>
  );
}

/**
 * A picture or film the owner may have replaced from the dashboard.
 * `fallback` is what the site ships with, so the page is always complete.
 */
export function useAsset(key: string, fallback: string): string {
  const { assets } = useLiveContent();
  const chosen = assets?.[key];
  return chosen && chosen.trim() !== "" ? chosen : fallback;
}
