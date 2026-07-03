"use client";

import { useRef } from "react";

import { FadeUp } from "@/components/ui/fade-up";
import {
  MagicBentoSpotlight,
  SERVICE_MAGIC_BENTO_CONFIG,
} from "@/components/ui/magic-bento";
import { ServiceCard } from "@/components/ui/service-card";
import { ServiceCardMobile } from "@/components/ui/service-card-mobile";
import { services } from "@/lib/services-data";
import { cn } from "@/lib/utils";

interface ServicesGridProps {
  variant?: "compact" | "detailed";
  showHeader?: boolean;
}

export function ServicesGrid({
  variant = "compact",
  showHeader = true,
}: ServicesGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const useMagicBento = variant === "detailed";

  return (
    <section
      className={cn("relative", useMagicBento && "bento-section")}
    >
      {useMagicBento && (
        <MagicBentoSpotlight
          gridRef={gridRef}
          {...SERVICE_MAGIC_BENTO_CONFIG}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        {showHeader && (
          <FadeUp inView delay={0.05} className="mb-16 max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-500/80 sm:text-sm">
              Servicios
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Soluciones diseñadas para{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                escalar tu negocio
              </span>
            </h2>
            <p className="mt-5 text-base font-light leading-relaxed tracking-[-0.01em] text-zinc-400 md:text-lg">
              Cada sistema que construimos combina diseño premium, ingeniería
              sólida y la precisión que tu operación exige.
            </p>
          </FadeUp>
        )}

        {/* Desktop — grid bento (sin cambios) */}
        <div
          ref={gridRef}
          className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-12"
        >
          {services.map((service, index) => (
            <FadeUp
              key={service.id}
              inView
              delay={0.1 + index * 0.1}
              className={cn("h-full", service.gridClass)}
            >
              <ServiceCard service={service} variant={variant} />
            </FadeUp>
          ))}
        </div>

        {/* Móvil — tarjetas premium */}
        <div className="flex flex-col gap-5 md:hidden">
          {services.map((service, index) => (
            <ServiceCardMobile
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
