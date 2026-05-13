import { randomUUID } from "crypto";
import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { PRODUCT_CATEGORY_SLUGS } from "@/data/product-categories";
import { requireAdminSession } from "@/lib/require-admin-session";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const UPLOAD_ROOT = path.join(PUBLIC_ROOT, "uploads", "products");

const IMAGE_SOURCE_DIRECTORIES = ["uploads", ...PRODUCT_CATEGORY_SLUGS] as const;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MIME_EXTENSION_BY_TYPE = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
const SUPPORTED_IMAGE_EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

export const runtime = "nodejs";

const isSupportedImageFilename = (filename: string): boolean =>
  SUPPORTED_IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());

const isSupportedImageType = (type: string): type is keyof typeof MIME_EXTENSION_BY_TYPE =>
  Object.prototype.hasOwnProperty.call(MIME_EXTENSION_BY_TYPE, type);

const pathSegmentsToPublicUrl = (segments: readonly string[]): string =>
  `/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;

const publicImageUrlsFromDirectory = async (
  directory: string,
  urlSegments: readonly string[],
): Promise<readonly string[]> => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);

  const imageUrlGroups = await Promise.all(
    entries.map((entry) => {
      if (entry.name.startsWith(".")) {
        return Promise.resolve([] as readonly string[]);
      }

      const nextDirectory = path.join(directory, entry.name);
      const nextSegments = [...urlSegments, entry.name];

      if (entry.isDirectory()) {
        return publicImageUrlsFromDirectory(nextDirectory, nextSegments);
      }

      return Promise.resolve(
        entry.isFile() && isSupportedImageFilename(entry.name)
          ? [pathSegmentsToPublicUrl(nextSegments)]
          : [],
      );
    }),
  );

  return imageUrlGroups.flat();
};

const galleryImageUrls = async (): Promise<readonly string[]> => {
  const imageUrlGroups = await Promise.all(
    IMAGE_SOURCE_DIRECTORIES.map((directoryName) =>
      publicImageUrlsFromDirectory(path.join(PUBLIC_ROOT, directoryName), [directoryName]),
    ),
  );

  return [...new Set(imageUrlGroups.flat())].sort((left, right) => left.localeCompare(right));
};

const safeFilenameStem = (filename: string): string => {
  const basename = path.basename(filename).replace(/\.[^.]+$/, "");
  const safe = basename.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return safe.length > 0 ? safe : "product";
};

export async function GET(): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const images = await galleryImageUrls();

  return NextResponse.json({
    images: images.map((url) => ({ url })),
  });
}

export async function POST(request: Request): Promise<Response> {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Choose an image file to upload" }, { status: 400 });
  }

  if (!isSupportedImageType(image.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WEBP, and AVIF images are supported" }, { status: 400 });
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be 8MB or smaller" }, { status: 400 });
  }

  const extension = MIME_EXTENSION_BY_TYPE[image.type];
  const filename = `${safeFilenameStem(image.name)}-${randomUUID()}.${extension}`;
  const bytes = new Uint8Array(await image.arrayBuffer());

  await mkdir(UPLOAD_ROOT, { recursive: true });
  await writeFile(path.join(UPLOAD_ROOT, filename), bytes);

  return NextResponse.json(
    {
      image: {
        url: `/uploads/products/${filename}`,
      },
    },
    { status: 201 },
  );
}
