import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-[0.98]",
  secondary:
    "bg-[var(--bg-dark)] text-white hover:bg-[#243f3b] active:scale-[0.98]",
  outline:
    "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
  ghost:
    "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] active:bg-[var(--border-default)]",
  white:
    "bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-default)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-6 text-[15px] gap-2",
  lg: "h-[52px] px-8 text-[15px] gap-2.5 font-semibold",
  icon: "h-11 w-11 p-0 flex items-center justify-center",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium cursor-pointer select-none",
          "transition-all duration-[var(--duration-fast)] ease-[cubic-bezier(0.2,0,0,1)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
export type { ButtonProps };
