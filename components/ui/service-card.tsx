"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MagicBentoCard,
  SERVICE_MAGIC_BENTO_CONFIG,
} from "@/components/ui/magic-bento";
import {
  buildContactHref,
  type ContactServiceId,
} from "@/lib/contact-data";
import type { ServiceItem } from "@/lib/services-data";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceItem;
  variant?: "compact" | "detailed";
}

const cardSurfaceClass =
  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md";

function ServiceCardContent({
  service,
  variant,
  description,
  contactHref,
  accent = "violet",
}: {
  service: ServiceItem;
  variant: "compact" | "detailed";
  description: string;
  contactHref: string;
  accent?: "violet" | "cyan";
}) {
  const isViolet = accent === "violet";

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          isViolet ? "from-violet-500/[0.04]" : "from-cyan-500/[0.04]",
        )}
      />

      <div className="relative z-[2] flex flex-1 flex-col">
        <h3 className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
          {description}
        </p>

        {variant === "detailed" && (
          <ul className="mt-5 space-y-2 border-t border-zinc-800/80 pt-5">
            {service.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-zinc-500"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                    isViolet ? "bg-violet-500/60" : "bg-cyan-500/60",
                  )}
                />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {variant === "detailed" && (
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="relative z-[3] mt-6 w-full sm:w-auto"
          >
            <Link href={contactHref}>
              Solicitar información
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {variant === "compact" && (
        <Link
          href={contactHref}
          className="relative z-[3] mt-6 flex items-center gap-2 text-xs font-medium text-cyan-500/70 transition-colors duration-300 group-hover:text-cyan-400"
        >
          <span className="h-px w-8 bg-cyan-500/40 transition-all duration-300 group-hover:w-12 group-hover:bg-cyan-400/60" />
          Solicitar información
        </Link>
      )}
    </>
  );
}

export function ServiceCard({
  service,
  variant = "compact",
}: ServiceCardProps) {
  const description =
    variant === "detailed" ? service.fullDescription : service.shortDescription;
  const contactHref = buildContactHref(service.id as ContactServiceId);

  if (variant === "detailed") {
    return (
      <MagicBentoCard
        className={cn(cardSurfaceClass, service.minHeight)}
        {...SERVICE_MAGIC_BENTO_CONFIG}
      >
        <ServiceCardContent
          service={service}
          variant={variant}
          description={description}
          contactHref={contactHref}
          accent="violet"
        />
      </MagicBentoCard>
    );
  }

  return (
    <article
      className={cn(
        cardSurfaceClass,
        "transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]",
        service.minHeight,
      )}
    >
      <ServiceCardContent
        service={service}
        variant={variant}
        description={description}
        contactHref={contactHref}
        accent="cyan"
      />
    </article>
  );
}
