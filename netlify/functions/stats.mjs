import { json, passwordOk, readJson, statsStore } from "../lib/util.mjs";

/** The owner's visitor numbers — the last 60 days of counters. */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  if (!passwordOk(body?.password)) return json({ error: "Wrong password." }, 401);

  try {
    const store = statsStore();
    const { blobs } = await store.list();
    const keys = blobs
      .map((b) => b.key)
      .sort()
      .slice(-60);
    const days = await Promise.all(keys.map((k) => store.get(k, { type: "json" })));
    return json({ days: days.filter(Boolean) });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
};

export default handler;

export const config = { path: ["/api/stats", "/api/stats/"] };
