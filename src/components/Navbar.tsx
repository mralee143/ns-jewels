"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  productCategoryHref,
} from "@/data/product-categories";
import { resolveSearchToCategorySlug } from "@/lib/resolve-search-to-category-slug";

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = PRODUCT_CATEGORY_SLUGS.map(
  (slug) => ({
    href: productCategoryHref(slug),
    label: PRODUCT_CATEGORY_LABELS[slug],
  })
);

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const trimmedSearchValue = useMemo(() => searchValue.trim(), [searchValue]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedSearchValue) {
      return;
    }

    const categorySlug = resolveSearchToCategorySlug(trimmedSearchValue);
    if (categorySlug) {
      router.push(productCategoryHref(categorySlug));
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedSearchValue)}`);
    }
    setIsSearchOpen(false);
    setSearchValue("");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#f3e8ff] bg-[#faf5ff]">
      <div className="relative mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-6 lg:px-8 lg:py-4">
        {/* Mobile Menu Button - First on Mobile */}
        <button
          aria-label="Open menu"
          aria-controls="mobile-nav-menu"
          aria-expanded={isMobileMenuOpen}
          className="flex items-center rounded-md text-[#581c87] outline-none transition-colors duration-200 [-webkit-tap-highlight-color:transparent] hover:text-[#7e22ce] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b4fe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf5ff] lg:hidden"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16v2H4V7Zm0 4h16v2H4v-2Zm0 4h16v2H4v-2Z" />
            </svg>
          )}
          <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:inline">
            {isMobileMenuOpen ? "Close" : "Menu"}
          </span>
        </button>

        {/* Logo — home; closes overlays on click */}
        <Link
          className="absolute left-1/2 z-10 shrink-0 -translate-x-1/2 transition-opacity duration-200 lg:static lg:z-auto lg:translate-x-0"
          href="/"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsSearchOpen(false);
          }}
        >
          <Image
            alt="NS Jewels logo"
            className="h-auto w-[110px] scale-125 mix-blend-multiply transition-transform duration-300 hover:scale-135 sm:w-[130px] lg:w-[170px]"
            height={300}
            priority
            src="/brand_logo.png"
            width={600}
          />
        </Link>

        {/* Desktop Navigation — centered between logo and actions */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden min-w-0 -translate-x-1/2 lg:static lg:flex lg:translate-x-0 lg:flex-1 lg:justify-center"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#581c87] sm:gap-x-3.5 xl:gap-x-4 xl:text-[0.75rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link className="transition-colors duration-200 hover:text-[#7e22ce]" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions — search opens full-width row below (same on mobile and desktop) */}
        <div className="z-10 flex shrink-0 items-center gap-3 text-[#581c87] sm:gap-5 lg:ml-0">
          {isSearchOpen ? (
              <button
                aria-label="Close search"
                className="flex items-center justify-center rounded-md p-1.5 text-xl leading-none text-[#581c87] transition-colors duration-200 hover:bg-[#f3e8ff] hover:text-[#7e22ce]"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchValue("");
                }}
                type="button"
              >
                ×
              </button>
            ) : (
              <button
                aria-label="Open search"
                className="flex items-center gap-2 font-black text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 2a5.5 5.5 0 1 0 3.7 9.6l3.6 3.6 1.4-1.4-3.6-3.6A5.5 5.5 0 0 0 10.5 5Z" />
                </svg>
                <span className="hidden text-xs font-black uppercase tracking-[0.14em] xl:inline">Search</span>
              </button>
            )}
            {!isSearchOpen ? (
              <>
                <button aria-label="Login" className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]" type="button">
                  <svg className="h-6 w-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </button>
                <button aria-label="Shopping bag" className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]" type="button">
                  <svg className="h-6 w-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </button>
              </>
            ) : null}
        </div>
      </div>

      {isSearchOpen ? (
        <div className="border-t border-[#f3e8ff] bg-[#faf5ff] px-4 py-3 sm:px-8 lg:px-10">
          <form
            className="mx-auto flex max-w-[1320px] items-center gap-2"
            onSubmit={handleSearchSubmit}
          >
            <input
              aria-label="Search products"
              autoFocus
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-[#f3e8ff] bg-white px-3 py-2.5 text-sm font-medium text-[#1c1917] shadow-none outline-none [-webkit-appearance:none] [appearance:none] placeholder:text-[#78716c] focus:border-[#d8b4fe] focus:ring-2 focus:ring-[#d8b4fe]/20"
              enterKeyHint="search"
              inputMode="search"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search products…"
              type="text"
              value={searchValue}
            />
            <button
              className="shrink-0 rounded-lg bg-[#581c87] px-3 py-2.5 text-xs font-black uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#7e22ce]"
              type="submit"
            >
              Go
            </button>
          </form>
        </div>
      ) : null}
      {isMobileMenuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-[#f3e8ff] bg-[#faf5ff] lg:hidden"
          id="mobile-nav-menu"
        >
          <ul className="mx-auto flex w-full max-w-[1320px] flex-col px-5 py-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className="block border-b border-[#f3e8ff] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]"
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
