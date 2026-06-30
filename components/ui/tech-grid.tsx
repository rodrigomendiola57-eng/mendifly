import { cn } from "@/lib/utils";

interface TechGridProps {
  className?: string;
  dualTone?: boolean;
}

export function TechGrid({ className, dualTone = false }: TechGridProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: dualTone
            ? `
            linear-gradient(rgba(6, 182, 212, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.25) 1px, transparent 1px)
          `
            : `
            linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
      <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
      <div className="absolute inset-y-0 right-1/4 w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
    </div>
  );
}
