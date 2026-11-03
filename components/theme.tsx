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

/**
 * Keeps the page readable when its animations cannot run.
 *
 * Every scroll reveal is server-rendered at `opacity: 0`, waiting for motion
 * to bring it in — 65 elements on the home page alone. If that never happens
 * the visitor reads a blank page: no heading, no navigation, and no Call to
 * taste, which is the only thing the site is for.
 *
 * Three ways it can never happen, and all three are covered here.
 *
 * A single error proves nothing — the page throws a benign hydration warning
 * on every load, and treating that as death switched every animation off for
 * everyone. An error only counts if the page has still not come alive a
 * moment later.
 *
 * A browser with no `IntersectionObserver` is the worst of them, and not in
 * the way you would expect: motion does not degrade, it throws, React's
 * hydration dies with it, and React strips `<html>` of its classes on the
 * way down — so a flag set there would be wiped by the very failure it is
 * for. Hence a stub observer that reports everything as already in view, and
 * a `<style>` element rather than a class.
 *
 * ES5 and dependency-free on purpose: it has to run on the browsers that are
 * the problem. On a healthy one it defines nothing, the timer finds the page
 * already alive, and none of it has any effect.
 */
export const failsafeScript = `(function(){try{if(!("IntersectionObserver" in window)){window.IntersectionObserver=function(cb){this.observe=function(el){try{cb([{target:el,isIntersecting:true,intersectionRatio:1,time:0,boundingClientRect:el.getBoundingClientRect(),intersectionRect:el.getBoundingClientRect(),rootBounds:null}],this);}catch(e){}};this.unobserve=function(){};this.disconnect=function(){};this.takeRecords=function(){return[];};this.root=null;this.rootMargin="0px";this.thresholds=[0];};}var shown=false;var reveal=function(){if(shown)return;shown=true;var st=document.createElement("style");st.id="hv-failsafe";st.appendChild(document.createTextNode('[style*="opacity:0"],[style*="opacity: 0"],[style*="clip-path"]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}'));(document.head||document.documentElement).appendChild(st);};window.addEventListener("error",function(){setTimeout(function(){if(!document.documentElement.getAttribute("data-hv-ready")){reveal();}},1500);});setTimeout(function(){if(!document.documentElement.getAttribute("data-hv-ready")){reveal();}},4000);}catch(_){try{var f=document.createElement("style");f.appendChild(document.createTextNode('[style*="opacity:0"]{opacity:1!important;transform:none!important}'));(document.head||document.documentElement).appendChild(f);}catch(__){}}})();`;

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
  React.useEffect(() => {
    // React owns `className` on <html>, and the prerendered value has no
    // theme in it — the static export cannot know one. So when React
    // hydrates it writes its own className back and the class the pre-paint
    // script set is wiped: choose dark, reload, and you are in light again.
    // `suppressHydrationWarning` silences the complaint but does not stop the
    // patch. Re-assert the choice here, in the same commit React hydrated in,
    // so there is nothing to see.
    const want: Theme =
      stored() ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (getSnapshot() !== want) apply(want);

    // And mark the document as live, so anything that clicks — a test, or a
    // very fast visitor — can tell "painted" from "listening".
    document.documentElement.dataset.hvReady = "1";
  }, []);

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
