import { packages } from "@/data/packages";
import { packageItineraries } from "@/data/package-itineraries";
import type { Package } from "@/types/package";

export async function getAllPackages(): Promise<Package[]> {
  return packages;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  return packages.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedPackages(limit = 5): Promise<Package[]> {
  return packages.slice(0, limit);
}

export async function getPackageItinerary(slug: string) {
  return packageItineraries.find((i) => i.packageSlug === slug) ?? null;
}
