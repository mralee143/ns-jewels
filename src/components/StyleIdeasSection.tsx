import Image from "next/image";
import Link from "next/link";

const PRODUCT_LIST: ReadonlyArray<{
  imageSrc: string;
  price: string;
  title: string;
}> = [
  {
    imageSrc: "/rings/WhatsApp Image 2026-04-22 at 7.00.10 AM (1).jpeg",
    price: "Rs. 599.00 PKR",
    title: "Emerald Grace Ring",
  },
  {
    imageSrc: "/bracelate/WhatsApp Image 2026-04-22 at 6.58.42 AM (1).jpeg",
    price: "Rs. 599.00 PKR",
    title: "Mesh Watch Bracelet",
  },
  {
    imageSrc: "/handchain/WhatsApp Image 2026-04-22 at 7.34.24 AM.jpeg",
    price: "Rs. 350.00 PKR",
    title: "HeartLock Ring",
  },
  {
    imageSrc: "/handcuffs/WhatsApp Image 2026-04-22 at 6.58.13 AM.jpeg",
    price: "Rs. 650.00 PKR",
    title: "Heart Drop Necklace",
  },
  {
    imageSrc: "/pandents/WhatsApp Image 2026-04-22 at 6.58.14 AM (1).jpeg",
    price: "Rs. 699.00 PKR",
    title: "Luna Crystal Pendant",
  },
  {
    imageSrc: "/sets/WhatsApp Image 2026-04-22 at 6.58.52 AM (1).jpeg",
    price: "Rs. 780.00 PKR",
    title: "Aurora Set",
  },
  {
    imageSrc: "/rings/WhatsApp Image 2026-04-22 at 7.00.08 AM.jpeg",
    price: "Rs. 490.00 PKR",
    title: "Vintage Ring Stack",
  },
  {
    imageSrc: "/pandents/WhatsApp Image 2026-04-22 at 6.58.33 AM.jpeg",
    price: "Rs. 610.00 PKR",
    title: "Pendant Glow",
  },
  {
    imageSrc: "/bracelate/WhatsApp Image 2026-04-22 at 6.58.38 AM.jpeg",
    price: "Rs. 520.00 PKR",
    title: "Classic Bracelet",
  },
  {
    imageSrc: "/handcuffs/WhatsApp Image 2026-04-22 at 6.58.28 AM (1).jpeg",
    price: "Rs. 540.00 PKR",
    title: "Velvet Handcuff Charm",
  },
  {
    imageSrc: "/sets/WhatsApp Image 2026-04-22 at 6.58.48 AM.jpeg",
    price: "Rs. 720.00 PKR",
    title: "Crystal Duo Set",
  },
  {
    imageSrc: "/pandents/WhatsApp Image 2026-04-22 at 6.58.43 AM (1).jpeg",
    price: "Rs. 590.00 PKR",
    title: "Twilight Pendant",
  },
] as const;

export function StyleIdeasSection() {
  return (
    <section className="mx-auto max-w-[1320px] pb-16 pt-4 sm:pb-20 sm:pt-6">
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">Product List</p>
        <h3 className="mt-2 font-display text-2xl font-semibold italic tracking-[0.08em] text-[#1c1917] sm:text-3xl">
          Shop By Category
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_LIST.map((product, index) => (
          <article
            className="product-card-3d group bg-white text-left"
            key={`${product.title}-${index}`}
          >
            <div className="relative overflow-hidden rounded-sm">
              <Image
                alt={product.title}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-60"
                height={330}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                src={product.imageSrc}
                width={320}
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#111827] px-3 py-1 text-[0.65rem] font-medium text-white">
                Sale
              </span>
            </div>
            <div className="pt-3">
              <h4 className="font-mono text-[1rem] font-medium text-[#1f2937]">{product.title}</h4>
              <p className="mt-1 text-sm font-medium text-[#374151]">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          className="rounded-full border border-[#1f2937] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f2937] transition-colors duration-200 hover:bg-[#1f2937] hover:text-white"
          href="/#products"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
