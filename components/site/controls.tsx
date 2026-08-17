"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { useI18n, LANGS, type Lang } from "@/components/i18n";
import { cn } from "@/lib/utils";

/** Small inline SVG flags — render consistently on every OS (unlike emoji flags). */
function Flag({ code, className }: { code: Lang; className?: string }) {
  const cls = cn("block h-4 w-[22px] shrink-0 rounded-[3px] ring-1 ring-white/15", className);
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
  const { lang, setLang } = useI18n();
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
        aria-label="Select language"
        className="flex items-center gap-2 rounded-full border border-accent/25 bg-white/[0.03] px-3 py-1.5 text-sm text-white/85 transition-colors hover:border-accent/50 hover:text-white"
      >
        <Flag code={cur.code} />
        <span className="font-medium tracking-wide">{cur.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-accent/20 bg-[#0e0c0a]/95 p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
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
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                )}
              >
                <Flag code={l.code} />
                <span>{l.name}</span>
                <span className="ml-auto text-[11px] tracking-wide text-white/35">
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
