"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CreateQuoteRequestInput, QuoteRequestSummary } from "@/types/quote";

export async function createQuoteRequest(
  input: CreateQuoteRequestInput
): Promise<QuoteRequestSummary> {
  if (!isSupabaseConfigured) {
    throw new Error("Quote requests unavailable. Please use WhatsApp.");
  }

  const supabase = getSupabaseBrowser();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id ?? null;

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      user_id: userId,
      request_type: input.requestType,
      slug: input.slug ?? null,
      display_name: input.displayName,
      tier: input.tier ?? null,
      preferred_start_date: input.preferredStartDate ?? null,
      preferred_end_date: input.preferredEndDate ?? null,
      adults: input.adults,
      children: input.children,
      rooms: input.rooms,
      departure_city: input.departureCity ?? null,
      contact_name: input.contact.name,
      contact_email: input.contact.email,
      contact_phone: input.contact.phone,
      notes: input.notes ?? null,
    })
    .select("id, created_at")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id, createdAt: data.created_at };
}
