import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  description: "Terms of service for NS Jewels.",
  title: "Terms of service | NS Jewels",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 text-black">
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-2xl font-semibold tracking-wide">Terms of service</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          This page is a placeholder. Replace this copy with your store&apos;s legal terms and policies.
        </p>
        <Link className="mt-8 inline-block text-sm font-medium text-cta underline-offset-2 hover:underline" href="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
