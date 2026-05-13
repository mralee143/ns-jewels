"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type ChangeEvent } from "react";

import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  type ProductCategorySlug,
} from "@/data/product-categories";

export type AdminProductFormValues = {
  additionalImageLines: string;
  category: ProductCategorySlug;
  compareAtRupees: string;
  description: string;
  featureBullets: string;
  imageSrc: string;
  priceRupees: string;
  published: boolean;
  slug: string;
  title: string;
};

type GalleryImage = {
  readonly url: string;
};

type ImageTarget = "additional" | "main";

const defaultValues: AdminProductFormValues = {
  additionalImageLines: "",
  category: "rings",
  compareAtRupees: "",
  description: "",
  featureBullets: "",
  imageSrc: "",
  priceRupees: "",
  published: true,
  slug: "",
  title: "",
};

const imagePathLinesToArray = (value: string): readonly string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const appendUniqueImagePath = (value: string, imagePath: string): string =>
  [...new Set([...imagePathLinesToArray(value), imagePath])].join("\n");

const galleryImagesFromResponse = (data: unknown): readonly GalleryImage[] => {
  if (!data || typeof data !== "object") {
    return [];
  }

  const images = (data as { images?: unknown }).images;
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image): GalleryImage | null => {
      if (!image || typeof image !== "object") {
        return null;
      }

      const url = (image as { url?: unknown }).url;
      return typeof url === "string" && url.startsWith("/") ? { url } : null;
    })
    .filter((image): image is GalleryImage => image !== null);
};

const uploadedImageUrlFromResponse = (data: unknown): string | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const image = (data as { image?: unknown }).image;
  if (!image || typeof image !== "object") {
    return null;
  }

  const url = (image as { url?: unknown }).url;
  return typeof url === "string" && url.startsWith("/") ? url : null;
};

export type AdminProductFormProps = {
  readonly initial?: Partial<AdminProductFormValues>;
  readonly mode: "create" | "edit";
  readonly productId?: string;
};

