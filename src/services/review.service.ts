import { reviews } from "@/data/reviews";
import type { Review } from "@/types/review";

export async function getAllReviews(): Promise<Review[]> {
  return reviews;
}

export async function getReviewsByTour(tourSlug: string): Promise<Review[]> {
  return reviews.filter((r) => r.tourSlug === tourSlug);
}

export async function getLatestReviews(limit: number = 6): Promise<Review[]> {
  return [...reviews]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, limit);
}
