import { getSupabaseAnon } from "@/lib/supabase/server";
import type { RegionRow } from "@/lib/supabase/types";
import type { Region } from "@/types/region";

function toRegion(row: RegionRow & { destinations: { slug: string }[] }): Region {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    heroImage: row.image_url ?? "",
    description: row.description ?? "",
    destinationSlugs: row.destinations.map((d) => d.slug),
    tourCount: 0,
    metaTitle: row.name,
    metaDescription: row.description ?? "",
  };
}

const REGION_QUERY = "*, destinations ( slug )";

export async function getAllRegions(): Promise<Region[]> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_QUERY)
    .order("name");

  if (error) throw new Error(`getAllRegions: ${error.message}`);
  return (data as unknown as (RegionRow & { destinations: { slug: string }[] })[]).map(toRegion);
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("regions")
    .select(REGION_QUERY)
    .eq("slug", slug)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`getRegionBySlug: ${error.message}`);
  return toRegion(data as unknown as RegionRow & { destinations: { slug: string }[] });
}
