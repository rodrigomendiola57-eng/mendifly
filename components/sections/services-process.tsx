"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/fade-up";
import { buildContactHref } from "@/lib/contact-data";
import { serviceProcess } from "@/lib/services-data";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const STEP_MS = 3200;

/** Gradiente azul eléctrico: claro → medio → intenso */
const electricSteps = [
  {
    ring: "border-sky-400/35",
    activeRing: "border-sky-300",
    text: "text-sky-300",
    activeText: "text-sky-200",
    glow: "shadow-[0_0_22px_rgba(56,189,248,0.45)]",
    pulse: "border-sky-300/50",
    highlight: "text-sky-400",
    cardActive:
      "border-sky-400/45 shadow-[0_0_32px_rgba(56,189,248,0.18)] from-sky-950/35",
    dot: "#38bdf8",
  },
  {
    ring: "border-cyan-400/35",
    activeRing: "border-cyan-300",
    text: "text-cyan-300",
    activeText: "text-cyan-200",
    glow: "shadow-[0_0_22px_rgba(34,211,238,0.5)]",
    pulse: "border-cyan-300/50",
    highlight: "text-cyan-400",
    cardActive:
      "border-cyan-400/45 shadow-[0_0_32px_rgba(34,211,238,0.2)] from-cyan-950/35",
    dot: "#22d3ee",
  },
  {
    ring: "border-blue-500/35",
    activeRing: "border-blue-400",
    text: "text-blue-300",
    activeText: "text-blue-200",
    glow: "shadow-[0_0_22px_rgba(59,130,246,0.5)]",
    pulse: "border-blue-400/50",
    highlight: "text-blue-400",
    cardActive:
      "border-blue-500/45 shadow-[0_0_32px_rgba(59,130,246,0.22)] from-blue-950/35",
    dot: "#3b82f6",
  },
] as const;

const desktopNodeX = ["16.67%", "50%", "83.33%"] as const;

function useTimelineLoop(length: number, enabled: boolean) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!enabled || length === 0) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % length);
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [enabled, length]);

  return activeIndex;
}

