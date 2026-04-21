"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function getCallbackUrl(redirectTo: string) {
  if (typeof window === "undefined") return redirectTo;
  const base = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  const target = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
  return `${base}/auth/callback?next=${encodeURIComponent(target)}`;
}

function SignInInner() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") || "/account/trips";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(search.get("error"));

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-center text-[14px] text-[var(--text-secondary)]">
        Authentication is not yet configured. Please message us on WhatsApp to book.
      </div>
    );
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: err } = await getSupabaseBrowser().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getCallbackUrl(redirectTo) },
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link");
    } finally {
      setSubmitting(false);
    }
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

  if (sent) {
    return (
      <div className="p-6 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-[var(--radius-md)] text-center space-y-2">
        <p className="text-[16px] font-bold text-[var(--primary-deep)]">Check your email</p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          We sent a sign-in link to <span className="font-semibold">{email}</span>. Open it on this device.
        </p>
        <button
          type="button"
          onClick={() => { setSent(false); setEmail(""); }}
          className="text-[12px] text-[var(--primary)] hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="w-full h-12 flex items-center justify-center gap-3 border border-[var(--border-default)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-subtle)] transition-colors text-[14px] font-semibold text-[var(--text-primary)] cursor-pointer disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border-default)]" />
        <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">or</span>
        <div className="flex-1 h-px bg-[var(--border-default)]" />
      </div>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-12 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
        />

        <button
          type="submit"
          disabled={!email || submitting}
          className="w-full h-12 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {error && (
        <p className="text-[13px] text-[var(--error)] text-center">{error}</p>
      )}

      <p className="text-[11px] text-[var(--text-tertiary)] text-center">
        We&apos;ll email you a secure link — no account? We&apos;ll create one.
      </p>

      <button type="button" onClick={() => router.back()} className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] block mx-auto">
        ← Go back
      </button>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center text-[var(--text-tertiary)]">Loading…</div>}>
      <SignInInner />
    </Suspense>
  );
}
