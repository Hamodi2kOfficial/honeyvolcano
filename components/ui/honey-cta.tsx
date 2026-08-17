"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Signature call-to-action for Honey Volcano — a molten-gold pill with a
 * travelling light shimmer and a honey droplet that drips on a slow loop.
 * Deliberately not a plain "Buy now" button.
 */
export function HoneyCta({
  href,
  children,
  className,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-10 px-6 text-[13px]" : "h-12 px-9 text-[15px]";

  return (
    <Link href={href} className={cn("group relative inline-block", className)}>
      <span
        className={cn(
          "relative z-10 inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-[0.02em] text-[#1c1206]",
          "shadow-[0_12px_34px_-10px_rgba(212,175,55,0.6)] ring-1 ring-[#f0d38a]/40",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
          h
        )}
        style={{
          backgroundImage:
            "linear-gradient(135deg, #F3CE72 0%, #E5B869 42%, #C79A3B 100%)",
        }}
      >
        {/* travelling shimmer */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
            backgroundSize: "240% 100%",
            backgroundRepeat: "no-repeat",
          }}
          animate={{ backgroundPositionX: ["160%", "-60%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
        />
        <span className="relative">{children}</span>
      </span>

      {/* honey drip */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2"
        animate={{ y: [-2, 3, 24], scaleY: [0.5, 1, 0.35], opacity: [0, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2.6, ease: "easeIn" }}
      >
        <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
          <path
            d="M6 0c0 4.2-6 7-6 11a6 6 0 0 0 12 0c0-4-6-6.8-6-11z"
            fill="#E5B869"
          />
        </svg>
      </motion.span>
    </Link>
  );
}
