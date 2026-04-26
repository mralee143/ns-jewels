import Image from "next/image";
import Link from "next/link";

const HERO_EYEBROW = "UNIQUE STAINLESS JEWELRY";
const HERO_LEDE =
  "Discover handcrafted stainless pieces designed to stay brilliant, resist tarnish, and elevate your daily style.";
const HERO_TITLE = "Bold Shine. Everyday Strength.";
const HERO_TAGLINE = "Water-safe, skin-friendly, and made to last with modern luxury.";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[min(92vh,880px)] w-full items-center justify-center overflow-hidden bg-[#e8e0d4]"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          alt="Gold necklaces with gemstones arranged in a circle on a cream ceramic tray"
          className="hero-image-float object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="/hero-flatlay.png"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fdfbf8]/55 via-[#2c2419]/10 to-[#1c1917]/35"
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-28">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[#a68b5b] sm:text-sm">
          {HERO_EYEBROW}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#292524] sm:text-[0.9375rem]">
          {HERO_LEDE}
        </p>
        <h1
          className="font-display mt-8 text-4xl font-semibold leading-tight tracking-tight text-[#1c1917] sm:text-5xl md:text-6xl"
          id="hero-heading"
        >
          {HERO_TITLE}
        </h1>
        <p className="mt-4 font-sans text-sm italic text-[#44403c] sm:text-base">
          {HERO_TAGLINE}
        </p>
        <Link
          className="mt-10 inline-flex border border-[#d6d3d1] bg-[#fdfbf8] px-10 py-3.5 text-sm font-medium tracking-wide text-[#1c1917] transition-colors duration-200 hover:bg-white"
          href="/#products"
        >
          Shop Collection
        </Link>
      </div>
    </section>
  );
}
