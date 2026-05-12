"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { LoginPageContent } from "@/components/login/login-page-content";

type AuthModalContextValue = {
  readonly openLogin: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

type AuthModalProviderProps = {
  readonly children: ReactNode;
  readonly googleOAuthConfigured: boolean;
};

export function AuthModalProvider({ children, googleOAuthConfigured }: AuthModalProviderProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const openLogin = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AuthModalContext.Provider value={{ openLogin }}>
      {children}
      {open ? (
        <div
          aria-labelledby="auth-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex min-h-dvh flex-col bg-background text-black"
          role="dialog"
          tabIndex={-1}
        >
          <header className="flex shrink-0 justify-end px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
            <button
              aria-label="Close"
              className="flex h-11 min-w-11 items-center justify-center rounded-full text-2xl leading-none text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
              onClick={close}
              type="button"
            >
              ×
            </button>
          </header>
          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-4 sm:py-10">
              <LoginPageContent
                defaultCallbackUrl="/"
                googleOAuthConfigured={googleOAuthConfigured}
                onRequestClose={close}
                onSignedIn={close}
                variant="fullscreen"
              />
            </div>
          </div>
        </div>
      ) : null}
    </AuthModalContext.Provider>
  );
}
