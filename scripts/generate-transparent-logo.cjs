/**
 * Reads scripts/logo-source.jpg (gold logo on black), removes near-black pixels,
 * writes public/brand_logo.png with alpha. Tune BG_* constants if edges look harsh.
 */

/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script */

const path = require("path");

const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "scripts", "logo-source.jpg");
const OUTPUT = path.join(ROOT, "public", "brand_logo.png");

/** Pixels with max(R,G,B) at or below this are treated as background. */
const BG_MAX = 22;
/** Fully opaque from this max channel upward (JPEG gold stays above this). */
const FG_MAX = 56;

const spreadOf = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

const alphaForPixel = (r, g, b) => {
  const mx = Math.max(r, g, b);
  const spread = spreadOf(r, g, b);

  if (mx <= BG_MAX && spread <= 14) {
    return 0;
  }

  if (mx >= FG_MAX || spread >= 28) {
    return 255;
  }

  const t = (mx - BG_MAX) / (FG_MAX - BG_MAX);
  return Math.max(0, Math.min(255, Math.round(Math.max(0, Math.min(1, t)) * 255)));
};

async function main() {
  const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    const src = i * channels;
    const r = data[src];
    const g = data[src + 1];
    const b = data[src + 2];
    const a = alphaForPixel(r, g, b);
    const dst = i * 4;
    out[dst] = r;
    out[dst + 1] = g;
    out[dst + 2] = b;
    out[dst + 3] = a;
  }

  await sharp(out, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(OUTPUT);

  console.log("Wrote", OUTPUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
