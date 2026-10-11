import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide transition-all focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#FF5500]/25 bg-[#FF5500]/10 text-[#FF5500] hover:bg-[#FF5500]/15",
        orange:
          "border-[#FF5500]/30 bg-[#FF5500]/10 text-[#FF5500] hover:bg-[#FF5500]/15",
        secondary:
          "border-[var(--border-main)] bg-[var(--bg-elevated)] text-[var(--text-muted)]",
        outline:
          "border-[var(--border-main)] bg-transparent text-[var(--text-main)]",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        cyan:
          "border-[#FF5500]/25 bg-[#FF5500]/10 text-[#FF5500]",
        glow:
          "border-[#FF5500]/40 bg-[#FF5500]/15 text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
