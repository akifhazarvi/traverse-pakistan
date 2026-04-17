"use client";

import { Container } from "@/components/ui/Container";
import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 4.9, suffix: "★", label: "Average Rating", isDecimal: true },
  { value: 1300, suffix: "+", label: "Happy Travelers", isDecimal: false },
  { value: 22, suffix: "+", label: "Tour Packages", isDecimal: false },
  { value: 15, suffix: "+", label: "Regions Covered", isDecimal: false },
  { value: 98, suffix: "%", label: "Would Recommend", isDecimal: false },
];

function AnimatedNumber({ value, suffix, isDecimal }: { value: number; suffix: string; isDecimal: boolean }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplay(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const formatted = isDecimal ? display.toFixed(1) : Math.round(display).toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}{suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="py-10 sm:py-12 bg-[var(--bg-primary)] border-b border-[var(--border-default)]">
      <Container>
        <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center min-w-[110px]"
            >
              <span className="text-[clamp(26px,3vw,32px)] font-extrabold text-[var(--primary)] leading-none tracking-[-0.02em]">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              </span>
              <span className="text-[12px] font-medium text-[var(--text-tertiary)] mt-2 whitespace-nowrap tracking-[0.02em]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
