"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Icon } from "@/components/ui/Icon";

export type AuthMode = "sign-in" | "sign-up";

interface Props {
  defaultMode?: AuthMode;
}

function getCallbackUrl(redirectTo: string) {
  if (typeof window === "undefined") return redirectTo;
  const base = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  const target = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
  return `${base}/auth/callback?next=${encodeURIComponent(target)}`;
}

const inputCls =
  "w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors";

const labelCls =
  "block text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5";

function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 flex items-center justify-center gap-3 border border-[var(--border-default)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-subtle)] transition-colors text-[14px] font-semibold text-[var(--text-primary)] cursor-pointer disabled:opacity-50"
    >
      {/* Google brand SVG — not an app icon, kept inline per brand requirements */}
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continue with Google
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[var(--border-default)]" />
      <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">or</span>
      <div className="flex-1 h-px bg-[var(--border-default)]" />
    </div>
  );
}

function PasswordInput({
  value, onChange, placeholder, autoComplete, show, onToggle,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputCls + " pr-11"}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
        aria-label={show ? "Hide password" : "Show password"}
      >
        <Icon name={show ? "eye-slash" : "eye"} size="md" />
      </button>
    </div>
  );
}

function SignInInner({ defaultMode = "sign-in" }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") || "/account/trips";

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(search.get("error"));
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-center text-[14px] text-[var(--text-secondary)]">
        Authentication is not yet configured. Please message us on WhatsApp to book.
      </div>
    );
  }

  if (awaitingConfirmation) {
    return (
      <div className="p-6 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-[var(--radius-md)] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
          <Icon name="envelope" size="lg" color="var(--primary)" />
        </div>
        <p className="text-[16px] font-bold text-[var(--primary-deep)]">Check your email</p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it to activate your account.
        </p>
        <button
          type="button"
          onClick={() => { setAwaitingConfirmation(false); setMode("sign-in"); setPassword(""); setConfirmPassword(""); }}
          className="text-[12px] text-[var(--primary)] hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  async function handleGoogle() {
    setError(null);
    try {
      const { error: err } = await getSupabaseBrowser().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getCallbackUrl(redirectTo) },
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "sign-up") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);
    const supabase = getSupabaseBrowser();

    try {
      if (mode === "sign-in") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push(redirectTo);
        router.refresh();
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: getCallbackUrl(redirectTo),
          },
        });
        if (err) throw err;
        if (data.session) {
          // Email confirmation disabled — signed in immediately
          router.push(redirectTo);
          router.refresh();
        } else {
          setAwaitingConfirmation(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isValid =
    mode === "sign-in"
      ? !!(email && password)
      : !!(name.trim() && email && password && confirmPassword);

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex rounded-[var(--radius-sm)] border border-[var(--border-default)] overflow-hidden">
        {(["sign-in", "sign-up"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); }}
            className={[
              "flex-1 h-10 text-[13px] font-semibold transition-colors cursor-pointer",
              mode === m
                ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]",
            ].join(" ")}
          >
            {m === "sign-in" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <GoogleButton onClick={handleGoogle} disabled={submitting} />

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "sign-up" && (
          <div>
            <label className={labelCls}>Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Khan"
              autoComplete="name"
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Password
            </label>
            {mode === "sign-in" && (
              <Link href="/auth/forgot-password" className="text-[12px] text-[var(--primary)] hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder={mode === "sign-up" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
        </div>

        {mode === "sign-up" && (
          <div>
            <label className={labelCls}>Confirm password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat your password"
              autoComplete="new-password"
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          </div>
        )}

        {error && (
          <p className="text-[13px] text-[var(--error)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full h-12 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting
            ? mode === "sign-in" ? "Signing in…" : "Creating account…"
            : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

export function SignInForm({ defaultMode = "sign-in" }: Props) {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center text-[var(--text-tertiary)]">Loading…</div>}>
      <SignInInner defaultMode={defaultMode} />
    </Suspense>
  );
}
