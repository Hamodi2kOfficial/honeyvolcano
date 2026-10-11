import {
  CONTENT_KEY,
  contentStore,
  json,
  passwordOk,
  publishingConfigured,
  readJson,
} from "../lib/util.mjs";

/** Puts the owner's work on the live site. */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  if (!publishingConfigured()) {
    return json(
      {
        error:
          "Live publishing is not set up for this site yet (ADMIN_PASSWORD is missing in Netlify).",
      },
      503
    );
  }
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (!passwordOk(body?.password)) return json({ error: "Wrong password." }, 401);

  const content = body?.content;
  // Refuse anything that is not a complete, sane content bundle, so a bad
  // request can never blank the website.
  if (
    !content ||
    typeof content !== "object" ||
    !Array.isArray(content.home?.sections) ||
    !Array.isArray(content.products) ||
    !Array.isArray(content.gallery?.slides) ||
    typeof content.site !== "object"
  ) {
    return json({ error: "That does not look like site content." }, 400);
  }

  const updatedAt = new Date().toISOString();
  try {
    await contentStore().setJSON(CONTENT_KEY, { content, updatedAt });
  } catch (error) {
    return json({ error: `Could not save: ${error.message}` }, 500);
  }
  return json({ ok: true, updatedAt });
};

export default handler;

// Both spellings: the site is built with trailing slashes, so a visitor or a
// redirect may ask for either form.
export const config = { path: ["/api/publish", "/api/publish/"] };
