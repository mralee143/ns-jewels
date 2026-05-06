"use client";

import Image from "next/image";
import { useState } from "react";

const TESTIMONIALS: ReadonlyArray<{ imageSrc: string; name: string; quote: string }> = [
  {
    imageSrc: "/reviews/review-1.png",
    name: "Areeba Khan",
    quote: "Bilkul same design mila. Quality bohat achi hai aur parcel time par receive ho gaya.",
  },
  {
    imageSrc: "/reviews/review-2.png",
    name: "Alina Amir",
    quote: "Chain aur ring dono bohat pyare hain. Daily use mein bhi color bilkul change nahi hua.",
  },
  {
    imageSrc: "/reviews/review-3.png",
    name: "Maryam Siddiqui",
    quote: "Packing safe thi aur jewelry real pictures jaisi nikli. InshaAllah dobara order karungi.",
  },
  {
    imageSrc: "/reviews/review-4.png",
    name: "Anosha Anaya",
    quote: "Reasonable price mein itni elegant jewelry milna mushkil hai. Highly recommended from me.",
  },
] as const;

export function CustomerTestimonialsSection() {
  const [selectedImage, setSelectedImage] = useState<null | { alt: string; src: string }>(null);

  const closePreview = () => setSelectedImage(null);

  return (
    <>
      <section className="relative overflow-hidden bg-[#FDF2F5] py-14 sm:py-16">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold tracking-[0.06em] text-[#2B2B2B] sm:text-4xl">
            Customer Testimonials
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#6E6E6E]">
            Real messages from our happy customers across Pakistan.
          </p>
          <div className="relative mt-10">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 hidden h-8 w-full -translate-y-4 sm:block"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1400 70"
          >
            <path d="M0 32C120 8 240 56 360 32C480 8 600 56 720 32C840 8 960 56 1080 32C1200 8 1320 56 1400 24" stroke="#C8C1C4" strokeWidth="2" />
          </svg>
            <div className="mt-2 flex w-full flex-wrap justify-center gap-5 pb-4 lg:flex-nowrap lg:gap-4">
            {TESTIMONIALS.map((item, index) => (
              <div
                key={item.name}
                style={{ animation: `testimonial-slide-in 650ms ease-out ${index * 130}ms both` }}
              >
                <article
                  className="group relative w-[260px] border border-[#EFCED7] bg-[#F9E3EA] p-4 shadow-[0_10px_18px_rgba(201,132,149,0.25)] transition-transform duration-300 hover:-translate-y-1 sm:w-[280px] lg:w-[220px] xl:w-[250px]"
                  style={{ transform: `rotate(${[-6, -2, 2, 5][index] ?? "0"}deg)` }}
                >
                <span className="pointer-events-none absolute left-1/2 top-0 z-10 h-8 w-8 -translate-x-1/2 -translate-y-6 rounded-full border border-[#A9ADB3] bg-white shadow-sm">
                  <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#8A919A]" />
                </span>
                <button
                  className="relative block h-56 w-full overflow-hidden bg-white text-left"
                  onClick={() => setSelectedImage({ alt: `${item.name} review photo`, src: item.imageSrc })}
                  type="button"
                >
                  <Image
                    alt={`${item.name} review photo`}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 280px, (max-width: 1280px) 220px, 250px"
                    src={item.imageSrc}
                  />
                </button>
                <p className="mt-3 text-[13px] font-semibold text-[#4A4345]">
                  {item.name}
                </p>
                <p className="mt-1 line-clamp-4 text-[11px] leading-relaxed text-[#77686D]">{item.quote}</p>
                </article>
              </div>
            ))}
            </div>
          </div>
          {selectedImage ? (
            <div
              aria-modal="true"
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4"
              onClick={closePreview}
              role="dialog"
            >
              <div
                className="w-full max-w-3xl rounded-2xl bg-white p-3"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex justify-end">
                  <button
                    aria-label="Close preview"
                    className="rounded-full border border-[#F0D3DA] px-3 py-1 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35"
                    onClick={closePreview}
                    type="button"
                  >
                    Close
                  </button>
                </div>
                <div className="relative mt-2 h-[70vh] w-full overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    alt={selectedImage.alt}
                    className="object-contain object-center"
                    fill
                    sizes="(max-width: 1024px) 100vw, 820px"
                    src={selectedImage.src}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <style jsx>{`
        @keyframes testimonial-slide-in {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
