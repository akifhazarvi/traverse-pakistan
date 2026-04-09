import { hotels } from "@/data/hotels";
import type { Hotel } from "@/types/hotel";

export async function getAllHotels(): Promise<Hotel[]> {
  return hotels;
}

export async function getHotelsByDestination(
  destinationSlug: string
): Promise<Hotel[]> {
  return hotels.filter((h) => h.destinationSlug === destinationSlug);
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  return hotels.find((h) => h.slug === slug) ?? null;
}
