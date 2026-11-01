"use client";

import * as React from "react";

/**
 * Re-mounts on every route change (unlike layout.tsx). A dark curtain lifts to
 * reveal each page while the content eases in — a smooth transition between
 * Home, the Gallery and the order page.
 *
 * The motion is pure CSS (see globals.css: hv-page-in / hv-curtain) so it always
 * runs to completion and can never stick — unlike a JS/rAF animation, which
 * pauses if the tab is briefly backgrounded mid-navigation. Opacity-only, so the
 * wrapper never becomes a containing block for the fixed navbar.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hv-page-in">{children}</div>

      <div
        aria-hidden
        className="hv-curtain pointer-events-none fixed inset-0 z-[100]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, #0e0a06 0%, #0b0805 60%, #060403 100%)",
        }}
      />
    </>
  );
}
