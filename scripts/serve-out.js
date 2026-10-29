/**
 * The smallest possible static server for the exported site.
 *
 * `next build` writes `out/`, which is what Netlify publishes. The Playwright
 * suite runs against exactly those files rather than the dev server, so the
 * tests exercise the same HTML a visitor gets. No dependency — Node only.
 *
 * Usage: node scripts/serve-out.js [port]
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "out");
const PORT = Number(process.argv[2] ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  // Never escape the export directory.
  const target = path.normalize(path.join(ROOT, clean));
  if (!target.startsWith(ROOT)) return null;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, "index.html");
    return fs.existsSync(index) ? index : null;
  }
  if (fs.existsSync(target)) return target;
  // trailingSlash: true means /about → out/about/index.html
  const asDir = path.join(target, "index.html");
  if (fs.existsSync(asDir)) return asDir;
  const asHtml = `${target}.html`;
  return fs.existsSync(asHtml) ? asHtml : null;
}

http
  .createServer((req, res) => {
    const file = resolve(req.url ?? "/");
    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      if (fs.existsSync(notFound)) {
        res.writeHead(404, { "content-type": TYPES[".html"] });
        fs.createReadStream(notFound).pipe(res);
        return;
      }
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}`));
