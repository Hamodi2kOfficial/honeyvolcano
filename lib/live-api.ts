/**
 * Talks to the site's own content API (netlify/functions).
 *
 * Every call is written so the dashboard still works when the API is not
 * there at all — on a local dev server, or before the owner has switched live
 * publishing on in Netlify. In that case the dashboard runs in browser-only
 * mode and says so.
 */
import type { SiteBundle } from "@/lib/content";
import type { Img } from "@/lib/home-model";

export type ApiStatus =
  /** The API answered and publishing is ready to use. */
  | { kind: "live" }
  /** The API answered but no password is configured in Netlify yet. */
  | { kind: "unconfigured" }
  /** No API here (local dev server, or an older deploy). */
  | { kind: "offline" };

export type PublishedContent = {
  content: (SiteBundle & { media?: Img[] }) | null;
  updatedAt: string | null;
};

async function call(path: string, init?: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(path, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function errorOf(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getApiStatus(): Promise<ApiStatus> {
  try {
    const res = await call("/api/login", { method: "GET" }, 8000);
    if (!res.ok) return { kind: "offline" };
    const body = (await res.json()) as { configured?: boolean };
    return body.configured ? { kind: "live" } : { kind: "unconfigured" };
  } catch {
    return { kind: "offline" };
  }
}

/** Checks the owner's password with the site. Throws a readable message. */
export async function verifyPassword(password: string): Promise<void> {
  const res = await call("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(await errorOf(res, "Could not sign in."));
}

/** The content currently live on the site, if anything has been published. */
export async function fetchPublished(): Promise<PublishedContent> {
  try {
    const res = await call("/api/content", undefined, 10000);
    if (!res.ok) return { content: null, updatedAt: null };
    return (await res.json()) as PublishedContent;
  } catch {
    return { content: null, updatedAt: null };
  }
}

/** Puts the owner's work on the live site. Returns when it is live. */
export async function publishContent(
  password: string,
  content: SiteBundle & { media?: Img[] }
): Promise<string> {
  const res = await call(
    "/api/publish",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, content }),
    },
    30000
  );
  if (!res.ok) throw new Error(await errorOf(res, "Could not publish."));
  const body = (await res.json()) as { updatedAt: string };
  return body.updatedAt;
}

/** Stores an uploaded picture on the site; returns the address to use. */
export async function uploadPicture(
  password: string,
  dataUrl: string
): Promise<string> {
  const res = await call(
    "/api/upload",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password, dataUrl }),
    },
    60000
  );
  if (!res.ok) throw new Error(await errorOf(res, "Could not upload that picture."));
  const body = (await res.json()) as { src: string };
  return body.src;
}

/**
 * Pictures added before live publishing was switched on live inside the
 * content as inline data. These two helpers let the dashboard upload them
 * properly the first time it publishes, so the content file stays small and
 * the pages stay fast.
 */
export function collectInlinePictures(value: unknown, found = new Set<string>()): string[] {
  if (typeof value === "string") {
    if (value.startsWith("data:image/")) found.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectInlinePictures(item, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectInlinePictures(item, found));
  }
  return [...found];
}

export function replaceInlinePictures<T>(value: T, replacements: Map<string, string>): T {
  if (typeof value === "string") {
    return (replacements.get(value) ?? value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceInlinePictures(item, replacements)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = replaceInlinePictures(item, replacements);
    }
    return out as T;
  }
  return value;
}
