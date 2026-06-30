"use client";

import { cn } from "@/lib/utils";

interface AnimatedMeshProps {
  className?: string;
}

export function AnimatedMesh({ className }: AnimatedMeshProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="animate-float-slow absolute -left-[20%] -top-[30%] h-[70%] w-[70%] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
      <div className="animate-float-slower absolute -right-[10%] -top-[5%] h-[58%] w-[58%] rounded-full bg-violet-600/[0.09] blur-[110px]" />
      <div
        className="animate-float-slow absolute -bottom-[25%] left-[10%] h-[60%] w-[60%] rounded-full bg-violet-500/[0.07] blur-[130px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-float-slower absolute -bottom-[10%] -right-[10%] h-[45%] w-[45%] rounded-full bg-cyan-400/[0.06] blur-[90px]"
        style={{ animationDelay: "-12s" }}
      />
      <div className="animate-float-slow absolute left-[35%] top-[40%] h-[35%] w-[35%] rounded-full bg-indigo-500/[0.04] blur-[100px]" style={{ animationDelay: "-9s" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_75%)]" />
    </div>
  );
}