function ProcessNode({
  step,
  accent,
  isIlluminated,
  isCurrent,
}: {
  step: string;
  accent: (typeof electricSteps)[number];
  isIlluminated: boolean;
  isCurrent: boolean;
}) {
  return (
    <motion.div
      animate={{
        scale: isCurrent ? 1.08 : 1,
        opacity: isIlluminated ? 1 : 0.45,
      }}
      transition={{ duration: 0.45, ease }}
      className={cn(
        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#050505] font-mono text-sm font-semibold md:h-11 md:w-11",
        isIlluminated ? accent.activeRing : accent.ring,
        isIlluminated ? accent.activeText : accent.text,
        isIlluminated && accent.glow,
      )}
    >
      {isCurrent && (
        <motion.span
          aria-hidden
          className={cn("absolute inset-0 rounded-full border", accent.pulse)}
          animate={{ scale: [1, 1.65], opacity: [0.7, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
      {step}
    </motion.div>
  );
}

function ProcessCard({
  item,
  accent,
  isIlluminated,
}: {
  item: (typeof serviceProcess)[number];
  accent: (typeof electricSteps)[number];
  isIlluminated: boolean;
}) {
  return (
    <motion.div
      animate={{
        opacity: isIlluminated ? 1 : 0.42,
        y: isIlluminated ? 0 : 4,
        scale: isIlluminated ? 1 : 0.98,
      }}
      transition={{ duration: 0.45, ease }}
      className={cn(
        "group h-full rounded-2xl border bg-gradient-to-b to-zinc-950/40 p-5 backdrop-blur-md transition-[border-color,box-shadow] duration-500 md:p-6",
        isIlluminated
          ? accent.cardActive
          : "border-white/[0.06] from-zinc-900/40",
      )}
    >
      <h3
        className={cn(
          "font-display text-lg font-semibold tracking-tight md:text-xl",
          isIlluminated ? "text-white" : "text-zinc-400",
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "mt-2.5 text-sm leading-relaxed transition-colors",
          isIlluminated ? "text-zinc-300" : "text-zinc-500",
        )}
      >
        {item.description}
      </p>
      <p
        className={cn(
          "mt-4 text-xs font-medium uppercase tracking-widest",
          isIlluminated ? accent.highlight : "text-zinc-600",
        )}
      >
        {item.highlight}
      </p>
    </motion.div>
  );
}

export function ServicesProcess() {
  const reduceMotion = useReducedMotion();
  const activeIndex = useTimelineLoop(serviceProcess.length, !reduceMotion);

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
        <FadeUp inView delay={0.05} className="mb-10 max-w-2xl md:mb-14">
          <p className="text-sm font-medium uppercase tracking-widest text-sky-400/90">
            Metodología
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Cómo entregamos valor
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 md:text-base">
            Un proceso pensado para que inviertas con claridad, veas resultados
            reales y tengas un equipo de desarrollo que responde cuando tu
            negocio lo necesita.
          </p>
        </FadeUp>

        {/* Desktop — timeline horizontal en bucle */}
        <div className="relative hidden md:block">
          <div
            aria-hidden
            className="absolute left-[calc(16.67%-20px)] right-[calc(16.67%-20px)] top-5 h-px bg-gradient-to-r from-sky-500/25 via-cyan-400/35 to-blue-500/25"
          />

          <motion.div
            aria-hidden
            className="absolute top-5 h-px origin-left bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500"
            style={{
              left: "calc(16.67% - 20px)",
              width: "calc(66.66% + 40px)",
            }}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: (activeIndex + 1) / serviceProcess.length,
            }}
            transition={{ duration: 0.55, ease }}
          />

          <motion.div
            aria-hidden
            className="absolute top-5 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              boxShadow: `0 0 10px ${electricSteps[activeIndex].dot}, 0 0 22px ${electricSteps[activeIndex].dot}`,
              backgroundColor: electricSteps[activeIndex].dot,
            }}
            animate={{ left: desktopNodeX[activeIndex] }}
            transition={{ duration: 0.55, ease }}
          />

          <ol className="grid grid-cols-3 gap-6">
            {serviceProcess.map((item, index) => {
              const accent = electricSteps[index];
              const isIlluminated = index <= activeIndex;
              const isCurrent = index === activeIndex;

              return (
                <li key={item.step} className="relative flex flex-col">
                  <div className="mb-8 flex justify-center">
                    <ProcessNode
                      step={item.step}
                      accent={accent}
                      isIlluminated={isIlluminated}
                      isCurrent={isCurrent}
                    />
                  </div>
                  <ProcessCard
                    item={item}
                    accent={accent}
                    isIlluminated={isIlluminated}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {/* Móvil — timeline vertical en bucle */}
        <ol className="relative md:hidden">
          <div
            aria-hidden
            className="absolute bottom-3 left-[19px] top-3 w-px bg-gradient-to-b from-sky-500/20 via-cyan-400/30 to-blue-500/20"
          />

          <motion.span
            aria-hidden
            className="absolute left-[19px] top-3 w-px origin-top bg-gradient-to-b from-sky-400 via-cyan-400 to-blue-500"
            animate={{
              scaleY: (activeIndex + 1) / serviceProcess.length,
            }}
            transition={{ duration: 0.55, ease }}
          />

          <motion.span
            aria-hidden
            className="absolute left-[19px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              boxShadow: `0 0 10px ${electricSteps[activeIndex].dot}, 0 0 20px ${electricSteps[activeIndex].dot}`,
              backgroundColor: electricSteps[activeIndex].dot,
            }}
            animate={{
              top:
                activeIndex === 0
                  ? "5%"
                  : activeIndex === 1
                    ? "50%"
                    : "95%",
            }}
            transition={{ duration: 0.55, ease }}
          />

          {serviceProcess.map((item, index) => {
            const accent = electricSteps[index];
            const isIlluminated = index <= activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <li
                key={item.step}
                className={cn(
                  "relative pl-14",
                  index < serviceProcess.length - 1 ? "mb-6" : "mb-0",
                )}
              >
                <div className="absolute left-0 top-0">
                  <ProcessNode
                    step={item.step}
                    accent={accent}
                    isIlluminated={isIlluminated}
                    isCurrent={isCurrent}
                  />
                </div>

                <ProcessCard
                  item={item}
                  accent={accent}
                  isIlluminated={isIlluminated}
                />
              </li>
            );
          })}
        </ol>

        <FadeUp inView delay={0.2} className="mt-10 text-center md:mt-14">
          <Button asChild size="lg">
            <Link href={buildContactHref("general")}>
              Agendar consulta gratuita
            </Link>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
