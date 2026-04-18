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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/?reason=forbidden");

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
  };
}
