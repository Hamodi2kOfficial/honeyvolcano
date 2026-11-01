// Luminance-key the gold-on-black logo to a true transparent PNG.
// Dark pixels -> transparent, bright gold artwork -> opaque. Soft edges preserved.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const SRC = path.join(__dirname, "..", "public", "logo.png");
const OUT = path.join(__dirname, "..", "public", "logo-gold.png");

const LOW = 42;   // luminance at/below -> fully transparent
const HIGH = 104; // luminance at/above -> fully opaque

const png = PNG.sync.read(fs.readFileSync(SRC));
const { data } = png;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a = (lum - LOW) / (HIGH - LOW);
  a = a < 0 ? 0 : a > 1 ? 1 : a;
  data[i + 3] = Math.round(a * 255);
}

fs.writeFileSync(OUT, PNG.sync.write(png));
console.log("wrote", OUT, `${png.width}x${png.height}`);
