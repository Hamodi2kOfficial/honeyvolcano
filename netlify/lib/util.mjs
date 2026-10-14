import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

/**
 * Shared helpers for the site's tiny content API.
 *
 * The owner's published content lives in Netlify Blobs — no database, no
 * GitHub, nothing to pay for. Writing is protected by one password held in the
 * Netlify environment variable ADMIN_PASSWORD. If that variable is not set,
 * publishing stays switched off (the dashboard then works in browser-only
 * mode), so this repository never contains a usable password.
 */
export const CONTENT_STORE = "site-content";
export const MEDIA_STORE = "site-media";
export const CONTENT_KEY = "current";
export const LEADS_STORE = "site-leads";
export const STATS_STORE = "site-stats";

export function contentStore() {
  return getStore(CONTENT_STORE);
}
export function mediaStore() {
  return getStore(MEDIA_STORE);
}
export function leadsStore() {
  return getStore(LEADS_STORE);
}
export function statsStore() {
  return getStore(STATS_STORE);
}

/** Today as yyyy-mm-dd, the key one day of statistics is stored under. */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function publishingConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Constant-time comparison so the password cannot be guessed by timing. */
export function passwordOk(given) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== "string" || given.length === 0) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Reads a JSON body, returning null when it is missing or malformed. */
export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
