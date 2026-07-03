"use client";

import { BeamsBackdrop } from "@/components/ui/beams-backdrop";
import { TechGrid } from "@/components/ui/tech-grid";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ServicesProcess } from "@/components/sections/services-process";

export function ServicesBody() {
  return (
    <div className="relative overflow-hidden bg-[#050505]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 max-md:brightness-[1.35] max-md:saturate-110 max-md:contrast-105"
      >
        <BeamsBackdrop
          lightColor="#06b6d4"
          beamWidth={2.6}
          beamHeight={26}
          beamNumber={14}
          speed={2.2}
          noiseIntensity={1.4}
          scale={0.16}
          rotation={300}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_80%_50%_at_15%_30%,rgba(6,182,212,0.09),transparent_55%),radial-gradient(ellipse_70%_45%_at_85%_55%,rgba(139,92,246,0.1),transparent_50%),radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(6,182,212,0.05),transparent_60%)] md:block"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden bg-[radial-gradient(ellipse_100%_70%_at_25%_20%,rgba(6,182,212,0.14),transparent_55%),radial-gradient(ellipse_90%_65%_at_80%_45%,rgba(139,92,246,0.16),transparent_50%),radial-gradient(ellipse_80%_50%_at_50%_90%,rgba(34,211,238,0.08),transparent_60%)]"
      />

      <TechGrid dualTone className="opacity-[0.09] max-md:opacity-[0.15]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-[#050505] via-[#050505]/85 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-[#050505] to-transparent"
      />

      <div className="relative z-[2]">
        <ServicesGrid variant="detailed" showHeader={false} />
        <div
          aria-hidden
          className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent"
        />
        <ServicesProcess />
      </div>
    </div>
  );
}
