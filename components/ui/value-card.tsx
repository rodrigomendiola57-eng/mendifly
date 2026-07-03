"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import type { ValueProp } from "@/lib/value-props-data";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  item: ValueProp;
  index: number;
  active?: boolean;
}

export function ValueCard({ item, index, active = false }: ValueCardProps) {
  const isCoarse = useCoarsePointer();

  // 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 22 });

  // spotlight
  const [spot, setSpot] = useState({ x: 50, y: 30 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isCoarse) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);
    setSpot({ x: x * 100, y: y * 100 });
  }, [isCoarse, mouseX, mouseY]);

  const handleLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
    setHovered(false);
  }, [mouseX, mouseY]);

  const on = hovered || active;

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseEnter={() => !isCoarse && setHovered(true)}
      onMouseLeave={handleLeave}
      style={isCoarse ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      animate={isCoarse ? { opacity: active ? 1 : 0.82 } : { scale: active ? 1.02 : 1 }}
      transition={
        isCoarse
          ? { duration: 0.2, ease: "easeOut" }
          : { type: "spring", stiffness: 260, damping: 22 }
      }
      className={cn(
        "relative flex min-h-[360px] w-full flex-col overflow-hidden rounded-[2rem] md:min-h-[480px]",
        "bg-gradient-to-b from-white/[0.045] via-zinc-900/35 to-zinc-950/70 backdrop-blur-md md:backdrop-blur-2xl",
        "ring-1 ring-cyan-500/10",
        "transition-shadow duration-500",
        on && isCoarse
          ? "shadow-[0_0_28px_rgba(6,182,212,0.18),0_18px_40px_rgba(0,0,0,0.35)] ring-cyan-400/20"
          : on
            ? "shadow-[0_0_60px_rgba(6,182,212,0.32),0_0_100px_rgba(59,130,246,0.12),0_32px_64px_rgba(0,0,0,0.5)] ring-cyan-400/25"
            : "shadow-[0_0_30px_rgba(6,182,212,0.14),0_20px_48px_rgba(0,0,0,0.35)]",
      )}
    >
      {/* Top accent gradient bar */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
        animate={{
          background: on
            ? "linear-gradient(90deg, transparent, #22d3ee 30%, #3b82f6 60%, transparent)"
            : "linear-gradient(90deg, transparent, rgba(6,182,212,0.25) 50%, transparent)",
        }}
        transition={{ duration: isCoarse ? 0.2 : 0.4 }}
      />

      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${spot.x}% ${spot.y}%, rgba(6,182,212,0.18) 0%, transparent 70%)`,
          transition: "opacity 0.3s",
        }}
      />

      {/* Bottom glow blob */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full blur-3xl"
        animate={
          isCoarse
            ? { opacity: on ? 0.32 : 0.12, scale: 1 }
            : { opacity: on ? 0.55 : 0.2, scale: on ? 1.2 : 1 }
        }
        transition={{ duration: isCoarse ? 0.2 : 0.5 }}
        style={{ background: "rgba(6,182,212,0.4)" }}
      />

      {/* Scan line on mount */}
      {!isCoarse && (
        <motion.div
          aria-hidden
          initial={{ top: 0, opacity: 0.9 }}
          animate={{ top: "110%", opacity: 0 }}
          transition={{ duration: 1.1, delay: index * 0.1 + 0.1, ease: "linear" }}
          className="pointer-events-none absolute inset-x-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
        />
      )}

      {/* Corner brackets */}
      {[
        "top-3 left-3",
        "top-3 right-3 rotate-90",
        "bottom-3 left-3 -rotate-90",
        "bottom-3 right-3 rotate-180",
      ].map((pos, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute ${pos} h-5 w-5`}
          animate={{ opacity: on ? 1 : 0.25 }}
          transition={{ duration: isCoarse ? 0.2 : 0.3 }}
        >
          <div className="absolute left-0 top-0 h-[1.5px] w-4 bg-cyan-400/70" />
          <div className="absolute left-0 top-0 h-4 w-[1.5px] bg-cyan-400/70" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-7 md:p-8">
        {/* Minimal technical marker */}
        <motion.div
          animate={
            isCoarse
              ? { opacity: on ? 1 : 0.82 }
              : on
                ? { opacity: 1, x: 0 }
                : { opacity: 0.78, x: 0 }
          }
          transition={
            isCoarse
              ? { duration: 0.2, ease: "easeOut" }
              : { duration: 0.25, ease: "easeOut" }
          }
          className="flex items-center gap-3"
        >
          <span
            className={cn(
              "font-mono text-[0.65rem] tracking-[0.28em]",
              on ? "text-cyan-300" : "text-cyan-500/60",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-px flex-1 bg-gradient-to-r transition-opacity duration-300",
              on
                ? "from-cyan-400/80 via-blue-400/45 to-transparent opacity-100"
                : "from-cyan-500/30 to-transparent opacity-60",
            )}
          />
        </motion.div>

        {/* Title */}
        <h3 className="mt-7 font-display text-2xl font-light leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl">
          {item.title}
        </h3>

        {/* Divider */}
        <motion.div
          className="mt-4 h-px w-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: isCoarse ? 0.2 : 0.6,
            delay: isCoarse ? 0 : index * 0.08 + 0.3,
          }}
          style={{
            background: "linear-gradient(90deg, rgba(6,182,212,0.55), transparent)",
          }}
        />

        {/* Description */}
        <motion.p
          className={cn(
            "mt-5 flex-1 text-[0.95rem] font-light leading-relaxed tracking-[-0.01em] transition-colors duration-300 md:text-base",
            on ? "text-zinc-300" : "text-zinc-500",
          )}
        >
          {item.description}
        </motion.p>
      </div>
    </motion.div>
  );
}
