import { cache } from "react";
import { getSupabaseAnon } from "@/lib/supabase/server";
import type { DestinationRow, RegionRow } from "@/lib/supabase/types";
import type { Destination } from "@/types/destination";
import type { FAQ } from "@/types/faq";

type DestinationWithRegion = DestinationRow & {
  regions: Pick<RegionRow, "slug" | "name"> | null;
};

function toDestination(row: DestinationWithRegion): Destination {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    regionSlug: row.regions?.slug ?? "",
    heroImage: row.hero_image ?? "",
    elevation: row.elevation ?? undefined,
    tourCount: 0,
    startingPrice: row.starting_price ?? 0,
    rating: row.rating ?? 0,
    whyVisitCards: (row.why_visit_cards ?? []) as Destination["whyVisitCards"],
    seasons: (row.seasons ?? []).map(({ icon: _icon, ...s }) => s) as Destination["seasons"],
    metaTitle: row.meta_title ?? row.name,
    metaDescription: row.meta_description ?? row.description ?? "",
  };
}

const DESTINATION_QUERY = "*, regions ( slug, name )";

export const getAllDestinations = cache(async (): Promise<Destination[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("destinations")
    .select(DESTINATION_QUERY)
    .order("name");

  if (error) throw new Error(`getAllDestinations: ${error.message}`);
  return (data as unknown as DestinationWithRegion[]).map(toDestination);
});

export const getDestinationBySlug = cache(
  async (slug: string): Promise<Destination | null> => {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase
      .from("destinations")
      .select(DESTINATION_QUERY)
      .eq("slug", slug)
      .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw new Error(`getDestinationBySlug: ${error.message}`);
    return toDestination(data as unknown as DestinationWithRegion);
  }
);

export const getDestinationsByRegion = cache(
  async (regionSlug: string): Promise<Destination[]> => {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase
      .from("destinations")
      .select(DESTINATION_QUERY)
      .order("name");

    if (error) throw new Error(`getDestinationsByRegion: ${error.message}`);
    return (data as unknown as DestinationWithRegion[])
      .filter((d) => d.regions?.slug === regionSlug)
      .map(toDestination);
  }
);

export const getFAQsByDestination = cache(
  async (destinationSlug: string): Promise<FAQ[]> => {
    const supabase = getSupabaseAnon();

    const { data: dest } = await supabase
      .from("destinations")
      .select("id")
      .eq("slug", destinationSlug)
      .single();

    if (!dest) return [];

    const { data, error } = await supabase
      .from("destination_faqs")
      .select("question, answer")
      .eq("destination_id", dest.id)
      .order("sort_order");

    if (error) throw new Error(`getFAQsByDestination: ${error.message}`);
    return (data ?? []).map((row) => ({ question: row.question, answer: row.answer }));
  }
);
