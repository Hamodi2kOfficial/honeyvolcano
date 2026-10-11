import { json, passwordOk, publishingConfigured, readJson } from "../lib/util.mjs";

/**
 * GET  — tells the dashboard whether live publishing is set up on this site.
 * POST — checks the owner's password.
 */
const handler = async (req) => {
  if (req.method === "GET") {
    return json({ configured: publishingConfigured() });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

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
  // A small, constant delay blunts password guessing without annoying the owner.
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (!passwordOk(body?.password)) {
    return json({ error: "Wrong password." }, 401);
  }
  return json({ ok: true });
};

export default handler;

// Both spellings: the site is built with trailing slashes, so a visitor or a
// redirect may ask for either form.
export const config = { path: ["/api/login", "/api/login/"] };
