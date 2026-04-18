"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/guard";
import type { QuoteRequestStatus } from "@/lib/supabase/types";

const VALID_STATUSES: QuoteRequestStatus[] = [
  "new",
  "contacted",
  "quoted",
  "converted",
  "closed",
];

export async function updateQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();

  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status" };
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("quote_requests")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/quote-requests");
  revalidatePath("/admin");
  return { ok: true };
}
