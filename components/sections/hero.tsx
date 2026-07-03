"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, type ReactNode } from "react";

import { AnimatedStat } from "@/components/ui/animated-stat";
import { AuroraStreak } from "@/components/ui/aurora-streak";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/fade-up";
import { HeroTextCarousel } from "@/components/ui/hero-text-carousel";
import { Magnetic } from "@/components/ui/magnetic";

// Fondo WebGL diferido: no bloquea el render inicial ni la hidratación.
const PrismaticBurst = dynamic(
  () =>
    import("@/components/ui/prismatic-burst").then((mod) => mod.PrismaticBurst),
  { ssr: false },
);

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const stats = [
  { value: "50+", label: "Proyectos entregados" },
  { value: "99.9%", label: "Uptime en sistemas" },
  { value: "24/7", label: "Soporte dedicado" },
] as const;

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <WebGLErrorBoundary>
          <PrismaticBurst
            animationType="rotate3d"
            intensity={1.9}
            speed={0.55}
            distort={0}
            rayCount={0}
            mixBlendMode="lighten"
            colors={["#3b82f6", "#5f0af1", "#6366f1"]}
          />
        </WebGLErrorBoundary>
      </div>

      <div className="relative z-[2] mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <HeroTextCarousel />

        <FadeUp
          delay={0.65}
          className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
        >
          <Magnetic className="w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 w-full sm:h-12 sm:w-auto">
              <Link href="/contacto">Iniciar proyecto</Link>
            </Button>
          </Magnetic>
          <Magnetic strength={0.15} className="w-full sm:w-auto">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-12 w-full sm:h-12 sm:w-auto"
            >
              <Link href="/servicios">Explorar servicios</Link>
            </Button>
          </Magnetic>
        </FadeUp>

        <div className="mt-10 grid grid-cols-3 gap-x-3 gap-y-4 sm:mt-16 sm:gap-x-6 sm:gap-y-5 md:mt-24 md:gap-x-8">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={0.1 + index * 0.12}
            />
          ))}
        </div>
      </div>

      <AuroraStreak position="bottom" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent sm:h-32"
      />
    </section>
  );
}
