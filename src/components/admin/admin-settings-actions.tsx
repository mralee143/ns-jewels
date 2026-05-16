"use client";

import Link from "next/link";

import { signOutToHome } from "@/lib/sign-out-client";

export function AdminSettingsActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        className="inline-flex items-center justify-center rounded-2xl border border-[#F0D3DA] bg-white px-5 py-3 text-sm font-semibold text-[#2B2B2B] transition-colors hover:bg-[#FDF2F5]"
        href="/"
      >
        <svg aria-hidden="true" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <path d="m4 11 8-7 8 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M6.5 10.5V20h11v-9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
        Home
      </Link>
      <button
        className="inline-flex items-center justify-center rounded-2xl bg-cta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
        onClick={signOutToHome}
        type="button"
      >
        <svg aria-hidden="true" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <path d="M10 6H6v12h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M13 8l4 4-4 4M17 12H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
        Logout
      </button>
    </div>
  );
}
