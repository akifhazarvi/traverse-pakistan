import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "Trusted & Verified",
    description: "4.9★ across 1,300+ reviews. TripAdvisor Travelers' Choice 2025.",
    stat: "4.9★",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "24h Custom Itineraries",
    description: "Tell us your dream trip — custom itinerary delivered within 24 hours.",
    stat: "24h",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: "Full-Service Platform",
    description: "Tours, hotels, transport, flights — everything in one place.",
    stat: "1-stop",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Safe for Everyone",
    description: "Verified drivers, professional guides. Solo, female, family — everyone travels safe.",
    stat: "98%",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 sm:py-24 bg-[var(--bg-subtle)]">
      <Container>
        <SectionHeader
          title="Why Travel With Us"
          subtitle="What makes Traverse Pakistan different"
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group flex flex-col items-center text-center p-6 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-default)] hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)] transition-all duration-300"
            >
              {/* Icon circle with gradient */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              {/* Stat number */}
              <span className="text-[22px] font-extrabold text-[var(--primary)] tracking-tight tabular-nums">
                {step.stat}
              </span>

              <h3 className="text-[15px] font-bold text-[var(--text-primary)] mt-1 mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
