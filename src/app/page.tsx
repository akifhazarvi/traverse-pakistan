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
