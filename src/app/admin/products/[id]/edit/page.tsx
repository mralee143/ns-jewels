import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin/admin-product-form";
import { isProductCategorySlug } from "@/data/product-categories";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const row = await prisma.product.findUnique({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
    where: { id },
  });

  if (!row || !isProductCategorySlug(row.category)) {
    notFound();
  }

  const featureRaw = row.featureBullets;
  const featureBulletsText =
    Array.isArray(featureRaw) && featureRaw.every((line) => typeof line === "string")
      ? featureRaw.join("\n")
      : "";

  const additionalImageLines = row.images.map((image) => image.url).join("\n");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">Edit product</h1>
        <p className="mt-2 text-sm text-[#6E6E6E]">Update pricing, images, and visibility.</p>
      </div>
      <AdminProductForm
        initial={{
          additionalImageLines,
          category: row.category,
          compareAtRupees:
            row.compareAtPricePaisa !== null && row.compareAtPricePaisa !== undefined
              ? (row.compareAtPricePaisa / 100).toFixed(2)
              : "",
          description: row.description,
          featureBullets: featureBulletsText,
          imageSrc: row.imageSrc,
          priceRupees: (row.pricePaisa / 100).toFixed(2),
          published: row.published,
          slug: row.slug,
          title: row.title,
        }}
        mode="edit"
        productId={row.id}
      />
    </div>
  );
}
