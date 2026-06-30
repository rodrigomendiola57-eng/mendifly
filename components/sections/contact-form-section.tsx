"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";

import { CircularText } from "@/components/ui/circular-text";
import { ContactForm } from "@/components/ui/contact-form";
import { FadeUp } from "@/components/ui/fade-up";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ContactFormFallback() {
  return (
    <div className="h-[480px] animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/30" />
  );
}

const contactHighlights = [
  {
    circularText: "RESPUESTA*RÁPIDA*",
    title: "Respuesta rápida",
    description: "Menos de 24 horas hábiles",
    spinDuration: 18,
  },
  {
    circularText: "CONSULTORÍA*INICIAL*",
    title: "Consultoría inicial",
    description: "Sin costo ni compromiso",
    spinDuration: 22,
  },
  {
    circularText: "PROPUESTA*CLARA*",
    title: "Propuesta clara",
    description: "Alcance, tiempos y presupuesto",
    spinDuration: 16,
  },
] as const;

const highlightAccents = [
  {
    border: "border-cyan-500/20",
    borderHover: "hover:border-cyan-500/40",
    glow: "hover:shadow-[0_0_22px_rgba(6,182,212,0.14)]",
    line: "via-cyan-400/65",
    text: "text-zinc-300 group-hover:text-cyan-100/95",
    blob: "bg-cyan-500/10",
  },
  {
    border: "border-violet-500/20",
    borderHover: "hover:border-violet-500/40",
    glow: "hover:shadow-[0_0_22px_rgba(139,92,246,0.14)]",
    line: "via-violet-400/65",
    text: "text-zinc-300 group-hover:text-violet-100/95",
    blob: "bg-violet-500/10",
  },
  {
    border: "border-cyan-500/20",
    borderHover: "hover:border-cyan-500/40",
    glow: "hover:shadow-[0_0_22px_rgba(6,182,212,0.14)]",
    line: "via-cyan-400/65",
    text: "text-zinc-300 group-hover:text-cyan-100/95",
    blob: "bg-cyan-500/10",
  },
] as const;

function ContactHighlightDesc({
  description,
  index,
}: {
  description: string;
  index: number;
}) {
  const accent = highlightAccents[index % highlightAccents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.55, delay: 0.12 + index * 0.1, ease }}
      whileHover={{ y: -4, transition: { duration: 0.28, ease } }}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border bg-zinc-900/35 px-2.5 py-3 backdrop-blur-md transition-[border-color,box-shadow] duration-300 sm:rounded-2xl sm:px-4 sm:py-4",
        accent.border,
        accent.borderHover,
        accent.glow,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          accent.line,
        )}
      />

      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl",
          accent.blob,
        )}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
      />

      <p
        className={cn(
          "relative text-center font-display text-[0.6875rem] font-medium leading-snug tracking-tight sm:text-sm sm:leading-relaxed",
          accent.text,
        )}
      >
        {description}
      </p>
    </motion.div>
  );
}

export function ContactFormSection() {
  return (
    <section id="formulario" className="relative">
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeUp inView delay={0.05}>
          <div className="mb-10 grid grid-cols-3 items-start justify-items-center gap-x-2 gap-y-3 sm:mb-12 sm:gap-x-10 sm:gap-y-5 md:gap-x-14 lg:gap-x-20">
            {contactHighlights.map((item) => (
              <CircularText
                key={`circle-${item.title}`}
                text={item.circularText}
                spinDuration={item.spinDuration}
                onHover="slowDown"
                className="circular-text-contact shrink-0 text-cyan-300"
                aria-label={item.title}
              />
            ))}

            {contactHighlights.map((item, index) => (
              <ContactHighlightDesc
                key={`desc-${item.title}`}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </FadeUp>

        <FadeUp inView delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/15 bg-zinc-900/30 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.06),0_0_60px_rgba(139,92,246,0.1)] sm:rounded-3xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-violet-500/[0.06]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
            />

            <div className="relative p-6 sm:p-8 md:p-12 lg:p-14">
              <div className="mb-8 max-w-xl">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Envíanos tu solicitud
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Completa el formulario y selecciona el servicio que te
                  interesa. Usaremos esa información para preparar una respuesta
                  personalizada.
                </p>
              </div>

              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
