import { Icon } from "@/components/ui/Icon";

export function AwardStrip() {
  return (
    <div className="bg-[var(--bg-dark)] text-[var(--on-dark)] text-center py-2 px-4">
      <p className="text-[12px] font-medium flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Icon name="shield-check" size="sm" color="var(--primary-muted)" />
          <span className="text-[var(--primary-muted)] font-semibold">TripAdvisor Travelers&apos; Choice 2025</span>
        </span>
        <span className="hidden sm:inline text-[var(--on-dark-tertiary)]">|</span>
        <span className="text-[var(--on-dark-secondary)] inline-flex items-center gap-1">
          Rated
          <span className="inline-flex items-center gap-0.5 text-[var(--on-dark)] font-semibold">
            4.9
            <Icon name="star" size="xs" weight="fill" color="var(--primary-muted)" />
          </span>
          across 1,300+ reviews
        </span>
      </p>
    </div>
  );
}
