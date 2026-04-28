"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { Icon } from "@/components/ui/Icon";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 border border-[var(--border-default)] rounded-[var(--radius-md)] bg-[var(--bg-subtle)] text-center text-[14px] text-[var(--text-secondary)]">
        Authentication is not yet configured.
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6 bg-[var(--primary-light)] border border-[var(--primary)]/30 rounded-[var(--radius-md)] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
          <Icon name="check" size="lg" color="var(--primary)" />
        </div>
        <p className="text-[16px] font-bold text-[var(--primary-deep)]">Password updated</p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-block text-[13px] font-semibold text-[var(--primary)] hover:underline"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: err } = await getSupabaseBrowser().auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.push("/auth/sign-in"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full h-11 px-4 pr-11 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
          New password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eye-slash" : "eye"} size="md" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
          Confirm new password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            autoComplete="new-password"
            className={inputCls}
          />
        </div>
      </div>

      {error && (
        <p className="text-[13px] text-[var(--error)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={!password || !confirmPassword || submitting}
        className="w-full h-12 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-bold rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
