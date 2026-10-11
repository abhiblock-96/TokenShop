import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF5500] text-white hover:bg-[#E64D00] shadow-[0_4px_16px_rgba(255,85,0,0.25)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.35)]",
        orange:
          "bg-[#FF5500] text-white hover:bg-[#E64D00] shadow-[0_4px_16px_rgba(255,85,0,0.25)]",
        secondary:
          "bg-[var(--bg-elevated)] text-[var(--text-main)] hover:bg-[var(--bg-input)] border border-[var(--border-main)]",
        outline:
          "border border-[var(--border-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)]",
        ghost:
          "hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        uniswap:
          "bg-[#FF5500] text-white hover:bg-[#E64D00] shadow-[0_4px_20px_rgba(255,85,0,0.3)]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-7 text-base font-bold",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
