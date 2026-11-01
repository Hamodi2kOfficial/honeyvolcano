// Luminance-key the Honey Volcano badge: drop the near-black tile, keep the
// bright copper/gold artwork on full transparency. Source is the PNG cutout.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const SRC = path.join(__dirname, "..", "public", "logo-gold.png");
const OUT = path.join(__dirname, "..", "public", "logo-clean.png");

const LOW = 34; // luminance <= LOW  -> transparent
const HIGH = 96; // luminance >= HIGH -> opaque

const png = PNG.sync.read(fs.readFileSync(SRC));
const { data } = png;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a = (lum - LOW) / (HIGH - LOW);
  a = a < 0 ? 0 : a > 1 ? 1 : a;
  // combine with any existing alpha (outside-badge is already transparent)
  const prev = data[i + 3] / 255;
  data[i + 3] = Math.round(a * prev * 255);
}

fs.writeFileSync(OUT, PNG.sync.write(png));
console.log("wrote", OUT, `${png.width}x${png.height}`);
