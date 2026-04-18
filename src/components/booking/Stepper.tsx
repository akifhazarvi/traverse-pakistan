"use client";

interface StepperProps {
  label: string;
  sub?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
}

export function Stepper({ label, sub, value, onDecrement, onIncrement, min = 0, max = 99 }: StepperProps) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{label}</p>
        {sub && <p className="text-[11px] text-[var(--text-tertiary)]">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={onDecrement}
          disabled={!canDec}
          className="w-9 h-9 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-7 text-center text-[15px] font-semibold tabular-nums text-[var(--text-primary)]">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={onIncrement}
          disabled={!canInc}
          className="w-9 h-9 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
