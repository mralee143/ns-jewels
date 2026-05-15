import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { AdminDesktopNavigation, AdminMobileNavigation } from "@/components/admin/admin-navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const label = session.user.email ?? session.user.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-[#FDF2F5] text-[#2B2B2B]">
      <aside className="hidden w-64 shrink-0 border-r border-[#F0D3DA] bg-white/95 px-5 py-6 shadow-[8px_0_30px_rgba(216,92,108,0.06)] md:flex md:flex-col">
        <Link aria-label="NS Jewels admin dashboard" className="block rounded-3xl bg-white p-2" href="/admin">
          <Image
            alt="NS JEWELS logo"
            className="h-auto w-full rounded-md"
            height={918}
            priority
            src="/brand-logo.png"
            width={3058}
          />
        </Link>
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.32em] text-[#6E6E6E]">
          Timeless Beauty
        </p>
        <AdminDesktopNavigation />
        <div className="mt-auto rounded-3xl border border-[#F0D3DA] bg-[#FDF2F5]/70 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cta ring-1 ring-[#F0D3DA]">
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="m12 3 7 7-7 11-7-11 7-7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
                <path d="M5 10h14M9 10l3 11 3-11M9 10l3-7 3 7" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-[#2B2B2B]">Admin Panel</p>
              <p className="text-xs text-[#6E6E6E]">Your store is active</p>
            </div>
          </div>
          <Link
            className="mt-4 flex items-center justify-center rounded-2xl border border-[#F0D3DA] bg-white px-4 py-2 text-sm font-semibold text-cta transition-colors hover:bg-[#FDF2F5]"
            href="/admin/settings"
          >
            Settings
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-[#F0D3DA] bg-white/85 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="relative min-w-0 flex-1 md:max-w-md">
              <span className="sr-only">Search admin panel</span>
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E6E]">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    d="m20 20-4.2-4.2M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              <input
                className="h-12 w-full rounded-2xl border border-[#F0D3DA] bg-white px-11 text-sm text-[#2B2B2B] outline-none transition focus:border-cta focus:ring-2 focus:ring-cta/20"
                placeholder="Search anything..."
                type="search"
              />
            </label>
            <div className="flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F0D3DA] bg-white text-[#2B2B2B]"
                type="button"
              >
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cta ring-2 ring-white" />
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6.5 10.5a5.5 5.5 0 0 1 11 0v3.6l1.5 2.4H5l1.5-2.4v-3.6ZM9.5 19a2.5 2.5 0 0 0 5 0"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3 rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]/70 px-3 py-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cta ring-1 ring-[#F0D3DA]">
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                  </svg>
                </span>
                <div className="hidden sm:block">
                  <p className="max-w-[180px] truncate text-sm font-semibold text-[#2B2B2B]">{label}</p>
                  <p className="text-xs text-[#6E6E6E]">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
          <AdminMobileNavigation />
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
