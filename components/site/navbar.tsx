"use client";

import * as React from "react";
import { Link } from "@/components/ui/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { CallButton } from "@/components/ui/call-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VolcanoMark } from "@/components/ui/volcano-mark";
import { LanguageSwitcher } from "@/components/site/controls";
import { useI18n } from "@/components/i18n";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Item = { href: string; key: keyof ReturnType<typeof useI18n>["t"]["nav"] };

/** Everything in the menu, in order. "best" has no page yet (see below). */
const ITEMS: Item[] = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/where-to-buy", key: "stores" },
  { href: "/about", key: "about" },
  { href: "__soon", key: "best" },
  { href: "/contact", key: "contact" },
  { href: "/gallery", key: "gallery" },
];

function useActive() {
  const pathname = usePathname();
  return React.useCallback(
    (href: string) => {
      if (href === "__soon") return false;
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );
}

/**
 * "What's best for me?" — visible, elegant, and honestly not a link yet.
 *
 * It is a disabled button rather than a dead anchor, so a keyboard or screen
 * reader is told it does nothing instead of being walked into a 404. The
 * tooltip shows on hover and on focus.
 */
function SoonItem({ label, soon }: { label: string; soon: string }) {
  return (
    <span className="group relative">
      <button
        type="button"
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
        className="inline-flex h-10 cursor-default items-center rounded-full px-4 text-[13px] text-foreground-muted/70 transition-colors hover:text-foreground-muted"
      >
        {label}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent opacity-0 shadow-[var(--shadow-soft)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {soon}
      </span>
    </span>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const isActive = useActive();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer when the page changes. Adjusting state during the render
  // that noticed the change is React's own recipe for this — an effect here
  // would render the drawer once more over the new page before closing it.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Lock the page behind the drawer while it is open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={reduced ? false : { y: -22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="relative mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-3 px-4 md:px-7">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-accent transition-opacity hover:opacity-80"
          aria-label="Honey Volcano — home"
        >
          <VolcanoMark className="h-7 w-7" />
          <span className="hidden font-display text-[15px] leading-none tracking-[0.26em] sm:block">
            HONEY&nbsp;VOLCANO
          </span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t.nav.menu}>
          {ITEMS.map((item) =>
            item.href === "__soon" ? (
              <SoonItem key="soon" label={t.nav.best} soon={t.nav.bestSoon} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center rounded-full px-4 text-[13px] transition-colors",
                  isActive(item.href)
                    ? "text-accent"
                    : "text-foreground-muted hover:text-foreground"
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full border border-accent/35 bg-accent/10"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {t.nav[item.key]}
              </Link>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <CallButton size="sm" showNumber={false} className="hidden sm:inline-flex" />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="hv-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="inline-grid h-11 w-11 place-items-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Glass base — gains weight once the page has scrolled under it */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 border-b backdrop-blur-md transition-all duration-500",
          scrolled || open
            ? "border-border bg-background/85"
            : "border-transparent bg-background/40"
        )}
      />

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="hv-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[68px] z-40 overflow-y-auto bg-background/97 backdrop-blur-xl xl:hidden"
          >
            <motion.nav
              aria-label={t.nav.menu}
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
              className="mx-auto flex max-w-md flex-col gap-1.5 px-5 pb-32 pt-6"
            >
              {ITEMS.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 14 },
                    shown: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {item.href === "__soon" ? (
                    <span className="flex items-center justify-between rounded-2xl border border-border/60 px-5 py-4 text-[17px] text-foreground-muted/70">
                      {t.nav.best}
                      <span className="text-[10px] uppercase tracking-[0.25em] text-accent">
                        {t.nav.bestSoon}
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-5 py-4 text-[17px] transition-colors",
                        isActive(item.href)
                          ? "border-accent/45 bg-accent/10 text-accent"
                          : "border-border/60 text-foreground hover:border-accent/40 hover:bg-accent/5"
                      )}
                    >
                      {t.nav[item.key]}
                      {isActive(item.href) && (
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: reduced ? 0 : 14 },
                  shown: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-4 flex flex-col items-stretch gap-4"
              >
                <CallButton size="lg" className="[&>a]:w-full" />
                <div className="sm:hidden">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
