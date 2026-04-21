import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center max-w-md mx-auto py-12 sm:py-16", className)}>
      <span
        aria-hidden="true"
        className="inline-flex w-20 h-20 rounded-full items-center justify-center bg-[var(--primary-light)] text-[var(--primary-deep)] ring-1 ring-[var(--primary)]/15"
      >
        <Icon name={icon} size={40} weight="regular" />
      </span>
      <h2 className="text-[22px] font-bold text-[var(--text-primary)] mt-5 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--text-secondary)] mt-2 leading-relaxed text-[14.5px]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
