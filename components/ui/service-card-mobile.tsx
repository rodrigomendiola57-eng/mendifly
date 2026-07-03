"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import {
  buildContactHref,
  type ContactServiceId,
} from "@/lib/contact-data";
import type { ServiceItem } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type Accent = "cyan" | "violet";

const accentStyles: Record<
  Accent,
  {
    border: string;
    blob: string;
    topline: string;
    check: string;
    cta: string;
    watermark: string;
  }
> = {
  cyan: {
    border: "border-cyan-500/25",
    blob: "bg-cyan-500/18",
    topline: "bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent",
    check: "bg-cyan-500/15 text-cyan-300",
    cta: "bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_10px_30px_-8px_rgba(6,182,212,0.5)]",
    watermark: "text-cyan-500/[0.06]",
  },
  violet: {
    border: "border-violet-500/25",
    blob: "bg-violet-500/18",
    topline:
      "bg-gradient-to-r from-transparent via-violet-400/70 to-transparent",
    check: "bg-violet-500/15 text-violet-300",
    cta: "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_10px_30px_-8px_rgba(139,92,246,0.5)]",
    watermark: "text-violet-500/[0.06]",
  },
};

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

interface ServiceCardMobileProps {
  service: ServiceItem;
  index: number;
}

export function ServiceCardMobile({ service, index }: ServiceCardMobileProps) {
  const accent: Accent = index % 2 === 0 ? "cyan" : "violet";
  const a = accentStyles[accent];
  const contactHref = buildContactHref(service.id as ContactServiceId);
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={container}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border p-6",
        "bg-gradient-to-b from-zinc-900/30 via-zinc-900/15 to-zinc-950/25 backdrop-blur-md",
        "supports-[backdrop-filter]:from-zinc-900/25 supports-[backdrop-filter]:via-zinc-900/10 supports-[backdrop-filter]:to-zinc-950/20",
        a.border,
      )}
    >
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl",
          a.blob,
        )}
        animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.06, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-px", a.topline)}
      />

      <span
        aria-hidden
        className={cn(
          "absolute right-5 top-3 font-mono text-6xl font-bold leading-none",
          a.watermark,
        )}
      >
        {number}
      </span>

      <motion.h3
        variants={item}
        className="relative font-display text-3xl font-light leading-[1.04] tracking-[-0.055em] text-white"
      >
        {service.title}
      </motion.h3>

      <motion.p
        variants={item}
        className="relative mt-4 text-[0.95rem] font-light leading-relaxed tracking-[-0.01em] text-zinc-400"
      >
        {service.fullDescription}
      </motion.p>

      <motion.ul
        variants={item}
        className="relative mt-5 grid grid-cols-1 gap-2.5 border-t border-white/[0.06] pt-5"
      >
        {service.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm font-light leading-relaxed tracking-[-0.01em] text-zinc-300"
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                a.check,
              )}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="relative mt-6">
        <Link
          href={contactHref}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium tracking-[-0.01em] text-white transition-transform active:scale-[0.98]",
            a.cta,
          )}
        >
          Solicitar información
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.article>
  );
}
