import { json, readJson, statsStore, today } from "../lib/util.mjs";

const EVENTS = new Set(["view", "taste", "enquiry", "offer"]);

/**
 * One counter per day: how many people looked at a page, and how often the
 * taste button was used. Deliberately anonymous — no cookies, no identifiers,
 * so the site needs no cookie banner.
 *
 * Counting is read-then-write, so two visitors in the very same instant can
 * cost one count. For a site this size that is a fair trade for having no
 * database at all.
 */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  const event = typeof body?.event === "string" ? body.event : "";
  if (!EVENTS.has(event)) return json({ ok: true });

  const path = typeof body?.path === "string" ? body.path.slice(0, 80) : "/";
  const key = today();

  try {
    const store = statsStore();
    const day = (await store.get(key, { type: "json" })) ?? {
      date: key,
      views: {},
      events: {},
    };
    if (event === "view") day.views[path] = (day.views[path] ?? 0) + 1;
    else day.events[event] = (day.events[event] ?? 0) + 1;
    await store.setJSON(key, day);
  } catch {
    // Statistics must never break a page view.
  }
  return json({ ok: true });
};

export default handler;

export const config = { path: ["/api/track", "/api/track/"] };
