import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel } from "@/components/ui/Carousel";
import { reviews } from "@/data/reviews";

export function ReviewsCarousel() {
  return (
    <section className="relative bg-[var(--bg-dark)] py-20 sm:py-24 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl" />

      <Container wide className="relative">
        <SectionHeader
          title="What Travelers Say"
          subtitle="Real reviews from real adventurers"
          light
        />
        <Carousel>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group min-w-[330px] w-[330px] sm:min-w-[370px] sm:w-[370px] bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-[var(--radius-md)] p-6 flex flex-col hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating
                        ? "text-[var(--primary-muted)] text-[15px]"
                        : "text-white/15 text-[15px]"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-white/75 leading-[1.65] flex-1 line-clamp-5">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#1a4a42] flex items-center justify-center text-white text-[14px] font-bold shrink-0 ring-2 ring-white/10">
                  {review.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-white truncate">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    {review.tourName} &middot; {review.travelerType}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
