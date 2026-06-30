"use client";

import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/pricing-data";

function PopularBorder() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <div className="animate-border-beam absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0%,#a78bfa_8%,#7c3aed_16%,transparent_26%)] opacity-55" />
    </div>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  index?: number;
  /** Entrance animation — off inside mobile carousel */
  entrance?: boolean;
  /** Versión compacta para carrusel móvil */
  compact?: boolean;
}

export function PricingCard({
  plan,
  index = 0,
  entrance = true,
  compact = false,
}: PricingCardProps) {
  const isPopular = plan.popular;
  const isEnterprise = plan.id === "enterprise";

  const visibleFeatures = compact
    ? plan.features.filter((f) => f.included).slice(0, plan.compactIncludedLimit)
    : plan.features;

  const content = (
    <>
      {isPopular ? (
        <PopularBorder />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-zinc-800/60 transition-colors duration-500 group-hover:border-zinc-700"
        />
      )}

      <div
        className={cn(
          "relative flex h-full flex-col rounded-[inherit]",
          compact ? "p-4" : "p-6",
          isPopular
            ? "bg-gradient-to-b from-[#18112a] to-zinc-950/95"
            : "bg-gradient-to-b from-zinc-900/55 to-zinc-950/80",
          "backdrop-blur-xl",
        )}
      >
        {isPopular && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[inherit] bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"
          />
        )}

        {plan.badge ? (
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full bg-violet-500/15 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-violet-300 ring-1 ring-violet-500/30",
              compact ? "mb-2" : "mb-3",
            )}
          >
            {plan.badge}
          </span>
        ) : compact ? null : (
          <div className="mb-3 h-5" aria-hidden />
        )}

        <h3
          className={cn(
            "font-display font-bold tracking-tight text-white",
            compact ? "text-base" : "text-lg",
          )}
        >
          {plan.name}
        </h3>

        {!compact && (
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
            {plan.tagline}
          </p>
        )}

        {compact && (
          <p className="mt-1.5 text-[0.7rem] leading-snug text-zinc-400">
            {plan.briefDescription}
          </p>
        )}

        <div className={cn("h-px w-full bg-zinc-800/60", compact ? "my-3" : "my-5")} />

        <div className={compact ? "mb-3" : "mb-5"}>
          {plan.price === "A medida" ? (
            <>
              <p
                className={cn(
                  "font-display font-bold text-white",
                  compact ? "text-xl" : "text-2xl",
                )}
              >
                A medida
              </p>
              <p className="mt-0.5 text-[0.65rem] text-zinc-500">{plan.priceNote}</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-[0.65rem] font-medium text-zinc-500">desde</span>
                <span
                  className={cn(
                    "font-display font-bold tracking-tight text-white",
                    compact ? "text-2xl" : "text-3xl",
                  )}
                >
                  {plan.price}
                </span>
              </div>
              <p className="mt-0.5 text-[0.65rem] text-zinc-500">{plan.priceNote}</p>
            </>
          )}
        </div>

        {!compact && (
          <p className="mb-5 text-xs leading-relaxed text-zinc-400">
            {plan.description}
          </p>
        )}

        <ul className={cn("flex flex-1 flex-col", compact ? "gap-1.5" : "gap-2.5")}>
          {visibleFeatures.map((feat, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-[1px] flex shrink-0 items-center justify-center rounded-full",
                  compact ? "h-3.5 w-3.5" : "h-4 w-4",
                  feat.included
                    ? isPopular
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-zinc-800 text-cyan-400"
                    : "bg-transparent text-zinc-700",
                )}
              >
                {feat.included ? (
                  <Check className="h-2 w-2" strokeWidth={3} />
                ) : (
                  <Minus className="h-2 w-2" strokeWidth={2.5} />
                )}
              </span>
              <span
                className={cn(
                  "leading-snug",
                  compact ? "text-[0.7rem]" : "text-xs leading-relaxed",
                  feat.included ? "text-zinc-200" : "text-zinc-600",
                )}
              >
                {feat.text}
              </span>
            </li>
          ))}
        </ul>

        <div className={compact ? "mt-4" : "mt-7"}>
          <Button
            asChild
            size="sm"
            variant={isPopular ? "default" : "secondary"}
            className={cn(
              "w-full text-xs font-semibold",
              compact ? "h-9" : "h-10",
              isPopular &&
                "bg-violet-600 shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.55)]",
              isEnterprise &&
                "border-zinc-700 text-zinc-200 hover:border-cyan-500/50 hover:text-cyan-300",
            )}
          >
            <Link href={plan.ctaHref}>{plan.cta}</Link>
          </Button>
        </div>
      </div>
    </>
  );

  const className = cn(
    "group relative flex h-full flex-col rounded-2xl p-[1px]",
    isPopular &&
      "shadow-[0_0_70px_rgba(139,92,246,0.22),0_0_140px_rgba(139,92,246,0.08)]",
  );

  if (!entrance) {
    return <div className={className}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {content}
    </motion.div>
  );
}
