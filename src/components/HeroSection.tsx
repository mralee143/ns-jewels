"use client";

import Link from "next/link";

import { FillImage } from "@/components/FillImage";
import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "/hero-section/hero-image-1.jpeg",
  "/hero-section/hero-image-2.jpeg",
  "/hero-section/hero-image-3.jpeg",
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-[#fdfbf8] pt-1 sm:pt-2">
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* Banner Image Container */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[1525/528]">
          {HERO_IMAGES.map((src, index) => (
            <FillImage
              key={src}
              alt={`NS Jewels Collection ${index + 1}`}
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              } object-[70%_center] md:object-center`}
              priority={index === 0}
              sizes="100vw"
              src={src}
            />
          ))}
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/40 md:to-transparent" />
        </div>

        {/* Overlay Content - Left Aligned */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-14 sm:px-14 sm:pb-16 md:justify-center md:pb-0 lg:px-28">
          <div className="max-w-md space-y-5 text-left sm:max-w-xl sm:space-y-6">
            <h1 className="font-display text-4xl font-semibold italic tracking-[0.12em] text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
              Everyday Luxury
            </h1>
            <p className="text-sm font-medium leading-relaxed tracking-wide text-white drop-shadow sm:text-base md:text-lg">
              Bold, beautiful, and built to last. Premium stainless steel jewelry that is 100% waterproof, tarnish-free, and hypoallergenic. Wear it anywhere, anytime.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                className="inline-block rounded-full bg-white px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#1c1917] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#fdfbf8] hover:shadow-xl"
                href="/#products"
              >
                Shop Collection
              </Link>
              <Link
                className="inline-block rounded-full border-2 border-white bg-white/5 px-9 py-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-xl"
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
