"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { useMobileCardTap } from "@/hooks/use-mobile-card-tap";
import type { Technology } from "@/lib/technologies-data";
import { cn } from "@/lib/utils";

interface BlockTheme {
  badge: string;
  glow: string;
  glowActive: string;
  ring: string;
  line: string;
  abbr: string;
  spotlight: string;
  border: string;
  borderActive: string;
}

const blockThemes: BlockTheme[] = [
  {
    badge: "border-sky-500/25 bg-sky-500/10 text-sky-300",
    glow: "group-hover:shadow-[0_0_40px_rgba(14,165,233,0.22)]",
    glowActive: "shadow-[0_0_40px_rgba(14,165,233,0.22)]",
    ring: "from-sky-500/30 via-sky-400/10 to-transparent",
    line: "bg-sky-400",
    abbr: "text-sky-300",
    spotlight: "rgba(14,165,233,0.15)",
    border: "border-sky-500/20",
    borderActive: "border-sky-500/40",
  },
  {
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-300",
    glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.22)]",
    glowActive: "shadow-[0_0_40px_rgba(139,92,246,0.22)]",
    ring: "from-violet-500/30 via-violet-400/10 to-transparent",
    line: "bg-violet-400",
    abbr: "text-violet-300",
    spotlight: "rgba(139,92,246,0.15)",
    border: "border-violet-500/20",
    borderActive: "border-violet-500/40",
  },
  {
    badge: "border-red-500/25 bg-red-500/10 text-red-300",
    glow: "group-hover:shadow-[0_0_40px_rgba(239,68,68,0.22)]",
    glowActive: "shadow-[0_0_40px_rgba(239,68,68,0.22)]",
    ring: "from-red-500/30 via-red-400/10 to-transparent",
    line: "bg-red-400",
    abbr: "text-red-300",
    spotlight: "rgba(239,68,68,0.15)",
    border: "border-red-500/20",
    borderActive: "border-red-500/40",
  },
  {
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.22)]",
    glowActive: "shadow-[0_0_40px_rgba(16,185,129,0.22)]",
    ring: "from-emerald-500/30 via-emerald-400/10 to-transparent",
    line: "bg-emerald-400",
    abbr: "text-emerald-300",
    spotlight: "rgba(16,185,129,0.15)",
    border: "border-emerald-500/20",
    borderActive: "border-emerald-500/40",
  },
];

function getBlockTheme(index: number): BlockTheme {
  const blockIndex = Math.floor(index / 3);
  return blockThemes[Math.min(blockIndex, blockThemes.length - 1)];
}

interface TechCardProps {
  tech: Technology;
  index: number;
  className?: string;
}

export function TechCard({ tech, index, className }: TechCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const isCoarse = useCoarsePointer();
  const { isTapped, toggleTap, tapProps } = useMobileCardTap();
  const theme = getBlockTheme(index);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const isHighlighted = isCoarse ? isTapped : isHovered;

  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 24,
  });

  const mobileRotateX = useSpring(0, { stiffness: 260, damping: 22 });
  const mobileRotateY = useSpring(0, { stiffness: 260, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${spotX}px ${spotY}px, ${theme.spotlight}, transparent 68%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleLeave = () => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  const handleMobileTap = (e: React.MouseEvent<HTMLElement>) => {
    if (!isCoarse) return;

    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
    mobileRotateX.set(isTapped ? 0 : -4);
    mobileRotateY.set(isTapped ? 0 : 4);
    toggleTap();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 36, scale: 0.96 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 36, scale: 0.96 }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
      className={cn("h-full", className)}
    >
      <motion.article
        onMouseMove={handleMove}
        onMouseEnter={() => !isCoarse && setIsHovered(true)}
        onMouseLeave={handleLeave}
        onClick={handleMobileTap}
        role={tapProps.role}
        aria-pressed={tapProps["aria-pressed"]}
        tabIndex={tapProps.tabIndex}
        onKeyDown={tapProps.onKeyDown}
        style={
          isCoarse
            ? {
                rotateX: mobileRotateX,
                rotateY: mobileRotateY,
                transformStyle: "preserve-3d",
              }
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        animate={isCoarse ? { scale: isTapped ? 1.02 : 1 } : undefined}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border bg-zinc-950/60 backdrop-blur-xl transition-all duration-500",
          theme.border,
          !isCoarse && theme.glow,
          isCoarse && "cursor-pointer select-none touch-manipulation",
          isHighlighted && isCoarse && theme.glowActive,
          isHighlighted && isCoarse && theme.borderActive,
          isHovered && !isCoarse && "border-opacity-60",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
            theme.ring,
            isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        />

        <motion.div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          style={{ background: spotlight }}
        />

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl transition-all duration-500",
            isHighlighted ? "bg-white/[0.04]" : "group-hover:bg-white/[0.04]",
          )}
        />

        <div className="relative flex h-full min-h-[180px] flex-col p-5 sm:min-h-[210px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              animate={
                isHighlighted ? { scale: 1.06, y: -3 } : { scale: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                theme.abbr,
              )}
            >
              {tech.abbr}
            </motion.div>

            <span
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest",
                theme.badge,
              )}
            >
              {tech.category}
            </span>
          </div>

          <div className="mt-6 flex-1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-white">
              {tech.name}
            </h3>

            <div className="relative mt-3 h-px w-full overflow-hidden bg-zinc-800/80">
              <motion.div
                className={cn("h-full origin-left", theme.line)}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: isInView ? (isHighlighted ? 1 : 0.3) : 0,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <motion.p
              animate={{ opacity: isHighlighted ? 1 : 0.7 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "mt-4 text-sm leading-relaxed transition-colors duration-300",
                isHighlighted
                  ? "text-zinc-400"
                  : "text-zinc-500 group-hover:text-zinc-400",
              )}
            >
              {tech.description}
            </motion.p>
          </div>

          <div
            className={cn(
              "mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300",
              isHighlighted
                ? "text-zinc-500"
                : "text-zinc-600 group-hover:text-zinc-500",
            )}
          >
            <span
              className={cn(
                "h-1 w-1 rounded-full transition-transform duration-300",
                theme.line,
                isHighlighted ? "scale-150" : "group-hover:scale-150",
              )}
            />
            Stack certificado
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
