"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

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
  const [pending, setPending] = useState(false);

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

  return (
    <form
      className="mx-auto max-w-2xl space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);

        const additionalImageUrls = values.additionalImageLines
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

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
          Main image path
        </label>
        <input
          className="w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 font-mono text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="imageSrc"
          onChange={update("imageSrc")}
          placeholder="/rings/example.jpeg"
          required
          value={values.imageSrc}
        />
        <p className="text-xs text-[#6E6E6E]">Place files in `public/` and reference them like `/rings/photo.jpeg`.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#2B2B2B]" htmlFor="additional">
          Extra gallery images (one path per line)
        </label>
        <textarea
          className="min-h-[88px] w-full rounded-xl border border-[#F0D3DA] bg-white px-4 py-2.5 font-mono text-sm text-[#2B2B2B] outline-none focus:border-cta"
          id="additional"
          onChange={update("additionalImageLines")}
          placeholder={`/rings/detail-1.jpeg\n/rings/detail-2.jpeg`}
          value={values.additionalImageLines}
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
