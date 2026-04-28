"use client";

import { useState } from "react";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Icon } from "@/components/ui/Icon";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-center text-[14px] text-[var(--text-secondary)]">
        Authentication is not yet configured.
      </div>
    );
  }

  if (sent) {
    return (
      <div className="p-6 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-[var(--radius-md)] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
          <Icon name="envelope" size="lg" color="var(--primary)" />
        </div>
        <p className="text-[16px] font-bold text-[var(--primary-deep)]">Check your email</p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          We sent a password reset link to <span className="font-semibold">{email}</span>.
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Could not send reset link");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset link");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
          Email address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {error && (
        <p className="text-[13px] text-[var(--error)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={!email || submitting}
        className="w-full h-12 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/auth/sign-in"
        className="block text-center text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Back to sign in
      </Link>
    </form>
  );
}
