"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { useI18n, LANGS, type Lang } from "@/components/i18n";
import { cn } from "@/lib/utils";

/** Small inline SVG flags — render consistently on every OS (unlike emoji flags). */
function Flag({ code, className }: { code: Lang; className?: string }) {
  const cls = cn("block h-4 w-[22px] shrink-0 rounded-[3px] ring-1 ring-border-strong", className);
  switch (code) {
    case "lt":
      return (
        <svg viewBox="0 0 6 4" className={cls} aria-hidden>
          <rect width="6" height="4" fill="#006A44" />
          <rect width="6" height="1.34" fill="#FDB913" />
          <rect y="2.66" width="6" height="1.34" fill="#C1272D" />
        </svg>
      );
    case "es":
      return (
        <svg viewBox="0 0 6 4" className={cls} aria-hidden>
          <rect width="6" height="4" fill="#AA151B" />
          <rect y="1" width="6" height="2" fill="#F1BF00" />
        </svg>
      );
    case "ru":
      return (
        <svg viewBox="0 0 6 4" className={cls} aria-hidden>
          <rect width="6" height="4" fill="#fff" />
          <rect y="1.34" width="6" height="1.33" fill="#0039A6" />
          <rect y="2.67" width="6" height="1.33" fill="#D52B1E" />
        </svg>
      );
    case "pl":
      return (
        <svg viewBox="0 0 6 4" className={cls} aria-hidden>
          <rect width="6" height="4" fill="#fff" />
          <rect y="2" width="6" height="2" fill="#DC143C" />
        </svg>
      );
    case "is":
      return (
        <svg viewBox="0 0 25 18" className={cls} aria-hidden>
          <rect width="25" height="18" fill="#02529C" />
          <rect x="7" width="4" height="18" fill="#fff" />
          <rect y="7" width="25" height="4" fill="#fff" />
          <rect x="8" width="2" height="18" fill="#DC1E35" />
          <rect y="8" width="25" height="2" fill="#DC1E35" />
        </svg>
      );
    case "en":
    default:
      return (
        <svg viewBox="0 0 60 40" className={cls} aria-hidden>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
          <rect x="25" width="10" height="40" fill="#fff" />
          <rect y="15" width="60" height="10" fill="#fff" />
          <rect x="27" width="6" height="40" fill="#C8102E" />
          <rect y="17" width="60" height="6" fill="#C8102E" />
        </svg>
      );
  }
}

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const cur = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-lang-picker
        aria-label={`${cur.label} — ${t.nav.chooseLanguage}`}
        className="flex h-11 items-center gap-2 rounded-full border border-border px-3.5 text-sm text-foreground-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Flag code={cur.code} />
        <span className="font-medium tracking-wide">{cur.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 max-h-[min(60svh,320px)] w-48 overflow-y-auto rounded-xl border border-border bg-surface/97 p-1 shadow-[var(--shadow-soft)] backdrop-blur-md"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  l.code === lang
                    ? "bg-accent/15 text-accent"
                    : "text-foreground-muted hover:bg-accent/5 hover:text-foreground"
                )}
              >
                <Flag code={l.code} />
                <span>{l.name}</span>
                <span className="ml-auto text-[13px] tracking-wide text-foreground-muted/60">
                  {l.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The six languages, all on screen at once.
 *
 * The dropdown above is right for the header, where it has the whole page to
 * fall into. In the phone menu it was wrong: the trigger sat 704px down a
 * 839px screen, so the list opened at 756px and ran to 1022px — 183px of it
 * below the bottom of the window, with Íslenska, Español, Русский and Polski
 * nowhere to be seen. That is the languages "not appearing" on a phone.
 *
 * A grid has nothing to position and nothing to clip. It goes at the top of
 * the menu, so every language is there the moment the menu is, and choosing
 * one leaves the menu open — the links behind it re-label themselves, which
 * is the plainest confirmation that it worked.
 */
export function LanguageChoices() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="listbox"
      aria-label={t.nav.language}
      className="grid grid-cols-3 gap-1.5"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          role="option"
          aria-selected={l.code === lang}
          onClick={() => setLang(l.code)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-[15px] transition-colors",
            l.code === lang
              ? "border-accent/50 bg-accent/12 text-accent"
              : "border-border/60 text-foreground-muted hover:border-accent/40 hover:text-foreground"
          )}
        >
          <Flag code={l.code} />
          <span className="truncate">{l.name}</span>
        </button>
      ))}
    </div>
  );
}
