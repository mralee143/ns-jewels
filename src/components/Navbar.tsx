"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/#rings", label: "Rings" },
  { href: "/#bracelet", label: "Bracelet" },
  { href: "/#handcuffs-handchain", label: "Handcuffs & Handchain" },
  { href: "/#studs-sets", label: "Studs & Sets" },
  { href: "/#contact", label: "Contact" },
] as const;

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

    router.push(`/?q=${encodeURIComponent(trimmedSearchValue)}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#ebe4d9] bg-[#fdfbf8]">
      <div className="relative mx-auto flex w-full max-w-[1320px] items-center gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <Link
          className="shrink-0 font-display text-[2.05rem] font-black tracking-[0.16em] text-[#a68b5b] sm:text-[2.2rem]"
          href="/"
        >
          NS
          <span className="ml-1.5 text-[0.62em] font-black tracking-[0.34em] text-[#a68b5b]">JEWELS</span>
        </Link>
        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#292524] xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link className="transition-colors duration-200 hover:text-[#1c1917]" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4 text-[#292524] sm:gap-5">
          <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
            {isSearchOpen ? (
              <input
                aria-label="Search products"
                className="w-32 border border-[#d6d3d1] bg-white px-3 py-1.5 text-xs tracking-[0.08em] text-[#1c1917] outline-none ring-0 placeholder:text-[#78716c] focus:border-[#a68b5b] sm:w-40"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search..."
                type="search"
                value={searchValue}
              />
            ) : null}
            <button
              aria-label="Search"
              className="flex items-center gap-2 transition-colors duration-200 hover:text-[#1c1917]"
              onClick={() => setIsSearchOpen((isOpen) => !isOpen)}
              type={isSearchOpen ? "submit" : "button"}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 2a5.5 5.5 0 1 0 3.7 9.6l3.6 3.6 1.4-1.4-3.6-3.6A5.5 5.5 0 0 0 10.5 5Z" />
              </svg>
              <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:inline">
                {isSearchOpen ? "Go" : "Search"}
              </span>
            </button>
          </form>
          <button
            aria-label="Login"
            className="transition-colors duration-200 hover:text-[#1c1917]"
            type="button"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 11c4.1 0 7.5 2.8 8.3 6.5.1.3-.2.5-.5.5H4.2c-.3 0-.6-.2-.5-.5.8-3.7 4.2-6.5 8.3-6.5Z" />
            </svg>
          </button>
          <button
            aria-label="Shopping bag"
            className="transition-colors duration-200 hover:text-[#1c1917]"
            type="button"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 20a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm11 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 4h1.8l1.6 8.4c.1.4.4.6.8.6h8.9c.4 0 .7-.2.8-.6l1.3-5.4H7.1l-.3-2H20c.6 0 1 .6.8 1.2l-1.8 7.4A2 2 0 0 1 17 15H7.2a2 2 0 0 1-2-1.6L3.2 5H3V4Z" />
            </svg>
          </button>
          <button
            aria-label="Open menu"
            aria-controls="mobile-nav-menu"
            aria-expanded={isMobileMenuOpen}
            className="flex items-center gap-2 transition-colors duration-200 hover:text-[#1c1917] lg:hidden"
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
        </div>
      </div>
      {isMobileMenuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-[#ebe4d9] bg-[#fdfbf8] lg:hidden"
          id="mobile-nav-menu"
        >
          <ul className="mx-auto flex w-full max-w-[1320px] flex-col px-5 py-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className="block border-b border-[#f1ede6] py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#292524] transition-colors duration-200 hover:text-[#1c1917]"
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
