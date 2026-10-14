import { randomUUID } from "node:crypto";

import { json, leadsStore, readJson } from "../lib/util.mjs";

const LIMITS = { name: 120, email: 200, phone: 60, message: 2000, source: 80 };

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

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
  // Honeypot: a real person never fills a hidden field.
  if (clean(body?.company, 50)) return json({ ok: true });

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
    await leadsStore().setJSON(lead.id, lead);
  } catch (error) {
    return json({ error: `Could not send that: ${error.message}` }, 500);
  }
  return json({ ok: true });
};

export default handler;

export const config = { path: ["/api/lead", "/api/lead/"] };
