"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

type EmailRegisterContentProps = {
  readonly email: string;
};

function IconEye(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" fill="none" r="3" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

function IconEyeOff(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M10.7 5.1A10.5 10.5 0 0 1 12 5c6 0 10 7 10 7a21 21 0 0 1-3.3 4M9.9 9.9a3 3 0 1 0 4.2 4.2m-.5-8 8 8M3 3l18 18M12 19c-6 0-10-7-10-7a21 21 0 0 1 4.3-5.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 11V8a4 4 0 0 0-8 0v3" strokeLinecap="round" strokeLinejoin="round" />
      <rect height="11" rx="2" width="14" x="5" y="11" />
    </svg>
  );
}

const labelClass = "mb-2 block text-left text-sm font-medium text-neutral-800";

const inputInnerClass =
  "min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-neutral-500";

const inputShellClass =
  "flex items-center gap-2.5 rounded-full border border-neutral-300 bg-slate-100/90 px-4 py-3 transition-[color,box-shadow,border-color] focus-within:border-neutral-800 focus-within:ring-2 focus-within:ring-neutral-200";

const plainPillFieldClass =
  "w-full rounded-full border border-neutral-300 bg-slate-100/90 px-4 py-3 text-sm text-black outline-none transition placeholder:text-neutral-500 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-200";

export function EmailRegisterContent({ email }: EmailRegisterContentProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (displayName.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setPending(true);
    try {
      const registerResponse = await fetch("/api/auth/email-otp/register", {
        body: JSON.stringify({
          marketingOptIn,
          name: displayName.trim(),
          password,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload: unknown = await registerResponse.json().catch(() => null);
      const registerMessage =
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error: string }).error
          : "Could not complete registration.";

      if (!registerResponse.ok) {
        setError(registerMessage);
        return;
      }

      const registeredEmail =
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { email?: unknown }).email === "string"
          ? (payload as { email: string }).email
          : email;

      const registeredName =
        typeof payload === "object" &&
        payload !== null &&
        typeof (payload as { name?: unknown }).name === "string"
          ? (payload as { name: string }).name
          : displayName.trim();

      const signInResult = await signIn("credentials", {
        callbackUrl: "/",
        email: registeredEmail,
        name: registeredName,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account saved but sign-in failed. Try signing in again.");
        return;
      }

      if (signInResult?.ok) {
        router.push("/");
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-8 flex justify-center">
        <Image alt="NS Jewels" className="h-9 w-auto sm:h-10" height={307} src="/brand_logo.png" width={1024} />
      </div>

      <h1 className="text-left text-2xl font-bold tracking-tight text-black sm:text-[1.65rem]">
        Create your account
      </h1>
      <p className="mt-2 text-left text-sm leading-relaxed text-neutral-600">
        Email verified: <span className="font-medium text-black">{email}</span>. Choose a password to finish.
      </p>

      <form className="mt-8 space-y-4" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <div>
          <label className={labelClass} htmlFor="register-name">
            Full name
          </label>
          <input
            autoComplete="name"
            className={plainPillFieldClass}
            id="register-name"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            required
            type="text"
            value={displayName}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="register-password">
            Password
          </label>
          <div className={inputShellClass}>
            <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
            <input
              autoComplete="new-password"
              className={inputInnerClass}
              id="register-password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-controls="register-password"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="shrink-0 rounded-full p-1.5 text-neutral-600 outline-none transition-colors hover:bg-neutral-200/80 hover:text-black focus-visible:ring-2 focus-visible:ring-neutral-400"
              onClick={() => setShowPassword((previous) => !previous)}
              type="button"
            >
              {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="register-confirm">
            Confirm password
          </label>
          <div className={inputShellClass}>
            <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
            <input
              autoComplete="new-password"
              className={inputInnerClass}
              id="register-confirm"
              minLength={6}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter password"
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
            />
            <button
              aria-controls="register-confirm"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="shrink-0 rounded-full p-1.5 text-neutral-600 outline-none transition-colors hover:bg-neutral-200/80 hover:text-black focus-visible:ring-2 focus-visible:ring-neutral-400"
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              type="button"
            >
              {showConfirmPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-[#FDE7EF] px-3 py-2 text-sm text-[#b84860]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Creating account…" : "Register"}
        </button>
      </form>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
        <input
          checked={marketingOptIn}
          className="mt-0.5 size-4 shrink-0 rounded border-neutral-400 text-black accent-black focus:ring-neutral-400"
          onChange={(event) => setMarketingOptIn(event.target.checked)}
          type="checkbox"
        />
        <span>Email me with news and offers</span>
      </label>

      <p className="mt-6 text-center text-xs leading-relaxed text-neutral-500">
        By registering, you agree to our{" "}
        <Link className="font-medium text-black underline underline-offset-2 hover:no-underline" href="/terms">
          Terms of service
        </Link>
        .
      </p>
    </div>
  );
}
