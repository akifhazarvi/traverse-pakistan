import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

function safeNext(next: string | null): string {
  if (!next) return "/account/trips";
  // Prevent open redirects — only allow same-origin absolute paths
  if (!next.startsWith("/") || next.startsWith("//")) return "/account/trips";
  return next;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorDescription = url.searchParams.get("error_description");
  const next = safeNext(url.searchParams.get("next"));

  if (errorDescription) {
    const redirect = new URL("/auth/sign-in", url.origin);
    redirect.searchParams.set("error", errorDescription);
    return NextResponse.redirect(redirect);
  }

  if (!isSupabaseConfigured || !code) {
    return NextResponse.redirect(new URL("/auth/sign-in", url.origin));
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirect = new URL("/auth/sign-in", url.origin);
    redirect.searchParams.set("error", error.message);
    return NextResponse.redirect(redirect);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
