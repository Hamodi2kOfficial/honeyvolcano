import * as React from "react";

/**
 * Wraps a section, blurs its content out of legibility, and lays an
 * "UNDER CONSTRUCTION" plate over it — for sections whose copy the client
 * wants to reveal step by step. The children still render (blurred), so
 * layout/height is preserved.
 */
export function UnderConstruction({
  children,
  label = "Under Construction",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none select-none blur-[13px] saturate-[0.8] [filter:blur(13px)]"
        style={{ opacity: 0.5 }}
      >
        {children}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-[#0b0a08]/55 backdrop-blur-[3px]">
        {/* caution stripes */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0 16px, transparent 16px 32px)",
          }}
        />
        <div className="relative flex flex-col items-center gap-4 px-6 text-center">
          <svg viewBox="0 0 24 26" width="30" height="32" aria-hidden className="text-accent">
            <path
              d="M12 1l9.5 5.5v13L12 25l-9.5-5.5v-13z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              opacity="0.6"
            />
            <path
              d="M12 8v6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="18" r="1.1" fill="currentColor" />
          </svg>
          <p className="font-display text-sm uppercase tracking-[0.45em] text-accent md:text-base">
            {label}
          </p>
          <span className="h-px w-14 bg-accent/40" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
