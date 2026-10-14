import { getStore } from "@netlify/blobs";

/**
 * Share preview, applied as the page is served.
 *
 * Facebook, WhatsApp and Google read the HTML itself — they never run the
 * site's JavaScript — so a title the owner publishes has to be in the markup.
 * This rewrites the <head> on the way out, straight from what was published,
 * with no rebuild. Anything unexpected and the original page is passed through
 * untouched, so this can never take the site down.
 */
const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const handler = async (request: Request, context: { next: () => Promise<Response> }) => {
  const response = await context.next();

  try {
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) return response;

    const store = getStore("site-content");
    const saved = (await store.get("current", { type: "json" })) as
      | { content?: { marketing?: { share?: { title?: string; description?: string; image?: string } } } }
      | null;

    const share = saved?.content?.marketing?.share;
    if (!share?.title && !share?.description && !share?.image) return response;

    const html = await response.text();
    const origin = new URL(request.url).origin;
    const title = escape(share.title ?? "");
    const description = escape(share.description ?? "");
    const image = share.image
      ? escape(share.image.startsWith("http") ? share.image : `${origin}${share.image}`)
      : "";

    let out = html;
    if (title) {
      out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    }
    if (description) {
      out = out.replace(
        /<meta name="description" content="[\s\S]*?"\s*\/?>/i,
        `<meta name="description" content="${description}"/>`
      );
    }

    const tags = [
      title && `<meta property="og:title" content="${title}"/>`,
      description && `<meta property="og:description" content="${description}"/>`,
      image && `<meta property="og:image" content="${image}"/>`,
      `<meta property="og:type" content="website"/>`,
      `<meta property="og:url" content="${escape(request.url)}"/>`,
      `<meta name="twitter:card" content="summary_large_image"/>`,
      title && `<meta name="twitter:title" content="${title}"/>`,
      description && `<meta name="twitter:description" content="${description}"/>`,
      image && `<meta name="twitter:image" content="${image}"/>`,
    ]
      .filter(Boolean)
      .join("");

    out = out.replace("</head>", `${tags}</head>`);

    return new Response(out, {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    // Never let the share preview break a page.
    return response;
  }
};

export default handler;

export const config = { path: ["/", "/products/", "/gallery/"] };
