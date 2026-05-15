/**
 * Reads public/ns-logo-new-source.png (flat light-grey studio background),
 * removes low-chroma pixels near the sampled corner key, writes public/brand_logo.png
 * with alpha and trims empty margins.
 */

/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script */

const path = require("path");

const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "public", "ns-logo-new-source.png");
const OUTPUT = path.join(ROOT, "public", "brand_logo.png");

/** Treat as background when chroma is low and RGB is close to the corner key. */
const MAX_CHROMA = 22;
/** Fully transparent inside this RGB distance from the key (inclusive). */
const KEY_CLEAR = 38;
/** Fully opaque from this distance upward (low-chroma pixels only). */
const KEY_OPAQUE = 72;

const distanceToKey = (r, g, b, kr, kg, kb) =>
  Math.sqrt((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2);

const chromaOf = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

const alphaForPixel = (r, g, b, kr, kg, kb) => {
  const chroma = chromaOf(r, g, b);
  if (chroma > MAX_CHROMA) {
    return 255;
  }

  const dist = distanceToKey(r, g, b, kr, kg, kb);
  if (dist <= KEY_CLEAR) {
    return 0;
  }

  if (dist >= KEY_OPAQUE) {
    return 255;
  }

  const t = (dist - KEY_CLEAR) / (KEY_OPAQUE - KEY_CLEAR);
  return Math.max(0, Math.min(255, Math.round(t * 255)));
};

const averageCornerRgb = (data, width, height, channels) => {
  const sample = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };

  const corners = [
    sample(0, 0),
    sample(width - 1, 0),
    sample(0, height - 1),
    sample(width - 1, height - 1),
  ];

  const sum = corners.reduce(
    (acc, rgb) => {
      acc[0] += rgb[0];
      acc[1] += rgb[1];
      acc[2] += rgb[2];
      return acc;
    },
    [0, 0, 0],
  );

  return [Math.round(sum[0] / 4), Math.round(sum[1] / 4), Math.round(sum[2] / 4)];
};

async function main() {
  const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const [kr, kg, kb] = averageCornerRgb(data, width, height, channels);
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    const src = i * channels;
    const r = data[src];
    const g = data[src + 1];
    const b = data[src + 2];
    const a = alphaForPixel(r, g, b, kr, kg, kb);
    const dst = i * 4;
    out[dst] = r;
    out[dst + 1] = g;
    out[dst + 2] = b;
    out[dst + 3] = a;
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .trim()
    .toFile(OUTPUT);

  const meta = await sharp(OUTPUT).metadata();
  console.log("Key RGB", kr, kg, kb);
  console.log("Wrote", OUTPUT, `${meta.width}x${meta.height}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
