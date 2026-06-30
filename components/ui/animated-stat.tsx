"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface AnimatedStatProps {
  value: string;
  label: string;
  className?: string;
  delay?: number;
}

function parseStatValue(raw: string) {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: raw, decimals: 0 };
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, target: parseFloat(num), suffix, decimals };
}

export function AnimatedStat({
  value,
  label,
  className,
  delay = 0,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  // once: false → el contador vuelve a correr cada vez que entra en vista
  const isInView = useInView(ref, { once: false, margin: "-60px" });
  const [display, setDisplay] = useState(value);
  const [active, setActive] = useState(false); // hover (desktop) or tap (mobile)
  const parsed = parseStatValue(value);

  // ── counter — se reinicia cada vez que entra en vista ──────────────────────
  useEffect(() => {
    if (!isInView) {
      // Reset al salir para que arranque desde 0 la próxima vez
      if (parsed.target !== 0) setDisplay(`${parsed.prefix}0${parsed.suffix}`);
      return;
    }
    if (parsed.target === 0) return;
    const duration = 1800;
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(
        `${parsed.prefix}${(parsed.target * eased).toFixed(parsed.decimals)}${parsed.suffix}`,
      );
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, parsed.prefix, parsed.suffix, parsed.target, parsed.decimals]);

  // ── spinning ring ──────────────────────────────────────────────────────────
  const rotate = useMotionValue(0);
  const smoothRotate = useSpring(rotate, { stiffness: 40, damping: 12 });

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let rafId: number;
    const spin = (now: number) => {
      rotate.set((now - start) * 0.2);
      rafId = requestAnimationFrame(spin);
    };
    rafId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafId);
  }, [active, rotate]);

  // ── tap handler (mobile) ───────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    setActive(true);
    setTimeout(() => setActive(false), 900);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.88 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex flex-col items-center gap-3 sm:gap-4", className)}
    >
      {/* ── Circle ── */}
      <motion.div
        className="group relative flex aspect-square w-full max-w-[160px] sm:max-w-[200px] md:max-w-[220px] cursor-default select-none items-center justify-center"
        onHoverStart={() => setActive(true)}
        onHoverEnd={() => setActive(false)}
        onTap={handleTap}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        {/* Glow behind circle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={
            active
              ? {
                  boxShadow:
                    "0 0 36px rgba(6,182,212,0.38), 0 0 70px rgba(139,92,246,0.22)",
                }
              : {
                  boxShadow:
                    "0 0 14px rgba(6,182,212,0.09), 0 0 24px rgba(139,92,246,0.06)",
                }
          }
          transition={{ duration: 0.35 }}
        />

        {/* Spinning conic-gradient ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, #06b6d4 20%, #8b5cf6 45%, transparent 65%)",
            rotate: smoothRotate,
          }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.28 }}
        />

        {/* Static ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/10"
          animate={{ opacity: active ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Inner background disc — masks conic ring to show only the border */}
        <div className="absolute inset-[3px] rounded-full bg-[#050505]" />

        {/* Inner radial highlight on active */}
        <motion.div
          className="absolute inset-[3px] rounded-full"
          animate={
            active
              ? {
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.07) 55%, rgba(0,0,0,0) 75%)",
                }
              : {
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(6,182,212,0) 0%, rgba(139,92,246,0) 55%, rgba(0,0,0,0) 75%)",
                }
          }
          transition={{ duration: 0.3 }}
        />

        {/* Number only — centered in circle */}
        <motion.p
          className="relative z-10 font-display font-bold tracking-tight text-white
                     text-2xl sm:text-3xl md:text-4xl"
          animate={active ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {display}
        </motion.p>
      </motion.div>

      {/* Label below the circle — all sizes, big and prominent */}
      <motion.p
        className="text-center font-display font-semibold leading-snug
                   text-sm sm:text-base md:text-lg
                   tracking-wide"
        animate={{
          color: active ? "#67e8f9" : "rgba(255,255,255,0.85)",
        }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
