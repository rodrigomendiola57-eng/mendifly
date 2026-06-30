"use client";

import { Beams } from "@/components/ui/beams";
import { FadeUp } from "@/components/ui/fade-up";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { TechGrid } from "@/components/ui/tech-grid";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { TechCategoryCarousel } from "@/components/ui/tech-category-carousel";
import { techCategories } from "@/lib/technologies-data";

export function TechStack() {
  return (
    <section id="tecnologias" className="relative overflow-hidden bg-[#050505]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Beams
          lightColor="#3b82f6"
          beamWidth={3.1}
          beamHeight={30}
          beamNumber={20}
          speed={2.9}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.07),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)]"
      />
      <TechGrid dualTone className="opacity-15" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeUp inView delay={0.05} className="mb-10 max-w-2xl sm:mb-14">
          <p className="bg-gradient-to-r from-cyan-400/90 to-violet-400/90 bg-clip-text text-xs font-medium uppercase tracking-widest text-transparent sm:text-sm">
            Stack Tecnológico
          </p>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Herramientas que impulsan{" "}
            <ShimmerText>cada solución</ShimmerText>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:mt-4 sm:text-base md:text-lg">
            Combinamos las tecnologías más robustas del mercado para construir
            sistemas escalables, seguros y de alto rendimiento.
          </p>
        </FadeUp>

        <FadeUp inView delay={0.1} className="max-md:-mx-4">
          <TechMarquee className="mb-10 sm:mb-16" />
        </FadeUp>

        <FadeUp inView delay={0.15}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:max-w-5xl lg:gap-x-12">
            {techCategories.map((group, index) => (
              <TechCategoryCarousel
                key={group.id}
                group={group}
                themeIndex={index}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

