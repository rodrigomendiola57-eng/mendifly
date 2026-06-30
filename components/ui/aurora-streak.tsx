import { cn } from "@/lib/utils";

interface AuroraStreakProps {
  className?: string;
  position?: "top" | "center" | "bottom";
}

export function AuroraStreak({
  className,
  position = "center",
}: AuroraStreakProps) {
  const positionClass = {
    top: "top-0",
    center: "top-1/2 -translate-y-1/2",
    bottom: "bottom-0",
  }[position];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 h-px",
        positionClass,
        className,
      )}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
      <div className="absolute inset-x-[15%] -top-24 h-48 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.07),transparent_70%)] blur-2xl" />
      <div className="absolute inset-x-[35%] -top-20 h-40 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.09),transparent_70%)] blur-2xl" />
    </div>
  );
}
