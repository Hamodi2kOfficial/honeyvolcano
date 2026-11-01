import { randomUUID } from "node:crypto";

import {
  json,
  mediaStore,
  passwordOk,
  publishingConfigured,
  readJson,
} from "../lib/util.mjs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Stores a picture the owner uploaded in the dashboard and hands back the
 * address the site will serve it from. Keeping photos out of the content file
 * is what makes publishing fast and the pages light.
 */
const handler = async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await readJson(req);
  if (!publishingConfigured()) {
    return json({ error: "Live publishing is not set up for this site yet." }, 503);
  }
  if (!passwordOk(body?.password)) return json({ error: "Wrong password." }, 401);

  const dataUrl = body?.dataUrl;
  const match =
    typeof dataUrl === "string" && dataUrl.match(/^data:([a-z0-9/+.-]+);base64,(.+)$/i);
  if (!match) return json({ error: "That is not a picture." }, 400);

  const [, contentType, base64] = match;
  if (!ALLOWED.includes(contentType.toLowerCase())) {
    return json({ error: `Pictures must be JPG, PNG, WebP, GIF or AVIF.` }, 415);
  }

  const bytes = Buffer.from(base64, "base64");
  if (bytes.byteLength > MAX_BYTES) {
    return json({ error: "That picture is too large (4 MB maximum)." }, 413);
  }

  const extension = contentType.split("/")[1].replace("jpeg", "jpg");
  const id = `${randomUUID()}.${extension}`;
  try {
    await mediaStore().set(id, bytes, { metadata: { contentType } });
  } catch (error) {
    return json({ error: `Could not save the picture: ${error.message}` }, 500);
  }

  return json({ ok: true, src: `/api/media/${id}` });
};

export default handler;

// Both spellings: the site is built with trailing slashes, so a visitor or a
// redirect may ask for either form.
export const config = { path: ["/api/upload", "/api/upload/"] };
