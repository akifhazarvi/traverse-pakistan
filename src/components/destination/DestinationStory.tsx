import { Container } from "@/components/ui/Container";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

interface DestinationStoryProps {
  name: string;
  opening: string;
  description: string;
}

export function DestinationStory({ name, opening, description }: DestinationStoryProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start max-w-[1040px] mx-auto">
          {/* Left rail — eyebrow + dotted rule, creates travelogue feel */}
          <div className="flex flex-col gap-3 lg:pt-2">
            <EyebrowLabel>About {name}</EyebrowLabel>
            <span
              aria-hidden="true"
              className="hidden lg:block w-16 h-px"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 0 6px, transparent 6px 12px)",
                backgroundSize: "12px 1px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>

          <div>
            <p
              className="italic font-medium text-[var(--text-primary)] tracking-[-0.01em] leading-[1.35]"
              style={{ fontSize: "var(--text-3xl)" }}
            >
              &ldquo;{opening}&rdquo;
            </p>
            <p className="mt-6 text-[var(--text-secondary)] leading-relaxed max-w-[640px]" style={{ fontSize: "var(--text-lg)" }}>
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
