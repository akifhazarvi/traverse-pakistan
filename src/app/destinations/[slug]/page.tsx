import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TourCard } from "@/components/tours/TourCard";
import { PackageCard } from "@/components/packages/PackageCard";
import { AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  destinationSchema,
  faqPageSchema,
  breadcrumbSchema,
  combineSchemas,
} from "@/lib/seo/schema";
import { formatPrice } from "@/lib/utils";
import {
  getDestinationBySlug,
  getAllDestinations,
  getFAQsByDestination,
} from "@/services/destination.service";
import { getToursByDestination } from "@/services/tour.service";
import { getPackagesByDestination } from "@/services/package.service";
import { getHotelsByDestination } from "@/services/hotel.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dests = await getAllDestinations();
  return dests.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) {
    return buildMetadata({
      title: "Destination Not Found",
      path: `/destinations/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: dest.metaTitle,
    description: dest.metaDescription,
    path: `/destinations/${dest.slug}`,
    image: dest.heroImage,
    imageAlt: `${dest.name} — ${dest.subtitle}`,
    tags: [dest.name, dest.regionSlug, "Pakistan tourism"],
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const [tours, faqs, pkgs, hotels] = await Promise.all([
    getToursByDestination(slug),
    getFAQsByDestination(slug),
    getPackagesByDestination(slug),
    getHotelsByDestination(slug),
  ]);

  const schema = combineSchemas(
    destinationSchema(dest),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Destinations", url: "/destinations" },
      { name: dest.name, url: `/destinations/${dest.slug}` },
    ]),
    faqs.length > 0 ? faqPageSchema(faqs) : null
  );

  return (
    <>
      <JsonLd data={schema} id={`destination-${dest.slug}-jsonld`} />
      {/* Hero */}
      <section className="relative h-[400px] sm:h-[480px] flex items-end">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <Container className="relative pb-10 sm:pb-14">
          <Breadcrumb
            items={[
              { label: "Destinations", href: "/destinations" },
              { label: dest.name },
            ]}
            light
            className="mb-4"
          />
          <h1 className="text-[36px] sm:text-[48px] font-bold text-[var(--on-dark)] tracking-tight">
            {dest.name}
          </h1>
          <p className="text-lg text-[var(--on-dark-secondary)] mt-2 max-w-xl">{dest.subtitle}</p>
          <div className="flex items-center gap-6 mt-4 text-[14px] text-[var(--on-dark-secondary)]">
            <span>{dest.tourCount} tours available</span>
            <span>{dest.rating}★ rating</span>
            <span>From {formatPrice(dest.startingPrice)}</span>
          </div>
        </Container>
      </section>

      {/* Packages */}
      {pkgs.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeader
              title={`Packages in ${dest.name}`}
              subtitle={`${pkgs.length} flexible package${pkgs.length !== 1 ? "s" : ""} — your dates, your tier`}
              linkText="View all packages"
              linkHref="/packages"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pkgs.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} variant="grid" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Tours */}
      {tours.length > 0 && (
        <section className={`py-16 sm:py-20 ${pkgs.length > 0 ? "bg-[var(--bg-subtle)]" : ""}`}>
          <Container>
            <SectionHeader
              title={`Group Tours in ${dest.name}`}
              subtitle={`${tours.length} tour${tours.length !== 1 ? "s" : ""} to choose from`}
              linkText="View all group tours"
              linkHref="/grouptours"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} variant="grid" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Hotels */}
      {hotels.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeader
              title={`Where to Stay in ${dest.name}`}
              subtitle={`${hotels.length} hotel${hotels.length !== 1 ? "s" : ""} & properties`}
              linkText="View all hotels"
              linkHref="/hotels"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.slug}`}
                  className="group rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-primary)] transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] bg-[var(--primary)] text-[var(--on-dark)] rounded-[var(--radius-full)]">
                        {hotel.tier === "luxury" ? "LUXURY" : hotel.tier === "premium" ? "PREMIUM" : hotel.tier === "standard" ? "CAMP" : "DELUXE"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                        {hotel.propertyType}
                      </span>
                      <span className="flex items-center gap-1 text-[13px]">
                        <span className="text-[var(--primary-muted)]">★</span>
                        <span className="font-semibold text-[var(--text-primary)]">{hotel.rating}</span>
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-[12px] text-[var(--text-tertiary)] mt-1">{hotel.location}</p>
                    <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
                      <span className="text-[17px] font-bold text-[var(--text-primary)] tabular-nums">
                        {formatPrice(hotel.pricePerNight)}
                      </span>
                      <span className="text-[12px] text-[var(--text-tertiary)]"> / night</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why Visit */}
      {dest.whyVisitCards.length > 0 && (
        <section className="bg-[var(--bg-subtle)] py-16 sm:py-20">
          <Container>
            <SectionHeader title={`Why Visit ${dest.name}`} center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
              {dest.whyVisitCards.map((card) => (
                <div key={card.title} className="bg-[var(--bg-elevated)] rounded-xl p-6 text-center shadow-sm">
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="text-[16px] font-bold text-[var(--text-primary)] mt-3 mb-2">{card.title}</h3>
                  <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Seasons */}
      {dest.seasons.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <SectionHeader title="Best Time to Visit" center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1000px] mx-auto">
              {dest.seasons.map((s) => (
                <div key={s.season} className="border border-[var(--border-default)] rounded-xl p-5 text-center">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="text-[15px] font-bold text-[var(--text-primary)] mt-2 capitalize">{s.season}</h3>
                  <p className="text-[13px] text-[var(--text-tertiary)]">{s.months}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-[11px] font-bold uppercase rounded-full ${
                    s.badgeColor === "green" ? "bg-[var(--primary-light)] text-[var(--primary-deep)]"
                    : s.badgeColor === "yellow" ? "bg-[var(--accent-warm-light)] text-[var(--accent-warm)]"
                    : s.badgeColor === "blue" ? "bg-[var(--bg-subtle)] text-[var(--info)]"
                    : "bg-[var(--bg-subtle)] text-[var(--error)]"
                  }`}>
                    {s.badge}
                  </span>
                  <p className="text-[13px] text-[var(--text-tertiary)] mt-2 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-[var(--bg-subtle)] py-16 sm:py-20">
          <Container>
            <SectionHeader title="Frequently Asked Questions" center />
            <div className="max-w-[800px] mx-auto bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] overflow-hidden">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.question} className="px-6">
                  {faq.answer}
                </AccordionItem>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
