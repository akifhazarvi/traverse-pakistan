"use client";

interface WizardProgressProps {
  step: number;
  totalSteps: number;
  labels: string[];
  onJump?: (step: number) => void;
  maxReachedStep: number;
}

export function WizardProgress({ step, totalSteps, labels, onJump, maxReachedStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
          Step {step} of {totalSteps}
        </p>
        <p className="text-[12px] font-semibold text-[var(--text-primary)]">{labels[step - 1]}</p>
      </div>
      <div className="h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
      <ol className="hidden sm:flex items-center justify-between mt-3">
        {labels.map((label, i) => {
          const n = i + 1;
          const isActive = n === step;
          const isDone = n < step;
          const isClickable = n <= maxReachedStep && onJump;
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onJump?.(n)}
                className={`w-full text-left text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-[var(--text-primary)]"
                    : isDone
                      ? "text-[var(--success)] cursor-pointer hover:underline"
                      : "text-[var(--text-tertiary)]"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className={`inline-block w-4 h-4 rounded-full border ${
                      isActive ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[var(--border-default)]"
                    }`} />
                  )}
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
