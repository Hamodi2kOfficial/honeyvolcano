/**
 * Anonymous counting: how many people saw a page, how often the taste button
 * was pressed. No cookies, no identifiers, nothing stored in the browser — so
 * the site stays cookie-banner free. Failures are ignored on purpose: counting
 * must never get in the way of a visitor.
 */
export function track(event: "view" | "taste" | "enquiry" | "offer", path?: string) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      event,
      path: path ?? window.location.pathname,
    });
    const url = "/api/track";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* counting is never worth an error */
  }
}
