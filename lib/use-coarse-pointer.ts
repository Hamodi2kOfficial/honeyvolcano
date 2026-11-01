"use client";

import * as React from "react";

/**
 * Is the visitor scrolling with a finger?
 *
 * Not a width check. A phone's problem is not that its screen is small but
 * that its scrolling is already smooth and already off the main thread — the
 * compositor does it. Anything we drive per frame against that scroll is
 * competing with the one thing that was working, and on a phone there is far
 * less CPU to lose that fight with.
 *
 * `useSyncExternalStore` rather than an effect: the server snapshot is a
 * mouse, which is what the first client render uses too, so there is no
 * hydration mismatch — and React swaps it on the same pass rather than after
 * a second paint.
 */
const QUERY = "(pointer: coarse)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useCoarsePointer() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
