import { CONTENT_KEY, contentStore, json } from "../lib/util.mjs";

/**
 * What the public site asks on every page load: "has the owner published
 * anything newer than this build?" Answers with the published content, or
 * null, in which case visitors keep the content baked into the site.
 */
const handler = async () => {
  try {
    const saved = await contentStore().get(CONTENT_KEY, { type: "json" });
    return json({
      content: saved?.content ?? null,
      updatedAt: saved?.updatedAt ?? null,
    });
  } catch {
    // Blobs unavailable — never break the site over it.
    return json({ content: null, updatedAt: null });
  }
};

export default handler;

// Both spellings: the site is built with trailing slashes, so a visitor or a
// redirect may ask for either form.
export const config = { path: ["/api/content", "/api/content/"] };
