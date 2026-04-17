"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setMessage("Authentication is not configured.");
      return;
    }

    const next = params.get("next") || "/account/trips";
    const errorDescription = params.get("error_description");
    if (errorDescription) {
      setMessage(errorDescription);
      return;
    }

    // Two link formats supported:
    //   A. PKCE flow: ?code=...   → exchangeCodeForSession
    //   B. Implicit flow: #access_token=...   → handled by detectSessionInUrl
    const code = params.get("code");
    const supabase = getSupabaseBrowser();

    (async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
      } else {
        // Give the SDK a moment to parse the URL hash, then check session
        await new Promise((r) => setTimeout(r, 150));
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setMessage("No session found. Try signing in again.");
          return;
        }
      }
      router.replace(next);
    })();
  }, [params, router]);

  return (
    <div className="text-center py-20">
      <div className="inline-block w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[14px] text-[var(--text-secondary)]">{message}</p>
    </div>
  );
}

export function CallbackHandler() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[var(--text-tertiary)]">Loading…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
