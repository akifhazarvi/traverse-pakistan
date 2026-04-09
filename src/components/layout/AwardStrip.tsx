export function AwardStrip() {
  return (
    <div className="bg-[var(--bg-dark)] text-white text-center py-2 px-4">
      <p className="text-[12px] font-medium flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary-muted)" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
          <span className="text-[var(--primary-muted)] font-semibold">TripAdvisor Travelers&apos; Choice 2025</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="text-white/60">
          Rated <span className="text-white font-semibold">4.9★</span> across 1,300+ reviews
        </span>
      </p>
    </div>
  );
}
