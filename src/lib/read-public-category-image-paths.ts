import fs from "node:fs";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Alternate shoots (blush/white backdrops, cart crops) — not separate SKUs on the category grid. */
const isSupplementaryCategoryImageFileName = (fileName: string): boolean => {
  const lower = fileName.toLowerCase();
  return lower.includes("-gallery") || lower.includes("-cart-");
};

export const readPublicCategoryImagePaths = (folder: string): readonly string[] => {
  const absoluteDir = path.join(process.cwd(), "public", folder);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const names = fs
    .readdirSync(absoluteDir)
    .filter(
      (name) =>
        IMAGE_EXT.test(name) && !name.startsWith(".") && !isSupplementaryCategoryImageFileName(name)
    );

  const sorted = [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return sorted.map((name) => `/${folder}/${encodeURIComponent(name)}`);
};
