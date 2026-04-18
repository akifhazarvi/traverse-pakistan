import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { PopularToursCarousel } from "@/components/home/PopularToursCarousel";
import { TravelStylesGrid } from "@/components/home/TravelStylesGrid";
import { FeaturedPackagesCarousel } from "@/components/home/FeaturedPackagesCarousel";
import { DestinationsScroll } from "@/components/home/DestinationsScroll";
import { FeaturedHotels } from "@/components/home/FeaturedHotels";
import { BlogGrid } from "@/components/home/BlogGrid";
import { VideoStories } from "@/components/home/VideoStories";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title:
    "Pakistan Tours & Holiday Packages — 4.9★ Rated Tour Operator | Traverse Pakistan",
  description:
    "Book Pakistan group tours, custom trips, and hotels with the highest-rated tour operator. 22 tours across Hunza, Skardu, Chitral, K2 BC. 4.9★ from 1,300+ travelers.",
  path: "/",
  tags: [
    "Pakistan tours",
    "Hunza tour package",
    "Skardu tour package",
    "Pakistan travel agency",
    "Gilgit-Baltistan tours",
  ],
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedPackagesCarousel />
      <PopularToursCarousel />
      <FeaturedHotels />
      <DestinationsScroll />
      <TravelStylesGrid />
      <BlogGrid />
      <VideoStories />
      <WhyUsSection />
      <ReviewsCarousel />
    </>
  );
}
