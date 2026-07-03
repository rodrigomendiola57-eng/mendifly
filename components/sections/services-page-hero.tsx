"use client";

import { FadeUp } from "@/components/ui/fade-up";
import { ShapeGrid } from "@/components/ui/shape-grid";

const HERO_SUBTITLE =
  "Cuatro verticales alineadas con lo que más solicitan las empresas hoy: web, sistemas, comercio online e integraciones que eliminan trabajo manual.";

export function ServicesPageHero() {
  return (
    <section className="relative overflow-hidden bg-[#050505] pt-28">
      <ShapeGrid
        speed={0.41}
        squareSize={40}
        direction="diagonal"
        borderColor="#3B82F6"
        hoverFillColor="#222"
        hoverColor="#A855F7"
        shape="square"
        hoverTrailAmount={8}
      />

      <div className="pointer-events-none relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-12 md:pb-20 md:pt-16">
        <FadeUp delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-500/80 sm:text-sm">
            Módulo de Servicios
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-[1.75rem] font-semibold leading-[1.1] tracking-tight text-white sm:mt-4 sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl">
            Ingeniería de software{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              a la medida
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base font-light leading-relaxed tracking-[-0.01em] text-zinc-400 md:text-lg">
            {HERO_SUBTITLE}
          </p>
        </FadeUp>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#050505] to-transparent"
      />
    </section>
  );
}
