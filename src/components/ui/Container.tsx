import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function Container({ children, className, wide }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-16",
        wide ? "max-w-[1400px]" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
