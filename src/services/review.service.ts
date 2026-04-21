import { cache } from "react";
import { reviews } from "@/data/reviews";
import type { Review } from "@/types/review";

export const getAllReviews = cache(async (): Promise<Review[]> => {
  return reviews;
});

export const getReviewsByTour = cache(async (tourSlug: string): Promise<Review[]> => {
  return reviews.filter((r) => r.tourSlug === tourSlug);
});

export const getLatestReviews = cache(async (limit: number = 6): Promise<Review[]> => {
  return [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
});
