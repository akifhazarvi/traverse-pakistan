import "server-only";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminSession = {
  userId: string;
  email: string | null;
  fullName: string | null;
};

export async function requireAdmin(): Promise<AdminSession> {
  if (!isSupabaseConfigured) redirect("/auth/sign-in?reason=admin");

  const supabase = await getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/auth/sign-in?redirect=/admin");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[admin-guard] profile query failed", {
      userId: user.id,
      email: user.email,
      error: error.message,
      code: error.code,
      details: error.details,
    });
  } else {
    console.log("[admin-guard] profile loaded", {
      userId: user.id,
      email: user.email,
      hasProfile: profile !== null,
      isAdmin: profile?.is_admin ?? null,
    });
  }

  if (!profile?.is_admin) redirect("/?reason=forbidden");

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
  };
}
