import { createHash, randomUUID } from "node:crypto";

import { json, leadsStore, readJson } from "../lib/util.mjs";

const LIMITS = { name: 120, email: 200, phone: 60, message: 2000, source: 80 };

/** One sender may post this many messages inside the window below. */
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/**
 * A light per-sender rate limit, kept in the same blob store as the leads.
 *
 * The sender is identified by a salted hash of their IP, never the address
 * itself, and the counter expires with its window — so nothing identifying is
 * retained. It is not a defence against a determined flood (that is Netlify's
 * job); it stops the ordinary case of a script hammering the form.
 */
async function rateLimited(req, store) {
  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  if (!ip) return false;

  const key = `rate/${createHash("sha256").update(`hv:${ip}`).digest("hex").slice(0, 24)}`;
  const now = Date.now();
  try {
    const seen = (await store.get(key, { type: "json" })) ?? { count: 0, start: now };
    const window = now - seen.start > RATE_WINDOW_MS ? { count: 0, start: now } : seen;
    if (window.count >= RATE_MAX) return true;
    await store.setJSON(key, { count: window.count + 1, start: window.start });
  } catch {
    // The store is unavailable — let the message through rather than lose it.
  }
  return false;
}

/**
 * A visitor sending an enquiry. Public on purpose — no password — so it only
 * ever writes one small record, with everything trimmed to a sane length.
 */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  const email = clean(body?.email, LIMITS.email);
  const phone = clean(body?.phone, LIMITS.phone);
  const name = clean(body?.name, LIMITS.name);

  if (!name) return json({ error: "Please tell us your name." }, 400);
  if (!email && !phone) {
    return json({ error: "Please leave an email address or a phone number." }, 400);
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "That email address does not look right." }, 400);
  }
  // Honeypot: a real person never fills a hidden field. Answer "ok" so the
  // robot has nothing to learn from the response.
  if (clean(body?.company, 50)) return json({ ok: true });

  const store = leadsStore();
  if (await rateLimited(req, store)) {
    return json({ error: "Too many messages just now. Please try again shortly." }, 429);
  }

  const at = new Date().toISOString();
  const lead = {
    id: `${at}-${randomUUID().slice(0, 8)}`,
    at,
    name,
    email,
    phone,
    message: clean(body?.message, LIMITS.message),
    source: clean(body?.source, LIMITS.source) || "website",
    read: false,
  };

  try {
    await store.setJSON(lead.id, lead);
  } catch (error) {
    return json({ error: `Could not send that: ${error.message}` }, 500);
  }
  return json({ ok: true });
};

export default handler;

export const config = { path: ["/api/lead", "/api/lead/"] };
