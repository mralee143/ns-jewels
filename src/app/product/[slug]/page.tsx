import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { ProductCrossCategoryRecommendations } from "@/components/product/ProductCrossCategoryRecommendations";
import { ProductImageViewer } from "@/components/product/ProductImageViewer";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { getCrossCategoryRecommendations } from "@/lib/get-cross-category-recommendations";
import { buildLegacyCatalogProducts, getProductBySlug } from "@/lib/get-product-by-slug";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return buildLegacyCatalogProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found | NS Jewels" };
  }
  return {
    description: product.description,
    title: `${product.title} | NS Jewels`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const crossCategoryPicks = await getCrossCategoryRecommendations(product, 4);

  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-black">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="text-black transition-colors duration-200 hover:text-neutral-800" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-black/45">
              /
            </li>
            <li>
              <Link
                className="text-black transition-colors duration-200 hover:text-neutral-800"
                href={`/products/${product.category}`}
              >
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </li>
            <li aria-hidden="true" className="text-black/45">
              /
            </li>
            <li className="font-medium text-black">{product.title}</li>
          </ol>
        </nav>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="flex w-full flex-col gap-4 lg:max-w-none">
            <ProductImageViewer product={product} />
          </div>
          <div className="lg:pt-2">
            <ProductPurchasePanel product={product} />
          </div>
        </section>

        <ProductCrossCategoryRecommendations products={crossCategoryPicks} />
      </main>
      <FooterSection />
    </div>
  );
}
