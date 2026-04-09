import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TourCard } from "@/components/tours/TourCard";
import { AccordionItem } from "@/components/ui/Accordion";
import { formatPrice } from "@/lib/utils";
import {
  getDestinationBySlug,
  getAllDestinations,
  getFAQsByDestination,
} from "@/services/destination.service";
import { getToursByDestination } from "@/services/tour.service";

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
  if (!dest) return { title: "Destination Not Found" };
  return { title: dest.metaTitle, description: dest.metaDescription };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) notFound();

  const [tours, faqs] = await Promise.all([
    getToursByDestination(slug),
    getFAQsByDestination(slug),
  ]);

  return (
    <>
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
          <h1 className="text-[36px] sm:text-[48px] font-bold text-white tracking-tight">
            {dest.name}
          </h1>
          <p className="text-lg text-white/80 mt-2 max-w-xl">{dest.subtitle}</p>
          <div className="flex items-center gap-6 mt-4 text-[14px] text-white/70">
            <span>{dest.tourCount} tours available</span>
            <span>{dest.rating}★ rating</span>
            <span>From {formatPrice(dest.startingPrice)}</span>
          </div>
        </Container>
      </section>

      {/* Tours */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            title={`Tours in ${dest.name}`}
            subtitle={`${tours.length} tours to choose from`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} variant="grid" />
            ))}
          </div>
        </Container>
      </section>

      {/* Why Visit */}
      {dest.whyVisitCards.length > 0 && (
        <section className="bg-[var(--bg-subtle)] py-16 sm:py-20">
          <Container>
            <SectionHeader
              title={`Why Visit ${dest.name}`}
              center
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
              {dest.whyVisitCards.map((card) => (
                <div key={card.title} className="bg-[var(--bg-elevated)] rounded-xl p-6 text-center shadow-sm">
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="text-[16px] font-bold text-[var(--text-primary)] mt-3 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed">
                    {card.description}
                  </p>
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
                  <h3 className="text-[15px] font-bold text-[var(--text-primary)] mt-2 capitalize">
                    {s.season}
                  </h3>
                  <p className="text-[13px] text-[var(--text-tertiary)]">{s.months}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-[11px] font-bold uppercase rounded-full ${
                      s.badgeColor === "green"
                        ? "bg-emerald-100 text-emerald-700"
                        : s.badgeColor === "yellow"
                          ? "bg-amber-100 text-amber-700"
                          : s.badgeColor === "blue"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.badge}
                  </span>
                  <p className="text-[13px] text-[var(--text-tertiary)] mt-2 leading-relaxed">
                    {s.description}
                  </p>
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
            <SectionHeader
              title="Frequently Asked Questions"
              center
            />
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
