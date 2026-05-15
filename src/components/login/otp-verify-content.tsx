"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

type OtpVerifyContentProps = {
  readonly email: string;
};

function splitDigits(code: string): string[] {
  const chars = code.replace(/\D/g, "").slice(0, 6).split("");
  return [...chars, ...Array.from({ length: Math.max(0, 6 - chars.length) }, () => "")];
}

export function OtpVerifyContent({ email }: OtpVerifyContentProps) {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length: 6 }, () => ""));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const code = useMemo(() => digits.join(""), [digits]);

  const focusIndex = useCallback((index: number) => {
    const bounded = Math.min(5, Math.max(0, index));
    const input = inputsRef.current[bounded];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, raw: string) => {
      setError(null);
      const cleaned = raw.replace(/\D/g, "");
      if (cleaned.length === 0) {
        setDigits((previous) => {
          const next = [...previous];
          next[index] = "";
          return next;
        });
        return;
      }
      if (cleaned.length >= 6) {
        const spread = splitDigits(cleaned);
        setDigits(spread);
        focusIndex(5);
        return;
      }
      setDigits((previous) => {
        const next = [...previous];
        next[index] = cleaned.slice(-1);
        return next;
      });
      focusIndex(index + 1);
    },
    [focusIndex],
  );

  const handleKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        focusIndex(index - 1);
        return;
      }
      if (event.key === "ArrowRight" && index < 5) {
        event.preventDefault();
        focusIndex(index + 1);
        return;
      }
      if (event.key !== "Backspace") {
        return;
      }
      event.preventDefault();
      if (digits[index] !== "") {
        setDigits((previous) => {
          const next = [...previous];
          next[index] = "";
          return next;
        });
        return;
      }
      if (index === 0) {
        return;
      }
      setDigits((previous) => {
        const next = [...previous];
        next[index - 1] = "";
        return next;
      });
      focusIndex(index - 1);
    },
    [digits, focusIndex],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      const text = event.clipboardData.getData("text");
      const spread = splitDigits(text);
      const hasDigit = spread.some((digit) => digit !== "");
      if (!hasDigit) {
        return;
      }
      event.preventDefault();
      setError(null);
      setDigits(spread);
      const firstEmpty = spread.findIndex((digit) => digit === "");
      focusIndex(firstEmpty === -1 ? 5 : firstEmpty);
    },
    [focusIndex],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (code.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/auth/email-otp/verify", {
        body: JSON.stringify({ code, email }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data: unknown = await response.json().catch(() => null);
      const message =
        typeof data === "object" &&
        data !== null &&
        typeof (data as { error?: unknown }).error === "string"
          ? (data as { error: string }).error
          : "Something went wrong.";
      if (!response.ok) {
        setError(message);
        return;
      }
      router.push("/login/register");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-8 flex justify-center">
        <Image alt="NS JEWELS" className="h-9 w-auto rounded-md sm:h-10" height={918} src="/brand-logo.png" width={3058} />
      </div>

      <h1 className="text-left text-2xl font-bold tracking-tight text-black sm:text-[1.65rem]">
        Enter verification code
      </h1>
      <p className="mt-2 text-left text-sm leading-relaxed text-neutral-600">
        We sent a 6-digit code to <span className="font-medium text-black">{email}</span>. Enter it below to continue.
      </p>

      <form className="mt-8 space-y-6" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <fieldset>
          <legend className="sr-only">Six-digit verification code</legend>
          <div className="flex justify-between gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                aria-label={`Digit ${index + 1} of 6`}
                className="w-full rounded-xl border border-neutral-300 bg-slate-100/90 py-3 text-center text-lg font-semibold tracking-widest text-black outline-none transition focus:border-neutral-800 focus:ring-2 focus:ring-neutral-200 sm:text-xl"
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={(element) => {
                  inputsRef.current[index] = element;
                }}
                type="text"
                value={digit}
              />
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="rounded-xl bg-[#FDE7EF] px-3 py-2 text-sm text-[#b84860]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-full bg-cta py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending || code.length !== 6}
          type="submit"
        >
          {pending ? "Verifying…" : "Continue"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Wrong email?{" "}
        <Link className="font-medium text-black underline-offset-2 hover:underline" href="/login">
          Start over
        </Link>
      </p>

      <p className="mt-5 text-center text-xs leading-relaxed text-neutral-500">
        Code expires in 10 minutes. In local development, your terminal prints the code (configure email delivery for
        production).
      </p>
    </div>
  );
}
