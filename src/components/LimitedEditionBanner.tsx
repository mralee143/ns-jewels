import Image from "next/image";
import Link from "next/link";

export function LimitedEditionBanner() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid w-full max-w-[1320px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#DDD6FE] lg:grid-cols-2">
        <div className="relative flex flex-col justify-center gap-5 bg-gradient-to-br from-[#FDF2F5] via-[#F6C1CC] to-[#FDF2F5] px-8 py-12 text-black sm:px-12 lg:py-16">
          <div className="relative">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-black">
              Limited drop
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[0.04em] sm:text-4xl">
              Exclusive finishes &amp; capsules you won&apos;t see everywhere.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-black">
              Small-batch silhouettes with jewel-tone polish — designed to pair with your everyday stack or stand beautifully on their own.
            </p>
            <Link
              className="mt-6 inline-flex w-fit items-center justify-center rounded-lg bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-md ring-1 ring-black/10 transition-colors duration-200 hover:bg-[#FDF2F5]"
              href="/products/sets"
            >
              Shop limited edition
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] min-h-[280px] lg:aspect-auto lg:min-h-[420px]">
          <Image
            alt="Limited edition NS Jewels piece"
            className="object-cover"
            fill
            priority={false}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src="/necklace/necklace-14.jpeg"
          />
        </div>
      </div>
    </section>
  );
}
