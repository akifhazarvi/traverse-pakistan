"use client";

import type { TravelerProfile } from "./types";

interface TravelerCardProps {
  traveler: TravelerProfile;
  index: number;
  onChange: (index: number, patch: Partial<TravelerProfile>) => void;
  error?: Partial<Record<keyof TravelerProfile, string>>;
}

export function TravelerCard({ traveler, index, onChange, error }: TravelerCardProps) {
  const isLead = traveler.isLead;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
            Traveller {index + 1}
            {isLead && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-deep)]">
                LEAD
              </span>
            )}
          </p>
          <p className="text-[15px] font-bold text-[var(--text-primary)] mt-0.5">
            {traveler.ageGroup === "child" ? "Child · age 2–12" : "Adult · age 13+"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Full name (as on ID)"
          required
          error={error?.fullName}
        >
          <input
            type="text"
            required
            value={traveler.fullName}
            onChange={(e) => onChange(index, { fullName: e.target.value })}
            placeholder="Ali Khan"
            className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
          />
        </Field>

        <Field label="Date of birth" required error={error?.dateOfBirth}>
          <input
            type="date"
            required
            value={traveler.dateOfBirth ?? ""}
            onChange={(e) => onChange(index, { dateOfBirth: e.target.value })}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
          />
        </Field>

        <Field label="CNIC or passport" optional>
          <input
            type="text"
            value={traveler.cnicOrPassport ?? ""}
            onChange={(e) => onChange(index, { cnicOrPassport: e.target.value })}
            placeholder="12345-6789012-3"
            className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
          />
        </Field>

        <Field label="Dietary / medical" optional>
          <input
            type="text"
            value={traveler.dietary ?? ""}
            onChange={(e) => onChange(index, { dietary: e.target.value })}
            placeholder="Halal, vegetarian, allergies…"
            className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
          />
        </Field>

        {isLead && (
          <div className="sm:col-span-2">
            <Field label="Emergency contact" optional>
              <input
                type="text"
                value={traveler.emergencyContact ?? ""}
                onChange={(e) => onChange(index, { emergencyContact: e.target.value })}
                placeholder="Name · relationship · phone"
                className="w-full h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-colors"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
        <span>{label}</span>
        {required && <span className="text-[var(--error)]" aria-hidden>*</span>}
        {optional && <span className="text-[var(--text-tertiary)] normal-case font-normal">· optional</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-[var(--error)] font-medium">{error}</p>}
    </div>
  );
}
