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

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full max-w-[min(100%,560px)] overflow-hidden rounded-md bg-neutral-100">
              <Image
                alt={product.title}
                className="object-cover object-center"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                src={product.imageSrc}
              />
            </div>
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {product.additionalImages.map((img, index) => (
                  <div key={index} className="relative overflow-hidden rounded-md bg-white">
                    <Image
                      alt={`${product.title} view ${index + 2}`}
                      className="h-full w-full object-cover"
                      height={450}
                      src={img}
                      width={450}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:pt-4">
            <ProductPurchasePanel product={product} />
            <p className="mt-6 max-w-[420px] text-sm leading-7 text-black">{product.description}</p>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
