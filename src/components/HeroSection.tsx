"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FillImage } from "@/components/FillImage";
import {
  PRIMARY_HERO_BANNER_SRC,
  SECONDARY_HERO_BANNER_SRC,
} from "@/data/hero-banner";

const HERO_IMAGES = [PRIMARY_HERO_BANNER_SRC, SECONDARY_HERO_BANNER_SRC];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-background">
      <div className="relative flex w-full min-w-0 flex-col items-center justify-center">
        {/* Banner image */}
        <div className="page-entrance-hero-media relative aspect-[4/5] w-full min-w-0 overflow-hidden sm:aspect-[16/9] lg:aspect-[1525/528]">
          {HERO_IMAGES.map((src, index) => (
            <div className="absolute inset-0" key={src}>
              <FillImage
                alt={`NS Jewels Collection ${index + 1}`}
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                } max-md:object-[62%_center] md:object-center`}
                loading="eager"
                priority={index === 0}
                revealOnLoad={false}
                sizes="100vw"
                src={src}
              />
            </div>
          ))}
        </div>

        {/* Copy sits directly on the banner — no color wash; shadows keep type readable */}
        <div className="page-entrance-hero-copy absolute inset-0 flex flex-col justify-end px-8 pb-14 sm:px-14 sm:pb-16 md:justify-center md:pb-0 lg:px-28">
          <div className="max-w-md space-y-5 text-left sm:max-w-xl sm:space-y-6">
            <h1 className="hero-banner-heading font-display text-4xl font-semibold italic tracking-[0.12em] text-black sm:text-5xl md:text-6xl lg:text-7xl">
              Everyday{" "}
              <span className="hero-banner-luxury-white inline-block font-bold not-italic tracking-[0.14em] sm:text-[1.06em] lg:text-[1.1em]">
                Luxury
              </span>
            </h1>
            <p className="hero-banner-subtext text-sm font-medium leading-relaxed tracking-wide text-black sm:text-base md:text-lg">
              Bold, beautiful, and built to last. Premium stainless steel jewelry that is 100% waterproof, tarnish-free, and hypoallergenic. Wear it anywhere, anytime.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                className="inline-block rounded-full bg-cta px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-cta-hover hover:shadow-xl"
                href="/#products"
              >
                Shop Collection
              </Link>
              <Link
                className="inline-block rounded-full border-2 border-black bg-white/70 px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-black shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-[#F6C1CC]/35 hover:shadow-xl"
                href="/#contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
