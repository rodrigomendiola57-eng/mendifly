"use client";

import { useReducedMotion } from "framer-motion";

import { ProjectsCta } from "@/components/sections/projects-cta";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { ProjectsPageHero } from "@/components/sections/projects-page-hero";
import { Ferrofluid } from "@/components/ui/ferrofluid";
import { GradientBlinds } from "@/components/ui/gradient-blinds";

const PROJECTS_FERROFLUID = {
  colors: ["#0621f8", "#0a08ec", "#7c3aed"],
  speed: 0.2,
  scale: 1.2,
  turbulence: 1.35,
  fluidity: 0.02,
  rimWidth: 0.2,
  sharpness: 2.1,
  shimmer: 0.15,
  glow: 2.8,
  flowDirection: "down" as const,
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 0,
  mouseRadius: 0.35,
};

const PROJECTS_GRADIENT_BLINDS = {
  gradientColors: ["#0c09e8", "#3300ff"],
  angle: 262,
  noise: 0.03,
  blindCount: 16,
  blindMinWidth: 80,
  spotlightRadius: 1,
  spotlightSoftness: 1,
  spotlightOpacity: 1,
  mouseDampening: 0.18,
  distortAmount: 4,
  shineDirection: "left" as const,
  mixBlendMode: "lighten" as const,
};

export function ProjectsPageShell() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#050505]">
      {/* Hero — Ferrofluid */}
      <div className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Ferrofluid
            {...PROJECTS_FERROFLUID}
            trackPointer="window"
            paused={reduceMotion ?? false}
            className="h-full w-full"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(6,33,248,0.16),transparent_60%),radial-gradient(ellipse_80%_50%_at_75%_45%,rgba(124,58,237,0.1),transparent_55%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#050505]/45"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] via-[#050505]/85 to-transparent"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"
        />

        <div className="relative z-10">
          <ProjectsPageHero />
        </div>
      </div>

      {/* Grid + CTA — GradientBlinds */}
      <div className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <GradientBlinds
            {...PROJECTS_GRADIENT_BLINDS}
            trackPointer="window"
            paused={reduceMotion ?? false}
            className="h-full w-full"
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(12,9,232,0.2),transparent_55%),radial-gradient(ellipse_90%_60%_at_85%_40%,rgba(51,0,255,0.14),transparent_50%),radial-gradient(ellipse_80%_50%_at_15%_60%,rgba(12,9,232,0.1),transparent_45%)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#050505]/35"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent"
        />

        <div className="relative z-10">
          <ProjectsGrid />
          <ProjectsCta />
        </div>
      </div>
    </div>
  );
}
