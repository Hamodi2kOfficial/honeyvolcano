import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * `next/link`, with prefetching off.
 *
 * The App Router prefetches each link's RSC payload, but a static export
 * writes those payloads to paths the client does not ask for — it requests
 * `/products/__next.products.__PAGE__.txt` while the export emits
 * `/products/__next.products/__PAGE__.txt`. Every prefetch therefore 404s on
 * the deployed site: harmless, because navigation falls back to a normal page
 * load, but it fills the console with errors and spends a request on every
 * hover.
 *
 * This site is eight small pages of static HTML, so prefetching buys very
 * little. Turning it off removes the 404s entirely. (The Next docs list
 * "Prefetching with next/link" as supported for static export only under
 * Pages Router, not App Router.)
 *
 * Pass `prefetch` explicitly to override on a particular link.
 */
export function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
