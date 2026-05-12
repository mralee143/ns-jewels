import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { isProductCategorySlug, PRODUCT_CATEGORY_LABELS } from "@/data/product-categories";
import { shopPriceLabelFromPaisa } from "@/lib/db-product-mapper";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      category: true,
      id: true,
      pricePaisa: true,
      published: true,
      slug: true,
      title: true,
      updatedAt: true,
    },
    take: 300,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">Products</h1>
        </div>
        <Link
          className="rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
          href="/admin/products/new"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#F0D3DA] bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#F0D3DA] bg-[#FDF2F5]/60 text-xs font-semibold uppercase tracking-wider text-[#6E6E6E]">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0D3DA]">
            {products.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-[#6E6E6E]" colSpan={6} />
              </tr>
            ) : (
              products.map((product) => (
                <tr className="hover:bg-[#FDF2F5]/40" key={product.id}>
                  <td className="px-4 py-3 font-medium text-[#2B2B2B]">{product.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#6E6E6E]">{product.slug}</td>
                  <td className="px-4 py-3 text-[#2B2B2B]">
                    {isProductCategorySlug(product.category)
                      ? PRODUCT_CATEGORY_LABELS[product.category]
                      : product.category}
                  </td>
                  <td className="px-4 py-3 text-[#2B2B2B]">{shopPriceLabelFromPaisa(product.pricePaisa)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-[#F0D3DA] ${
                        product.published ? "bg-emerald-50 text-emerald-800" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {product.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-cta hover:bg-[#FDF2F5]"
                        href={`/admin/products/${product.id}/edit`}
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} title={product.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
