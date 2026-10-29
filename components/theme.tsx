"use client";

import * as React from "react";

/**
 * Light/dark mode without a dependency.
 *
 * The site is a static export, so there is no server to read a cookie: the
 * choice lives in localStorage and is applied by `themeScript` below, which
 * runs before the first paint so the page never flashes the wrong colours.
 * With nothing stored we follow the visitor's system preference and keep
 * following it until they pick a side themselves.
 *
 * The `<html>` class is the single source of truth, read through
 * useSyncExternalStore — so React never has to mirror it in state, and the
 * toggle in the navigation bar always agrees with what is on screen.
 */
export type Theme = "light" | "dark";

const STORAGE_KEY = "hv-theme";
const EVENT = "hv-themechange";

/** Runs in <head>, before anything is painted. Kept tiny and dependency-free. */
export const themeScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){document.documentElement.classList.add("dark");}})();`;

function apply(theme: Theme) {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme;
  window.dispatchEvent(new Event(EVENT));
}

function stored(): Theme | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Subscribes to our own changes and, until a choice is made, to the system's. */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    if (stored()) return; // the visitor has decided; stop following
    apply(mq.matches ? "dark" : "light");
  };
  window.addEventListener(EVENT, onChange);
  mq.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(EVENT, onChange);
    mq.removeEventListener("change", onSystem);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** Prerendered HTML carries no class; the inline script sets it before paint. */
const getServerSnapshot = (): Theme => "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void } {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = React.useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the choice just won't be remembered */
    }
    apply(next);
  }, []);

  return React.useMemo(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme]
  );
}
