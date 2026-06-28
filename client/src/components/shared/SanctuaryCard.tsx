import * as React from "react";
import { cn } from "@/lib/utils";

type SanctuaryCardVariant = "default" | "primary" | "sage";

export interface SanctuaryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SanctuaryCardVariant;
}

const variantStyles: Record<SanctuaryCardVariant, string> = {
  default:
    "bg-surface-elevated border-border hover:border-slate-200",
  primary:
    "bg-primary-50 border-primary-100 hover:border-primary-200",
  sage:
    "bg-sage-50 border-sage-100 hover:border-sage-200",
};

const SanctuaryCard = React.forwardRef<HTMLDivElement, SanctuaryCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-sanctuary border p-8 shadow-sanctuary",
          "transition-all duration-300 ease-out",
          "hover:shadow-elevated hover:-translate-y-0.5",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SanctuaryCard.displayName = "SanctuaryCard";

export { SanctuaryCard };
