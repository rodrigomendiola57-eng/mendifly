import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerText({ children, className }: ShimmerTextProps) {
  return (
    <span
      className={cn(
        "animate-shimmer bg-[length:200%_auto] bg-clip-text text-transparent",
        "bg-gradient-to-r from-cyan-300 via-violet-200 to-cyan-400",
        className,
      )}
    >
      {children}
    </span>
  );
}
