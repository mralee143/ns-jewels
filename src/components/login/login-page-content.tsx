"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { sanitizeCallbackUrl } from "@/lib/sanitize-callback-url";

type AuthMode = "forgotPassword" | "signin" | "signup";
type ForgotPasswordStep = "email" | "reset";

type LoginPageContentProps = {
  readonly defaultCallbackUrl?: string;
  readonly googleOAuthConfigured: boolean;
  readonly onRequestClose?: () => void;
  readonly onSignedIn?: () => void;
  readonly variant?: "fullscreen" | "modal" | "page";
};

function IconEnvelope(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 7h16v10H4V7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function IconGoogle() {
  return (
    <svg aria-hidden className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

type PasswordVisibilityButtonProps = {
  readonly controls: string;
  readonly isVisible: boolean;
  readonly labelPrefix?: string;
  readonly onToggle: () => void;
};

function PasswordVisibilityButton({
  controls,
  isVisible,
  labelPrefix = "password",
  onToggle,
}: PasswordVisibilityButtonProps) {
  const action = isVisible ? "Hide" : "Show";

  return (
    <button
      aria-controls={controls}
      aria-label={`${action} ${labelPrefix}`}
      className="shrink-0 rounded-full p-1.5 text-neutral-600 outline-none transition-colors hover:bg-neutral-200/80 hover:text-black focus-visible:ring-2 focus-visible:ring-neutral-400"
      onClick={onToggle}
      type="button"
    >
      {isVisible ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
    </button>
  );
}

const labelClass = "mb-2 block text-left text-sm font-medium text-neutral-800";

const inputInnerClass =
  "min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-neutral-500";

const inputShellClass =
  "flex items-center gap-2.5 rounded-full border border-neutral-300 bg-slate-100/90 px-4 py-3 transition-[color,box-shadow,border-color] focus-within:border-neutral-800 focus-within:ring-2 focus-within:ring-neutral-200";

const plainPillFieldClass =
  "w-full rounded-full border border-neutral-300 bg-slate-100/90 px-4 py-3 text-sm text-black outline-none transition placeholder:text-neutral-500 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-200";

function errorFromPayload(payload: unknown): string | null {
  return payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof (payload as { error: unknown }).error === "string"
    ? (payload as { error: string }).error
    : null;
}

export function LoginPageContent({
  defaultCallbackUrl,
  googleOAuthConfigured,
  onRequestClose,
  onSignedIn,
  variant = "page",
}: LoginPageContentProps) {
  const router = useRouter();
  const callbackUrl = sanitizeCallbackUrl(defaultCallbackUrl, "/");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("email");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const resetMessages = () => {
    setError(null);
    setInfoMessage(null);
  };

  const switchToSignIn = () => {
    setMode("signin");
    setForgotPasswordStep("email");
    resetMessages();
  };

  const switchToSignUp = () => {
    setMode("signup");
    resetMessages();
  };

  const switchToForgotPassword = () => {
    setMode("forgotPassword");
    setForgotPasswordStep("email");
    setResetOtp("");
    setResetPassword("");
    setResetConfirmPassword("");
    resetMessages();
  };

  const handleGoogle = async () => {
    resetMessages();
    setPending(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setPending(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailNorm = email.trim().toLowerCase();

    if (!emailNorm) {
      setError("Enter your email address.");
      return;
    }

    setPending(true);
    try {
      if (forgotPasswordStep === "email") {
        const response = await fetch("/api/auth/forgot-password", {
          body: JSON.stringify({ email: emailNorm }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          setError(errorFromPayload(payload) ?? "Could not send reset code.");
          return;
        }

        setForgotPasswordStep("reset");
        setInfoMessage("If an account exists for that email, a reset code has been sent.");
        return;
      }

      if (!/^\d{6}$/.test(resetOtp.trim())) {
        setError("Enter the 6-digit code from your email.");
        return;
      }

      if (resetPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (resetPassword !== resetConfirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const response = await fetch("/api/auth/reset-password", {
        body: JSON.stringify({
          confirmPassword: resetConfirmPassword,
          email: emailNorm,
          otp: resetOtp.trim(),
          password: resetPassword,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError(errorFromPayload(payload) ?? "Could not reset password.");
        return;
      }

      setMode("signin");
      setPassword("");
      setResetOtp("");
      setResetPassword("");
      setResetConfirmPassword("");
      setForgotPasswordStep("email");
      setInfoMessage("Password updated. Sign in with your new password.");
    } finally {
      setPending(false);
    }
  };

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (mode === "forgotPassword") {
      await handleForgotPassword();
      return;
    }

    if (mode === "signup") {
      if (displayName.trim().length < 2) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setPending(true);
    try {
      if (mode === "signup") {
        const registerResponse = await fetch("/api/auth/register", {
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            marketingOptIn,
            name: displayName.trim(),
            password,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const registerPayload: unknown = await registerResponse.json().catch(() => null);
        const registerMessage = errorFromPayload(registerPayload);

        if (!registerResponse.ok) {
          setError(
            registerMessage ??
              (registerResponse.status === 409
                ? "An account with this email already exists."
                : "Could not create your account. Try again."),
          );
          return;
        }

        const needsVerification =
          registerPayload !== null &&
          typeof registerPayload === "object" &&
          "needsVerification" in registerPayload &&
          (registerPayload as { needsVerification?: unknown }).needsVerification === true;

        if (needsVerification) {
          const signupEmail = email.trim().toLowerCase();
          sessionStorage.setItem(
            "nsj-pending-signup",
            JSON.stringify({
              callbackUrl,
              email: signupEmail,
              password,
            }),
          );
          const verifyParams = new URLSearchParams();
          verifyParams.set("email", signupEmail);
          verifyParams.set("callbackUrl", callbackUrl);
          onRequestClose?.();
          router.push(`/verify-email?${verifyParams.toString()}`);
          router.refresh();
          return;
        }
      }

      const result = await signIn("credentials", {
        callbackUrl,
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          mode === "signup"
            ? "Account created but sign-in failed. Try signing in manually."
            : "Could not sign you in. Check your email and password. If you just registered, verify your email first.",
        );
        return;
      }

      if (result?.ok) {
        onSignedIn?.();
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  };

  const isOverlay = variant === "fullscreen" || variant === "modal";
  const titleId = isOverlay ? "auth-modal-title" : undefined;
  const TitleTag = isOverlay ? "h2" : "h1";
  const shellPadding =
    variant === "fullscreen"
      ? "px-0 py-1 sm:py-2"
      : variant === "modal"
        ? "p-6 pt-14 sm:p-8 sm:pt-16"
        : "p-6 sm:p-8";
  const shellSurface =
    variant === "fullscreen"
      ? `mx-auto w-full max-w-[420px] ${shellPadding}`
      : `mx-auto w-full max-w-[420px] rounded-2xl border border-neutral-200/90 bg-white shadow-lg ${shellPadding}`;
  const heading =
    mode === "forgotPassword" ? "Reset password" : mode === "signup" ? "Create account" : "Sign in";
  const subheading =
    mode === "forgotPassword"
      ? forgotPasswordStep === "email"
        ? "Enter your email and we will send a reset code."
        : "Enter the OTP and choose your new password."
      : mode === "signup"
        ? "Join NS Jewels with email or Google."
        : "Sign in or create an account";
  const submitLabel =
    pending
      ? "Please wait..."
      : mode === "forgotPassword"
        ? forgotPasswordStep === "email"
          ? "Send reset code"
          : "Save new password"
        : mode === "signup"
          ? "Create account"
          : "Continue";

  return (
    <div className={shellSurface}>
      <div className="mb-8 flex justify-center">
        <Image
          alt="NS Jewels"
          className="h-9 w-auto sm:h-10"
          height={307}
          priority={isOverlay}
          src="/brand_logo.png"
          width={1024}
        />
      </div>

      <TitleTag className="text-left text-2xl font-bold tracking-tight text-black sm:text-[1.65rem]" id={titleId}>
        {heading}
      </TitleTag>
      <p className="mt-2 text-left text-sm leading-relaxed text-neutral-600">{subheading}</p>

      <p className="mt-3 text-left text-sm">
        {mode === "signin" ? (
          <button
            className="font-medium text-black underline decoration-neutral-400 underline-offset-[5px] transition hover:decoration-black"
            onClick={switchToSignUp}
            type="button"
          >
            Create an account
          </button>
        ) : (
          <button
            className="font-medium text-black underline decoration-neutral-400 underline-offset-[5px] transition hover:decoration-black"
            onClick={switchToSignIn}
            type="button"
          >
            Sign in instead
          </button>
        )}
      </p>

      {mode !== "forgotPassword" ? (
        <>
          <div className="mt-8">
            <button
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-cta py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pending || !googleOAuthConfigured}
              onClick={() => void handleGoogle()}
              type="button"
            >
              <IconGoogle />
              Continue with Google
            </button>
            {!googleOAuthConfigured ? (
              <p className="mt-2 text-center text-[0.7rem] leading-relaxed text-neutral-500">
                Add <span className="font-mono">AUTH_GOOGLE_ID</span> and{" "}
                <span className="font-mono">AUTH_GOOGLE_SECRET</span> to enable Google sign-in.
              </p>
            ) : null}
          </div>

          <div className="relative my-8">
            <div aria-hidden className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span
                className={`px-4 text-sm text-neutral-500 ${variant === "fullscreen" ? "bg-background" : "bg-white"}`}
              >
                or
              </span>
            </div>
          </div>
        </>
      ) : null}

      <form
        className={mode === "forgotPassword" ? "mt-8 space-y-4" : "space-y-4"}
        noValidate
        onSubmit={(event) => void handleCredentials(event)}
      >
        {mode === "signup" ? (
          <div>
            <label className={labelClass} htmlFor="signup-name">
              Full name
            </label>
            <input
              autoComplete="name"
              className={plainPillFieldClass}
              id="signup-name"
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your name"
              required
              type="text"
              value={displayName}
            />
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="auth-email">
            Email
          </label>
          <div className={inputShellClass}>
            <IconEnvelope className="h-5 w-5 shrink-0 text-neutral-500" />
            <input
              autoComplete="email"
              className={inputInnerClass}
              id="auth-email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
        </div>

        {mode !== "forgotPassword" ? (
          <div>
            <label className={labelClass} htmlFor="auth-password">
              Password
            </label>
            <div className={inputShellClass}>
              <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
              <input
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className={inputInnerClass}
                id="auth-password"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <PasswordVisibilityButton
                controls="auth-password"
                isVisible={showPassword}
                onToggle={() => setShowPassword((previous) => !previous)}
              />
            </div>
          </div>
        ) : null}

        {mode === "signin" ? (
          <div className="-mt-1 text-right">
            <button
              className="text-sm font-medium text-neutral-600 underline-offset-4 transition hover:text-black hover:underline"
              onClick={switchToForgotPassword}
              type="button"
            >
              Forgot password?
            </button>
          </div>
        ) : null}

        {mode === "forgotPassword" && forgotPasswordStep === "reset" ? (
          <>
            <div>
              <label className={labelClass} htmlFor="reset-otp">
                OTP code
              </label>
              <input
                autoComplete="one-time-code"
                className={plainPillFieldClass}
                id="reset-otp"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setResetOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                required
                type="text"
                value={resetOtp}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="reset-password">
                New password
              </label>
              <div className={inputShellClass}>
                <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
                <input
                  autoComplete="new-password"
                  className={inputInnerClass}
                  id="reset-password"
                  minLength={6}
                  onChange={(event) => setResetPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  type={showResetPassword ? "text" : "password"}
                  value={resetPassword}
                />
                <PasswordVisibilityButton
                  controls="reset-password"
                  isVisible={showResetPassword}
                  onToggle={() => setShowResetPassword((previous) => !previous)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="reset-confirm">
                Confirm password
              </label>
              <div className={inputShellClass}>
                <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
                <input
                  autoComplete="new-password"
                  className={inputInnerClass}
                  id="reset-confirm"
                  minLength={6}
                  onChange={(event) => setResetConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  required
                  type={showResetConfirmPassword ? "text" : "password"}
                  value={resetConfirmPassword}
                />
                <PasswordVisibilityButton
                  controls="reset-confirm"
                  isVisible={showResetConfirmPassword}
                  labelPrefix="confirm password"
                  onToggle={() => setShowResetConfirmPassword((previous) => !previous)}
                />
              </div>
            </div>
          </>
        ) : null}

        {mode === "signup" ? (
          <div>
            <label className={labelClass} htmlFor="auth-confirm">
              Confirm password
            </label>
            <div className={inputShellClass}>
              <IconLock className="h-5 w-5 shrink-0 text-neutral-500" />
              <input
                autoComplete="new-password"
                className={inputInnerClass}
                id="auth-confirm"
                minLength={6}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter password"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
              />
              <PasswordVisibilityButton
                controls="auth-confirm"
                isVisible={showConfirmPassword}
                labelPrefix="confirm password"
                onToggle={() => setShowConfirmPassword((previous) => !previous)}
              />
            </div>
          </div>
        ) : null}

        {infoMessage ? (
          <p className="rounded-xl bg-[#e8f8ef] px-3 py-2 text-sm text-[#1d6b45]" role="status">
            {infoMessage}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-[#FDE7EF] px-3 py-2 text-sm text-[#b84860]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-800 disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {submitLabel}
        </button>
      </form>

      {mode === "signup" ? (
        <>
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
            By continuing, you agree to our{" "}
            <Link className="font-medium text-black underline underline-offset-2 hover:no-underline" href="/terms">
              Terms of service
            </Link>
            .
          </p>
        </>
      ) : null}

      <p className="mt-5 text-center text-sm text-neutral-600">
        {onRequestClose ? (
          <button
            className="font-medium text-neutral-600 underline-offset-2 transition hover:text-black hover:underline"
            onClick={onRequestClose}
            type="button"
          >
            Continue shopping
          </button>
        ) : (
          <Link
            className="font-medium text-neutral-600 underline-offset-2 transition hover:text-black hover:underline"
            href="/products?page=1"
          >
            Continue shopping
          </Link>
        )}
      </p>
    </div>
  );
}
