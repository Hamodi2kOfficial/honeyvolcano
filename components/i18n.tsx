"use client";

import * as React from "react";

import { useLiveContent } from "@/components/live-content";
import { applyCopyOverrides } from "@/lib/site-copy";
import en, { type Dict } from "@/lib/locales/en";
import lt from "@/lib/locales/lt";
import is from "@/lib/locales/is";
import es from "@/lib/locales/es";
import ru from "@/lib/locales/ru";
import pl from "@/lib/locales/pl";

/**
 * Six languages, one dictionary shape.
 *
 * The site is a static export with no locale routing, so the language is a
 * client choice kept in localStorage. English is the source dictionary (see
 * lib/locales/en.ts); Spanish and Russian are temporary translations awaiting
 * a native reader.
 */
export type Lang = "en" | "lt" | "is" | "es" | "ru" | "pl";
export type { Dict };

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "lt", label: "LT", name: "Lietuvių" },
  { code: "is", label: "IS", name: "Íslenska" },
  { code: "es", label: "ES", name: "Español" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "pl", label: "PL", name: "Polski" },
];

const DICTS: Record<Lang, Dict> = { en, lt, is, es, ru, pl };

/**
 * The wording this site ships with, before any dashboard edit — what the
 * editor shows as the starting point and restores with "original".
 */
export function originalText(lang: Lang, path: string): string {
  const [group, field] = path.split(".");
  const dict = DICTS[lang] as unknown as Record<string, Record<string, string>>;
  return dict?.[group]?.[field] ?? "";
}

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const Ctx = React.createContext<I18nContext | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    // Read the saved language after mount (client-only) so SSR and the first
    // client render both start from "en" — avoids a hydration mismatch.
    const saved = window.localStorage.getItem("medaus-lang") as Lang | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("medaus-lang", l);
  }, []);

  // Anything the owner rewrote in the dashboard wins over the shipped
  // translation — for that language only, so the other five stay intact.
  const copy = useLiveContent().copy;
  const value = React.useMemo<I18nContext>(
    () => ({ lang, setLang, t: applyCopyOverrides(DICTS[lang], copy?.[lang]) }),
    [lang, setLang, copy]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
