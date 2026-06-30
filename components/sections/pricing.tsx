"use client";

import Link from "next/link";
import { buildContactHref } from "@/lib/contact-data";

import { FadeUp } from "@/components/ui/fade-up";
import { PricingCard } from "@/components/ui/pricing-card";
import { PricingCarousel } from "@/components/ui/pricing-carousel";
import { TechGrid } from "@/components/ui/tech-grid";
import { pricingPlans } from "@/lib/pricing-data";

export function Pricing() {
  return (
    <section
      id="precios"
      className="relative overflow-hidden border-t border-zinc-900/80 bg-[#050505]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_40%_at_50%_0%,rgba(139,92,246,0.07),transparent)]"
      />
      <TechGrid dualTone className="opacity-[0.07]" />

      <div className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <FadeUp inView delay={0.05} className="mb-12 text-center sm:mb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90 sm:text-sm">
            Inversión
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Planes para cada
            <span className="ml-3 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              etapa
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Proyectos de software a precio justo. Sin sorpresas, sin costos
            ocultos — todo incluido desde el primer día.
          </p>
        </FadeUp>

        {/* Mobile: tech carousel */}
        <div className="md:hidden">
          <PricingCarousel />
        </div>

        {/* Desktop / tablet: grid */}
        <div className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {pricingPlans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        <FadeUp inView delay={0.5} className="mt-10 text-center">
          <p className="text-xs text-zinc-600">
            Precios en pesos mexicanos (MXN) sin IVA. Proyectos con opción de
            financiamiento.{" "}
            <Link
              href={buildContactHref("general")}
              className="text-violet-400/70 underline-offset-4 transition-colors hover:text-violet-300 hover:underline"
            >
              Solicita una cotización detallada →
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
