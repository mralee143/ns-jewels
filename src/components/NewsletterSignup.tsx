"use client";

import { FormEvent, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-black">Newsletter</p>
      <p className="mt-1 text-xs leading-relaxed text-black">
        New drops, styling notes, and member-only previews — no spam.
      </p>
      {submitted ? (
        <p className="mt-3 text-xs font-medium text-black" role="status">
          Thanks — you&apos;re on the list.
        </p>
      ) : (
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="footer-newsletter-email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="min-h-11 w-full min-w-0 flex-1 rounded-lg border border-[#DDD6FE] bg-white px-3 py-2 text-sm text-black outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-black/45 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/40"
            enterKeyHint="send"
            id="footer-newsletter-email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
          <button
            className="min-h-11 shrink-0 rounded-lg bg-cta px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-cta-hover"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
