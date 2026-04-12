import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel } from "@/components/ui/Carousel";
import { PackageCard } from "@/components/packages/PackageCard";
import { getFeaturedPackages } from "@/services/package.service";

export async function FeaturedPackagesCarousel() {
  const packages = await getFeaturedPackages();

  return (
    <section className="relative bg-[var(--bg-dark)] py-20 sm:py-24 overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
      />

      <Container wide className="relative">
        <SectionHeader
          title="Design Your Dream Journey"
          subtitle="Your dates. Your tier. Deluxe comfort or Luxury indulgence — with hand-picked hotels that change as you upgrade."
          linkText="View all packages"
          linkHref="/packages"
          light
        />
        <Carousel>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} variant="carousel" />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
