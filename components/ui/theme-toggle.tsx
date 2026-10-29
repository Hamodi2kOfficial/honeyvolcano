"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

import { useI18n } from "@/components/i18n";
import { useTheme } from "@/components/theme";
import { cn } from "@/lib/utils";

/** Light/dark switch. 44px target, and the icons cross-fade rather than pop. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.theme}
      aria-pressed={dark}
      className={cn(
        "relative inline-grid h-11 w-11 place-items-center rounded-full border border-border text-foreground-muted",
        "transition-colors hover:border-accent hover:text-accent",
        className
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inline-grid place-items-center"
        animate={{ opacity: dark ? 0 : 1, rotate: dark ? -70 : 0, scale: dark ? 0.6 : 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Sun className="h-[18px] w-[18px]" />
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inline-grid place-items-center"
        animate={{ opacity: dark ? 1 : 0, rotate: dark ? 0 : 70, scale: dark ? 1 : 0.6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Moon className="h-[18px] w-[18px]" />
      </motion.span>
    </button>
  );
}
