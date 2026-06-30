import { Hero } from "@/components/sections/hero";
import { TechStack } from "@/components/sections/tech-stack";
import { ValueProps } from "@/components/sections/value-props";
import { Pricing } from "@/components/sections/pricing";
import { AuroraStreak } from "@/components/ui/aurora-streak";

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(139,92,246,0.04),transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(6,182,212,0.03),transparent_40%)]"
      />
      <div className="relative z-[1]">
        <Hero />
        <AuroraStreak position="top" />
        <TechStack />
        <AuroraStreak position="top" />
        <ValueProps />
        <AuroraStreak position="top" />
        <Pricing />
      </div>
    </main>
  );
}
