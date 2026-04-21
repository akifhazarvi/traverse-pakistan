import { cache } from "react";
import { hotels } from "@/data/hotels";
import type { Hotel } from "@/types/hotel";

export const getAllHotels = cache(async (): Promise<Hotel[]> => {
  return hotels;
});

export const getHotelsByDestination = cache(
  async (destinationSlug: string): Promise<Hotel[]> => {
    return hotels.filter((h) => h.destinationSlug === destinationSlug);
  }
);

export const getHotelBySlug = cache(async (slug: string): Promise<Hotel | null> => {
  return hotels.find((h) => h.slug === slug) ?? null;
});

export const getFeaturedHotels = cache(async (limit: number = 6): Promise<Hotel[]> => {
  return hotels.slice(0, limit);
});
