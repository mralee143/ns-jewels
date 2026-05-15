"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { sanitizeCallbackUrl } from "@/lib/sanitize-callback-url";

const OTP_LENGTH = 6;
const OTP_PATTERN = /^\d{6}$/;
const PENDING_SIGNUP_KEY = "nsj-pending-signup";

type PendingSignup = {
  callbackUrl: string;
  email: string;
  password: string;
};

function readPendingSignup(): PendingSignup | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PendingSignup>;
    if (
      typeof parsed.email === "string" &&
      typeof parsed.password === "string" &&
      typeof parsed.callbackUrl === "string"
    ) {
      return {
        callbackUrl: parsed.callbackUrl,
        email: parsed.email,
        password: parsed.password,
      };
    }
    return null;
  } catch {
    return null;
  }
}

type VerifyEmailFormProps = {
  readonly defaultCallbackUrl?: string;
  readonly defaultEmail?: string;
  readonly showTerminalOtpHint?: boolean;
};

function IconMailSparkle(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M4.5 7.5h10.75a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m3 8.75 6.75 4.75 6.75-4.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.75 4.25v3.5M18 6h3.5M20.75 12v2.5M19.5 13.25H22" strokeLinecap="round" />
    </svg>
  );
}

export function VerifyEmailForm({
  defaultCallbackUrl,
  defaultEmail,
  showTerminalOtpHint = false,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);
  const callbackUrl = sanitizeCallbackUrl(defaultCallbackUrl, "/");
  const [email] = useState(() => {
    if (typeof window === "undefined") {
      return defaultEmail ?? "";
    }
    const pendingSignup = readPendingSignup();
    return defaultEmail ?? pendingSignup?.email ?? "";
  });
  const [otp, setOtp] = useState("");
  const [passwordOverride, setPasswordOverride] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const pendingSignup = readPendingSignup();
    const effective = (defaultEmail ?? pendingSignup?.email ?? "").trim().toLowerCase();
    if (pendingSignup && pendingSignup.email === effective) {
      return pendingSignup.password;
    }
    return "";
  });
  const [showResendPassword, setShowResendPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);

  const emailNorm = email.trim().toLowerCase();

  const pendingForEmail = useMemo(() => {
    const pending = readPendingSignup();
    return pending && pending.email === emailNorm ? pending : null;
  }, [emailNorm]);

  const hasStoredPassword = Boolean(pendingForEmail?.password && pendingForEmail.password.length >= 6);
  const otpDigits = Array.from({ length: OTP_LENGTH }, (_, index) => otp[index] ?? "");

  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  const resolvePassword = (): string => {
    const typed = passwordOverride.trim();
    if (typed.length >= 6) {
      return typed;
    }
    if (pendingForEmail?.password && pendingForEmail.email === emailNorm) {
      return pendingForEmail.password;
    }
    return typed;
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfoMessage(null);
    const password = resolvePassword();

    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      setError("Missing email. Open this page from the sign-up link or sign up again.");
      return;
    }

    if (!OTP_PATTERN.test(otp.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }

    if (password.length < 6) {
      setError("Password required — use the same browser where you signed up, or add password below for resend.");
      setShowResendPassword(true);
      return;
    }

    setPending(true);
    try {
      const verifyResponse = await fetch("/api/auth/verify-signup", {
        body: JSON.stringify({ email: emailNorm, otp: otp.trim() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const verifyPayload: unknown = await verifyResponse.json().catch(() => null);
      const verifyMessage =
        verifyPayload &&
        typeof verifyPayload === "object" &&
        "error" in verifyPayload &&
        typeof (verifyPayload as { error: unknown }).error === "string"
          ? (verifyPayload as { error: string }).error
          : null;

      if (!verifyResponse.ok) {
        setError(verifyMessage ?? "Could not verify this code.");
        return;
      }

      const result = await signIn("credentials", {
        callbackUrl,
        email: emailNorm,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Verified, but sign-in failed. Try signing in from the login page.");
        return;
      }

      if (result?.ok) {
        sessionStorage.removeItem(PENDING_SIGNUP_KEY);
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfoMessage(null);
    const password = resolvePassword();

    if (!emailNorm || password.length < 6) {
      setError("Enter your account password below to resend the code.");
      setShowResendPassword(true);
      return;
    }

    setResendPending(true);
    try {
      const res = await fetch("/api/auth/resend-signup-otp", {
        body: JSON.stringify({ email: emailNorm, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload: unknown = await res.json().catch(() => null);
      const message =
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof (payload as { error: unknown }).error === "string"
          ? (payload as { error: string }).error
          : null;

      if (!res.ok) {
        setError(message ?? "Could not resend the code.");
        return;
      }
      setError(null);
      setInfoMessage("New code sent.");
    } finally {
      setResendPending(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/95 p-5 shadow-[0_30px_90px_rgba(216,92,108,0.18)] ring-1 ring-[#F0D3DA] sm:p-7">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#F6C1CC]/60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-20 h-60 w-60 rounded-full bg-[#FDF2F5] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#E8A9A9] to-transparent"
      />

      <div className="relative rounded-[1.85rem] border border-[#F0D3DA] bg-gradient-to-b from-white to-[#FDF2F5]/80 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#F0D3DA] bg-white p-2 shadow-sm">
            <Image
              alt="NS Jewels"
              className="h-auto w-12"
              height={400}
              priority
              src="/brand_logo.png"
              width={603}
            />
          </div>
          <div className="rounded-full border border-[#F0D3DA] bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cta shadow-sm">
            Secure code
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.26em] text-cta">
          Email verification
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#2B2B2B] sm:text-4xl">
          Check your inbox
        </h1>
        <p className="mt-3 max-w-[390px] text-sm leading-6 text-[#6E6E6E]">
          {emailNorm ? (
            <>
              We sent a one-time sign-up code to{" "}
              <span className="font-semibold text-[#2B2B2B]">{emailNorm}</span>.
            </>
          ) : (
            "Check your email for the code we sent to finish creating your account."
          )}
        </p>

        {showTerminalOtpHint ? (
          <p className="mt-5 rounded-2xl border border-[#F0D3DA] bg-white/75 px-4 py-3 text-sm text-[#6E6E6E]">
            Dev: code also appears in the terminal running the app.
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[#F0D3DA] bg-white/85 p-3 text-left shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDF2F5] text-cta">
            <IconMailSparkle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2B2B2B]">Enter the 6-digit code</p>
            <p className="mt-0.5 text-xs text-[#6E6E6E]">It expires in 15 minutes.</p>
          </div>
        </div>

        <form className="mt-6 space-y-5" noValidate onSubmit={(event) => void handleVerify(event)}>
          <div>
            <label className="sr-only" htmlFor="verify-otp">
              6-digit verification code
            </label>
            <div className="relative rounded-[1.6rem] border border-[#F0D3DA] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus-within:border-cta focus-within:ring-4 focus-within:ring-[#F6C1CC]/35">
              <input
                aria-label="6-digit verification code"
                autoComplete="one-time-code"
                className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
                id="verify-otp"
                inputMode="numeric"
                maxLength={OTP_LENGTH}
                name="otp"
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
                placeholder="000000"
                ref={otpRef}
                required
                type="text"
                value={otp}
              />
              <div aria-hidden className="grid grid-cols-6 gap-1.5 sm:gap-3">
                {otpDigits.map((digit, index) => (
                  <span
                    className={`flex h-12 items-center justify-center rounded-xl border text-center font-mono text-xl font-semibold shadow-sm transition sm:h-16 sm:rounded-2xl sm:text-3xl ${
                      digit
                        ? "border-[#E8A9A9] bg-[#FFF8FA] text-[#2B2B2B]"
                        : "border-[#F0D3DA] bg-[#FDF2F5]/80 text-[#F6C1CC]"
                    }`}
                    key={`otp-digit-${index}`}
                  >
                    {digit || <span className="h-2 w-2 rounded-full bg-[#F6C1CC]" />}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {(showResendPassword || !hasStoredPassword) && (
            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6E6E6E]"
                htmlFor="verify-password"
              >
                Account password
              </label>
              <input
                autoComplete="current-password"
                className="w-full rounded-full border border-[#F0D3DA] bg-white px-4 py-3 text-sm text-[#2B2B2B] outline-none transition placeholder:text-[#6E6E6E] focus:border-cta focus:ring-4 focus:ring-[#F6C1CC]/35"
                id="verify-password"
                minLength={6}
                onChange={(event) => setPasswordOverride(event.target.value)}
                placeholder="Only needed if this browser did not store it"
                type="password"
                value={passwordOverride}
              />
            </div>
          )}

          {infoMessage ? (
            <p
              className="rounded-2xl border border-[#bce5ca] bg-[#e8f8ef] px-4 py-3 text-center text-sm text-[#1d6b45]"
              role="status"
            >
              {infoMessage}
            </p>
          ) : null}

          {error ? (
            <p
              className="rounded-2xl border border-[#F6C1CC] bg-[#FDE7EF] px-4 py-3 text-center text-sm text-[#b84860]"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-full bg-gradient-to-r from-cta to-[#F6C1CC] py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_32px_rgba(233,106,122,0.28)] transition duration-200 hover:shadow-[0_18px_36px_rgba(216,92,108,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? "Verifying…" : "Verify and continue"}
          </button>
        </form>

        <div className="mt-6 rounded-[1.35rem] border border-[#F0D3DA] bg-white/70 p-4 text-center text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6E6E6E]">Didn&apos;t receive it?</p>
          <button
            className="mt-2 font-semibold text-cta underline-offset-4 transition hover:text-cta-hover hover:underline disabled:opacity-50"
            disabled={resendPending}
            onClick={() => void handleResend()}
            type="button"
          >
            {resendPending ? "Sending…" : "Resend code"}
          </button>
          <Link className="mt-3 block text-[#6E6E6E] transition hover:text-[#2B2B2B]" href="/login">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
