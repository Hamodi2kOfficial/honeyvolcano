import { json, mediaStore } from "../lib/util.mjs";

/**
 * Serves a picture the owner uploaded. Each one has a unique address, so it is
 * safe to cache forever — the browser never re-downloads it.
 */
const handler = async (_req, context) => {
  const id = context.params?.id;
  if (!id) return json({ error: "Not found" }, 404);

  try {
    const result = await mediaStore().getWithMetadata(id, { type: "arrayBuffer" });
    if (!result?.data) return json({ error: "Not found" }, 404);
    return new Response(result.data, {
      headers: {
        "content-type": String(result.metadata?.contentType ?? "application/octet-stream"),
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return json({ error: "Not found" }, 404);
  }
};

export default handler;

// Both spellings: the site is built with trailing slashes, so a visitor or a
// redirect may ask for either form.
export const config = { path: ["/api/media/:id", "/api/media/:id/"] };
