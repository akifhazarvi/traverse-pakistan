import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient<Database>(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
