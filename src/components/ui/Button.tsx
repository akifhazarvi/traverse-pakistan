import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** When true, shows a spinner and disables pointer events. */
  pending?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--text-inverse)] shadow-[var(--shadow-xs)] hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
  secondary:
    "bg-[var(--bg-dark)] text-[var(--on-dark)] shadow-[var(--shadow-xs)] hover:bg-[var(--primary-deep)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
  outline:
    "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)] active:scale-[0.98]",
  ghost:
    "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] active:bg-[var(--border-default)]",
  white:
    "bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-6 text-[15px] gap-2",
  lg: "h-[52px] px-8 text-[15px] gap-2.5 font-semibold",
  icon: "h-11 w-11 p-0 flex items-center justify-center",
};

const spinnerSize: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
  icon: 18,
};

function Spinner({ size }: { size: number }) {
  return (
    <svg
      className="button-spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      pending,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || pending;
    return (
      <button
        ref={ref}
        aria-busy={pending || undefined}
        disabled={isDisabled}
        className={cn(
          "relative inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium cursor-pointer select-none",
          "transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-default)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {pending && (
          <span className="inline-flex items-center justify-center">
            <Spinner size={spinnerSize[size]} />
          </span>
        )}
        <span className={cn("inline-flex items-center justify-center gap-[inherit]", pending && "opacity-80")}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
