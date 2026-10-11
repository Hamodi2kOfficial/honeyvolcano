/**
 * One-off image squeezer for public/.
 *
 * The site is a static export, so nothing optimises images for us at runtime:
 * whatever sits in public/ is what visitors download. This re-encodes the
 * oversized photos (and caps their dimensions at what the layout actually
 * uses), which is the single biggest thing we can do for load time.
 *
 * Run with: node scripts/optimize-images.js
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..", "public");
const MAX_EDGE = 1800; // nothing on the site is displayed larger than this
const MIN_SAVING = 0.05; // keep the original unless we save at least 5%

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const files = await walk(ROOT);
  let before = 0;
  let after = 0;

  for (const file of files) {
    const original = await fs.readFile(file);
    const image = sharp(original, { failOn: "none" });
    const meta = await image.metadata();
    const isPng = /\.png$/i.test(file);
    const tooBig = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;

    const pipeline = sharp(original, { failOn: "none" }).rotate();
    if (tooBig) pipeline.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside" });

    const output = isPng
      ? await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
      : await pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();

    before += original.byteLength;
    const saving = 1 - output.byteLength / original.byteLength;
    if (saving > MIN_SAVING) {
      await fs.writeFile(file, output);
      after += output.byteLength;
      console.log(
        `${path.relative(ROOT, file)}: ${kb(original.byteLength)} → ${kb(output.byteLength)} (−${Math.round(saving * 100)}%)`
      );
    } else {
      after += original.byteLength;
    }
  }

  console.log(`\nTotal: ${kb(before)} → ${kb(after)} (−${Math.round((1 - after / before) * 100)}%)`);
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
