import { regions } from "@/data/regions";
import type { Region } from "@/types/region";

export async function getAllRegions(): Promise<Region[]> {
  return regions;
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  return regions.find((r) => r.slug === slug) ?? null;
}
