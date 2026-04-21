import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Step {
  icon: IconName;
  title: string;
  description: string;
  stat: string;
  starAfterStat?: boolean;
}

const steps: Step[] = [
  {
    icon: "shield-check",
    title: "Trusted & Verified",
    description: "4.9 across 1,300+ reviews. TripAdvisor Travelers' Choice 2025.",
    stat: "4.9",
    starAfterStat: true,
  },
  {
    icon: "calendar-check",
    title: "24h Custom Itineraries",
    description: "Tell us your dream trip — custom itinerary delivered within 24 hours.",
    stat: "24h",
  },
  {
    icon: "compass",
    title: "Full-Service Platform",
    description: "Tours, hotels, transport, flights — everything in one place.",
    stat: "1-stop",
  },
  {
    icon: "users",
    title: "Safe for Everyone",
    description: "Verified drivers, professional guides. Solo, female, family — everyone travels safe.",
    stat: "98%",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 sm:py-24 bg-[var(--bg-primary)]">
      <Container>
        <SectionHeader
          title="Why Travel With Us"
          subtitle="Built in Islamabad, run by people who've walked every trail"
          center
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group flex flex-col items-center text-center p-6 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-default)] transition-[border-color,box-shadow,transform] duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
            >
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] flex items-center justify-center text-[var(--on-dark)] mb-4 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-default)] group-hover:scale-[1.08]"
              >
                <Icon name={step.icon} size="2xl" weight="regular" />
              </div>

              <span className="inline-flex items-baseline gap-1 text-[22px] font-extrabold text-[var(--primary)] tracking-tight tabular-nums">
                {step.stat}
                {step.starAfterStat && (
                  <Icon name="star" size="md" weight="fill" color="var(--primary-muted)" />
                )}
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
