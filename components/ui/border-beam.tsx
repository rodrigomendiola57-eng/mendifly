import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  children: ReactNode;
  className?: string;
}

export function BorderBeam({ children, className }: BorderBeamProps) {
  return (
    <div className={cn("group relative rounded-3xl p-[1px]", className)}>
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <div className="animate-border-beam absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0%,#06b6d4_8%,#8b5cf6_14%,transparent_22%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="relative h-full rounded-[inherit]">{children}</div>
    </div>
  );
}
