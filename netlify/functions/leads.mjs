import { json, leadsStore, passwordOk, readJson } from "../lib/util.mjs";

/**
 * The owner's enquiry inbox: list, mark as read, delete. Password protected,
 * because these are real people's contact details.
 */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  if (!passwordOk(body?.password)) return json({ error: "Wrong password." }, 401);

  const store = leadsStore();
  const action = body?.action ?? "list";

  try {
    if (action === "list") {
      const { blobs } = await store.list();
      const leads = await Promise.all(
        // "rate/…" keys are the form's own rate-limit counters, not enquiries.
        blobs
          .filter((blob) => !blob.key.startsWith("rate/"))
          .map((blob) => store.get(blob.key, { type: "json" }))
      );
      // Newest first; the key starts with the timestamp.
      leads.sort((a, b) => String(b?.id ?? "").localeCompare(String(a?.id ?? "")));
      return json({ leads: leads.filter(Boolean) });
    }

    if (action === "read" || action === "unread") {
      const lead = await store.get(body.id, { type: "json" });
      if (!lead) return json({ error: "Not found." }, 404);
      await store.setJSON(body.id, { ...lead, read: action === "read" });
      return json({ ok: true });
    }

    if (action === "delete") {
      await store.delete(body.id);
      return json({ ok: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
};

export default handler;

export const config = { path: ["/api/leads", "/api/leads/"] };
