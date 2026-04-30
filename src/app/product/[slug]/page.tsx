import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { getAllCatalogProducts, getProductBySlug } from "@/lib/get-product-by-slug";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return getAllCatalogProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#57534e]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#a8a29e]">
              /
            </li>
            <li>
              <Link
                className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]"
                href={`/products/${product.category}`}
              >
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#a8a29e]">
              /
            </li>
            <li className="font-medium text-[#1c1917]">{product.title}</li>
          </ol>
        </nav>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative overflow-hidden rounded-md bg-white">
            <Image
              alt={product.title}
              className="h-full w-full object-cover"
              height={900}
              priority
              src={product.imageSrc}
              width={900}
            />
          </div>
          <div className="lg:pt-4">
            <ProductPurchasePanel product={product} />
            <p className="mt-6 max-w-[420px] text-sm leading-7 text-[#57534e]">{product.description}</p>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
