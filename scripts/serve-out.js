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
const zlib = require("node:zlib");

/** Types Netlify gzips. Binary media is already compressed; gzipping it
    would only burn CPU and break range requests. */
const COMPRESS = /^(text\/|application\/(json|xml|javascript)|image\/svg)/;

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
    const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    const size = fs.statSync(file).size;

    // Range requests. Without these a browser asking for part of the video
    // gets the whole 6 MB back, over and over — which is not what Netlify
    // does, and it made the measured page look several times heavier than
    // the one a visitor actually loads.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
    if (range && !COMPRESS.test(type)) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : size - 1;
      if (start >= size || end >= size || start > end) {
        res.writeHead(416, { "content-range": `bytes */${size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        "content-type": type,
        "content-range": `bytes ${start}-${end}/${size}`,
        "content-length": end - start + 1,
        "accept-ranges": "bytes",
        "cache-control": "no-store",
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    // Netlify serves text compressed; serving it raw here would have made
    // every measurement of this site pessimistic by about 700 KB.
    const wantsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
    if (wantsGzip && COMPRESS.test(type)) {
      res.writeHead(200, {
        "content-type": type,
        "content-encoding": "gzip",
        "vary": "accept-encoding",
        "cache-control": "no-store",
      });
      fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
      return;
    }

    res.writeHead(200, {
      "content-type": type,
      "content-length": size,
      "accept-ranges": "bytes",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}`));
