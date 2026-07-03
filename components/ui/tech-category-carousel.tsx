"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { Carousel } from "@/components/ui/carousel";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { TechLogo } from "@/components/ui/tech-logo";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import type { TechCategoryGroup } from "@/lib/technologies-data";
import { cn } from "@/lib/utils";

const categoryAccents = [
  {
    badge: "border-sky-500/20 bg-sky-500/[0.06] text-sky-300",
    titleGradient: "from-sky-300 via-cyan-200 to-sky-400",
    line: "from-sky-500/50 via-cyan-400/30 to-transparent",
  },
  {
    badge: "border-violet-500/20 bg-violet-500/[0.06] text-violet-300",
    titleGradient: "from-violet-300 via-fuchsia-200 to-violet-400",
    line: "from-violet-500/50 via-fuchsia-400/30 to-transparent",
  },
  {
    badge: "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300",
    titleGradient: "from-emerald-300 via-teal-200 to-emerald-400",
    line: "from-emerald-500/50 via-teal-400/30 to-transparent",
  },
  {
    badge: "border-amber-500/20 bg-amber-500/[0.06] text-amber-300",
    titleGradient: "from-amber-300 via-orange-200 to-amber-400",
    line: "from-amber-500/50 via-orange-400/30 to-transparent",
  },
];

const categoryHoverGlow = [
  "group-hover:shadow-[0_16px_48px_rgba(14,165,233,0.18),0_0_72px_rgba(6,182,212,0.1)]",
  "group-hover:shadow-[0_16px_48px_rgba(139,92,246,0.2),0_0_72px_rgba(139,92,246,0.12)]",
  "group-hover:shadow-[0_16px_48px_rgba(16,185,129,0.18),0_0_72px_rgba(52,211,153,0.1)]",
  "group-hover:shadow-[0_16px_48px_rgba(245,158,11,0.16),0_0_72px_rgba(251,191,36,0.1)]",
];

const categoryHoverRing = [
  "from-sky-500/20 via-cyan-500/5 to-transparent",
  "from-violet-500/20 via-violet-500/5 to-transparent",
  "from-emerald-500/20 via-emerald-500/5 to-transparent",
  "from-amber-500/20 via-amber-500/5 to-transparent",
];

interface TechCategoryCarouselProps {
  group: TechCategoryGroup;
  themeIndex: number;
  className?: string;
}

export function TechCategoryCarousel({
  group,
  themeIndex,
  className,
}: TechCategoryCarouselProps) {
  const accent = categoryAccents[themeIndex % categoryAccents.length];
  const isCoarse = useCoarsePointer();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [baseWidth, setBaseWidth] = useState(330);
  const [isHovered, setIsHovered] = useState(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [6, -6]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 220,
    damping: 22,
  });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateWidth = () => {
      setBaseWidth(Math.max(280, Math.min(el.clientWidth, 400)));
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = group.items.map((tech, index) => ({
    id: `${group.id}-${index}`,
    title: tech.name,
    description: tech.description,
    icon: <TechLogo name={tech.name} />,
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={cn(
        "group relative mx-auto flex w-full max-w-[400px] flex-col items-center rounded-2xl transition-shadow duration-500",
        categoryHoverGlow[themeIndex % categoryHoverGlow.length],
        className,
      )}
      style={isCoarse ? undefined : { perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{ y: isHovered && !isCoarse ? -8 : 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-[1.15rem] bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100",
          categoryHoverRing[themeIndex % categoryHoverRing.length],
        )}
      />

      <motion.div
        className="relative flex w-full flex-col items-center"
        style={
          isCoarse
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        <header className="mb-5 w-full text-center">
          <h3 className="font-display text-3xl font-light leading-[1.05] tracking-[-0.055em] sm:text-[2.15rem]">
            <ShimmerText className={cn("bg-gradient-to-r bg-clip-text", accent.titleGradient)}>
              {group.title}
            </ShimmerText>
          </h3>

          <div
            aria-hidden
            className={cn(
              "mx-auto mt-3 h-px w-16 bg-gradient-to-r",
              accent.line,
            )}
          />

          <p
            className={cn(
              "mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-[8px] uppercase tracking-[0.22em] sm:text-[9px]",
              accent.badge,
            )}
          >
            {group.hint}
          </p>
        </header>

        <div className="flex w-full justify-center">
          <Carousel
            items={items}
            baseWidth={baseWidth}
            loop
            themeIndex={themeIndex}
            isHovered={isHovered}
          />
        </div>

        <p
          className={cn(
            "mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 sm:text-[10px]",
            isHovered ? "text-zinc-500" : "text-zinc-600",
          )}
        >
          drag · scroll · navigate
        </p>
      </motion.div>
    </motion.div>
  );
}
