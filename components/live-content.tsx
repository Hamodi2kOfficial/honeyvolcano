"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { buildTimeContent, type SiteBundle } from "@/lib/content";
import { mergeHomeSections } from "@/lib/home-model";
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
        const next = { ...buildTimeContent, ...data.content };
        // The published layout was written before some of these sections
        // existed. Taking it wholesale would hide every section added since,
        // which is exactly what happened to the ones built in round two.
        if (data.content.home?.sections) {
          next.home = {
            ...next.home,
            sections: mergeHomeSections(
              data.content.home.sections,
              buildTimeContent.home.sections
            ),
          };
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