export function AdminProductForm({ initial, mode, productId }: AdminProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<AdminProductFormValues>({
    ...defaultValues,
    ...initial,
  });
  const [error, setError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<readonly GalleryImage[]>([]);
  const [galleryPending, setGalleryPending] = useState(true);
  const [pending, setPending] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<ImageTarget | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadGalleryImages = async () => {
      setGalleryPending(true);
      setGalleryError(null);

      try {
        const response = await fetch("/api/admin/product-images", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          setGalleryError("Gallery images could not be loaded.");
          return;
        }

        const data = (await response.json().catch(() => null)) as unknown;
        if (!cancelled) {
          setGalleryImages(galleryImagesFromResponse(data));
        }
      } catch {
        if (!cancelled) {
          setGalleryError("Gallery images could not be loaded.");
        }
      } finally {
        if (!cancelled) {
          setGalleryPending(false);
        }
      }
    };

    void loadGalleryImages();

    return () => {
      cancelled = true;
    };
  }, []);

  const update =
    (field: keyof AdminProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        setValues((previous) => ({ ...previous, [field]: target.checked }));
        return;
      }
      setValues((previous) => ({ ...previous, [field]: target.value }));
    };

  const selectImage = (target: ImageTarget, url: string) => {
    setValues((previous) =>
      target === "main"
        ? { ...previous, imageSrc: url }
        : { ...previous, additionalImageLines: appendUniqueImagePath(previous.additionalImageLines, url) },
    );
  };

  const uploadImage = async (target: ImageTarget, file: File) => {
    setError(null);
    setUploadingTarget(target);

    const formData = new FormData();
    formData.set("image", file);

    try {
      const response = await fetch("/api/admin/product-images", {
        body: formData,
        method: "POST",
      });

      const data = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        setError((data as { error?: string } | null)?.error ?? "Image upload failed.");
        return;
      }

      const url = uploadedImageUrlFromResponse(data);
      if (!url) {
        setError("Image upload failed.");
        return;
      }

      setGalleryImages((previous) => [{ url }, ...previous.filter((image) => image.url !== url)]);
      selectImage(target, url);
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploadingTarget(null);
    }
  };

  return (
    <form
      className="mx-auto max-w-2xl space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);

        const additionalImageUrls = imagePathLinesToArray(values.additionalImageLines);

        const payload: Record<string, unknown> = {
          additionalImageUrls,
          category: values.category,
          description: values.description,
          featureBullets: values.featureBullets,
          imageSrc: values.imageSrc,
          priceRupees: values.priceRupees,
          published: values.published,
          slug: values.slug.trim().length > 0 ? values.slug : undefined,
          title: values.title,
        };

        if (values.compareAtRupees.trim().length > 0) {
          payload.compareAtPriceRupees = values.compareAtRupees;
        }

        try {
          const url =
            mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId ?? ""}`;
          const response = await fetch(url, {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
            method: mode === "create" ? "POST" : "PATCH",
          });

          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(data?.error ?? "Save failed.");
            return;
          }

          router.push("/admin/products");
          router.refresh();
        } catch {
          setError("Save failed.");
        } finally {
          setPending(false);
        }
      }}
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="title">
          Title
        </label>
        <input
          className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="title"
          onChange={update("title")}
          required
          value={values.title}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="slug">
            Slug (optional — derived from title if empty on create)
          </label>
          <input
            className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 font-mono text-sm text-[#2B2B2B] outline-none focus:border-cta"
            id="slug"
            onChange={update("slug")}
            value={values.slug}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="category">
            Category
          </label>
          <select
            className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
            id="category"
            onChange={update("category")}
            value={values.category}
          >
            {PRODUCT_CATEGORY_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {PRODUCT_CATEGORY_LABELS[slug]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="description">
          Description
        </label>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="description"
          onChange={update("description")}
          required
          value={values.description}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="price">
            Price (PKR)
          </label>
          <input
            className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
            id="price"
            min="0"
            onChange={update("priceRupees")}
            required
            step="0.01"
            type="number"
            value={values.priceRupees}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="compareAt">
            Compare-at price (PKR, optional)
          </label>
          <input
            className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
            id="compareAt"
            min="0"
            onChange={update("compareAtRupees")}
            step="0.01"
            type="number"
            value={values.compareAtRupees}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="imageSrc">
          Main image
        </label>
        <input
          className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 font-mono text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="imageSrc"
          onChange={update("imageSrc")}
          placeholder="/rings/example.jpeg"
          required
          value={values.imageSrc}
        />
        <p className="text-xs text-[#6E6E6E]">
          Paste a path, pick an existing gallery image, or upload from your device.
        </p>
        {values.imageSrc ? (
          <div className="relative aspect-square w-32 overflow-hidden rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]">
            <Image
              alt="Selected main product image"
              className="object-cover"
              fill
              sizes="128px"
              src={values.imageSrc}
            />
          </div>
        ) : null}
        <AdminProductImagePicker
          galleryError={galleryError}
          galleryImages={galleryImages}
          galleryPending={galleryPending}
          onSelect={(url) => selectImage("main", url)}
          onUpload={(file) => uploadImage("main", file)}
          selectLabel="Use as main image"
          uploadLabel="Choose file or gallery photo"
          uploading={uploadingTarget === "main"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="additional">
          Extra product gallery images
        </label>
        <textarea
          className="min-h-[88px] w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 font-mono text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="additional"
          onChange={update("additionalImageLines")}
          placeholder={`/rings/detail-1.jpeg\n/rings/detail-2.jpeg`}
          value={values.additionalImageLines}
        />
        <p className="text-xs text-[#6E6E6E]">
          Keep one image path per line. Selecting or uploading below adds the image here.
        </p>
        <AdminProductImagePicker
          galleryError={galleryError}
          galleryImages={galleryImages}
          galleryPending={galleryPending}
          onSelect={(url) => selectImage("additional", url)}
          onUpload={(file) => uploadImage("additional", file)}
          selectLabel="Add to gallery"
          uploadLabel="Upload extra image"
          uploading={uploadingTarget === "additional"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="bullets">
          Feature bullets (one per line, optional)
        </label>
        <textarea
          className="min-h-[88px] w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="bullets"
          onChange={update("featureBullets")}
          value={values.featureBullets}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#2B2B2B]">
        <input
          checked={values.published}
          className="size-4 accent-cta"
          onChange={update("published")}
          type="checkbox"
        />
        Published on storefront
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          className="rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          className="rounded-full border border-[#F0D3DA] bg-white px-6 py-2.5 text-sm font-semibold text-[#2B2B2B] transition-colors hover:bg-[#FDF2F5]"
          disabled={pending}
          onClick={() => router.push("/admin/products")}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type AdminProductImagePickerProps = {
  readonly galleryError: string | null;
  readonly galleryImages: readonly GalleryImage[];
  readonly galleryPending: boolean;
  readonly onSelect: (url: string) => void;
  readonly onUpload: (file: File) => void;
  readonly selectLabel: string;
  readonly uploadLabel: string;
  readonly uploading: boolean;
};

function AdminProductImagePicker({
  galleryError,
  galleryImages,
  galleryPending,
  onSelect,
  onUpload,
  selectLabel,
  uploadLabel,
  uploading,
}: AdminProductImagePickerProps) {
  const fileInputId = useId();

  return (
    <div className="space-y-4 rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#2B2B2B]">Image gallery</p>
          <p className="text-xs text-[#6E6E6E]">Pick an uploaded image or add a new one from your device.</p>
        </div>
        <label
          className={`rounded-full bg-cta px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cta-hover ${
            uploading ? "pointer-events-none opacity-60" : "cursor-pointer"
          }`}
          htmlFor={fileInputId}
        >
          {uploading ? "Uploading..." : uploadLabel}
          <input
            accept="image/avif,image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            id={fileInputId}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onUpload(file);
              }
              event.target.value = "";
            }}
            type="file"
          />
        </label>
      </div>

      {galleryError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {galleryError}
        </p>
      ) : null}

      {galleryPending ? (
        <p className="text-xs text-[#6E6E6E]">Loading gallery images...</p>
      ) : galleryImages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#F0D3DA] bg-white px-3 py-4 text-xs text-[#6E6E6E]">
          No uploaded product images yet. Use the file button to add your first image.
        </p>
      ) : (
        <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
          {galleryImages.map((image) => (
            <button
              className="group overflow-hidden rounded-2xl border border-[#F0D3DA] bg-white text-left shadow-sm transition hover:border-cta"
              key={image.url}
              onClick={() => onSelect(image.url)}
              type="button"
            >
              <span className="relative block aspect-square bg-[#FDF2F5]">
                <Image
                  alt=""
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(min-width: 640px) 160px, 45vw"
                  src={image.url}
                />
              </span>
              <span className="block truncate px-2 py-2 text-xs font-semibold text-cta">
                {selectLabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
