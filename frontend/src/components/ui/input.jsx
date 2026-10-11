import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-[var(--border-main)] bg-[var(--bg-input)] px-4 py-2 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-mono",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
