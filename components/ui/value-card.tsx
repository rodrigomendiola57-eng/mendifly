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
  const Icon = item.icon;

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
      animate={{ scale: active ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "relative flex min-h-[480px] w-full flex-col overflow-hidden rounded-3xl",
        "bg-gradient-to-b from-cyan-950/35 via-zinc-900/45 to-zinc-950/75 backdrop-blur-2xl",
        "ring-1 ring-cyan-500/10",
        "transition-shadow duration-500",
        on
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
        transition={{ duration: 0.4 }}
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
        animate={{ opacity: on ? 0.55 : 0.2, scale: on ? 1.2 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ background: "rgba(6,182,212,0.4)" }}
      />

      {/* Scan line on mount */}
      <motion.div
        aria-hidden
        initial={{ top: 0, opacity: 0.9 }}
        animate={{ top: "110%", opacity: 0 }}
        transition={{ duration: 1.1, delay: index * 0.1 + 0.1, ease: "linear" }}
        className="pointer-events-none absolute inset-x-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"
      />

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
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 h-[1.5px] w-4 bg-cyan-400/70" />
          <div className="absolute left-0 top-0 h-4 w-[1.5px] bg-cyan-400/70" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col p-7">
        {/* Icon */}
        <motion.div
          animate={on ? { scale: 1.12, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 20 }}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "bg-cyan-500/12 text-cyan-400",
            "ring-1 ring-cyan-500/30 transition-all duration-400",
            on && "bg-cyan-500/20 ring-cyan-400/50 shadow-[0_0_32px_rgba(6,182,212,0.45)]",
          )}
        >
          {on && (
            <motion.div
              aria-hidden
              initial={{ scale: 0.7, opacity: 0.7 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl bg-cyan-500/25"
            />
          )}
          <Icon className="relative z-10 h-6 w-6" strokeWidth={1.5} />
        </motion.div>

        {/* Number tag */}
        <motion.span
          className="mt-6 font-mono text-[0.65rem] tracking-[0.25em] text-cyan-500/60"
          animate={{ color: on ? "rgba(34,211,238,0.95)" : "rgba(6,182,212,0.5)" }}
          transition={{ duration: 0.3 }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Title */}
        <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {item.title}
        </h3>

        {/* Divider */}
        <motion.div
          className="mt-4 h-px w-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
          style={{
            background: "linear-gradient(90deg, rgba(6,182,212,0.55), transparent)",
          }}
        />

        {/* Description */}
        <motion.p
          className={cn(
            "mt-5 flex-1 text-[0.9rem] leading-relaxed transition-colors duration-300",
            on ? "text-zinc-300" : "text-zinc-500",
          )}
        >
          {item.description}
        </motion.p>

        {/* Bottom CTA arrow */}
        <motion.div
          className="mt-6 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-cyan-500/50"
          animate={{ x: on ? 6 : 0, color: on ? "rgba(34,211,238,0.9)" : "rgba(6,182,212,0.45)" }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          <span>Explorar</span>
          <span aria-hidden>→</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
