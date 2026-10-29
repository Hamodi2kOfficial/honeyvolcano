"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";
import { StickyCall } from "@/components/site/sticky-call";

/**
 * The furniture every public page shares: navigation, footer, and the call
 * button that follows you down a phone screen.
 *
 * Keeping it here rather than inside each page means the header is a sibling
 * of <main>, not a child of it — which is what the landmark roles expect, and
 * what lets a screen reader skip the menu to reach the content.
 *
 * The owner's dashboard is a different application wearing the same brand, so
 * it gets none of this.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <SiteFooter />
      <StickyCall />
    </>
  );
}
