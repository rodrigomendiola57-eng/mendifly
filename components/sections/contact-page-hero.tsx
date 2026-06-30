"use client";

import { FadeUp } from "@/components/ui/fade-up";

export function ContactPageHero() {
  return (
    <section className="relative pt-28">
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
        <FadeUp delay={0.1}>
          <p className="text-sm font-medium uppercase tracking-widest text-violet-300/90">
            Módulo de Contacto
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Hablemos de tu{" "}
            <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
              próximo proyecto
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
            Cuéntanos qué necesitas. Te responderemos con una propuesta clara,
            sin compromiso y adaptada a la etapa de tu negocio.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
