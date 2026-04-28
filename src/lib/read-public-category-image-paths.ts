import fs from "node:fs";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

export const readPublicCategoryImagePaths = (folder: string): readonly string[] => {
  const absoluteDir = path.join(process.cwd(), "public", folder);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const names = fs
    .readdirSync(absoluteDir)
    .filter((name) => IMAGE_EXT.test(name) && !name.startsWith("."));

  const sorted = [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return sorted.map((name) => `/${folder}/${encodeURIComponent(name)}`);
};
