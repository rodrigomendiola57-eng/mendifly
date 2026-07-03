"use client";

import { useState } from "react";

import { BeamsBackdrop } from "@/components/ui/beams-backdrop";
import { FadeUp } from "@/components/ui/fade-up";
import { ScrollFloat } from "@/components/ui/scroll-float";
import { TechGrid } from "@/components/ui/tech-grid";
import { ValueCard } from "@/components/ui/value-card";
import { ValueCarousel } from "@/components/ui/value-carousel";
import { valueProps } from "@/lib/value-props-data";

export function ValueProps() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="valor-agregado"
      className="relative overflow-hidden border-t border-zinc-900/80 bg-[#050505]"
    >
      {/* Beams background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <BeamsBackdrop
          lightColor="#A855F7"
          beamWidth={3.1}
          beamHeight={30}
          beamNumber={20}
          speed={2.9}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={324}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05),transparent_60%)]"
      />
      <TechGrid dualTone className="opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeUp inView delay={0.05} className="mb-10 sm:mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90 sm:text-sm">
            Valor Agregado
          </p>

          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.025}
            containerClassName="mt-3 font-display tracking-tight text-white"
          >
            Más que código, una experiencia completa
          </ScrollFloat>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:mt-5 sm:text-base md:text-lg">
            Cada proyecto incluye beneficios que elevan tu inversión: diseño,
            seguridad, visibilidad y soporte pensados para el largo plazo.
          </p>
        </FadeUp>

        {/* Carrusel: simple en móvil, premium en desktop */}
        <FadeUp inView delay={0.15}>
          <ValueCarousel
            ariaLabel="Beneficios de valor agregado"
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
          >
            {valueProps.map((item, index) => (
              <ValueCard
                key={item.id}
                item={item}
                index={index}
                active={index === activeIndex}
              />
            ))}
          </ValueCarousel>
        </FadeUp>
      </div>
    </section>
  );
}
