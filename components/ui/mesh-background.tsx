import { cn } from "@/lib/utils";

interface MeshBackgroundProps {
  className?: string;
}

export function MeshBackground({ className }: MeshBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -left-[20%] -top-[30%] h-[70%] w-[70%] rounded-full bg-cyan-500/[0.07] blur-[120px]" />
      <div className="absolute -right-[15%] -top-[10%] h-[55%] w-[55%] rounded-full bg-cyan-400/[0.05] blur-[100px]" />
      <div className="absolute -bottom-[25%] left-[10%] h-[60%] w-[60%] rounded-full bg-cyan-600/[0.06] blur-[130px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[45%] w-[45%] rounded-full bg-teal-500/[0.04] blur-[90px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_75%)]" />
    </div>
  );
}
