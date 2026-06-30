"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PricingCard } from "@/components/ui/pricing-card";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { pricingPlans } from "@/lib/pricing-data";

const GAP = 16;
const SWIPE_VELOCITY = 80;
const SWIPE_DISTANCE_RATIO = 0.12;

function getCardWidth(containerWidth: number) {
  return Math.min(containerWidth - 48, 320);
}

function resolveNextIndex(
  info: PanInfo,
  active: number,
  cardWidth: number,
  currentX: number,
  nearestIndex: (x: number) => number,
  count: number,
): number {
  const distThreshold = Math.max(36, cardWidth * SWIPE_DISTANCE_RATIO);

  if (info.velocity.x < -SWIPE_VELOCITY || info.offset.x < -distThreshold) {
    return Math.min(count - 1, active + 1);
  }
  if (info.velocity.x > SWIPE_VELOCITY || info.offset.x > distThreshold) {
    return Math.max(0, active - 1);
  }

  return nearestIndex(currentX);
}

export function PricingCarousel() {
  const hydrated = useHydrated();
  const count = pricingPlans.length;
  const [active, setActive] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const x = useMotionValue(0);
  const controls = useAnimation();

  activeRef.current = active;

  const setActiveClamped = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(count - 1, i))),
    [count],
  );

  useEffect(() => {
    if (!hydrated) return;

    const update = () => {
      const w = containerRef.current?.clientWidth ?? 0;
      setContainerWidth(w);
      if (w > 0) setCardWidth(getCardWidth(w));
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [hydrated]);

  const offsetForIndex = useCallback(
    (i: number) => {
      if (containerWidth <= 0) return 0;
      const cardCenter = i * (cardWidth + GAP) + cardWidth / 2;
      return containerWidth / 2 - cardCenter;
    },
    [cardWidth, containerWidth],
  );

  const snapTo = useCallback(
    (i: number, immediate = false) => {
      const target = offsetForIndex(i);
      x.set(target);
      return controls.start({
        x: target,
        transition: immediate
          ? { duration: 0 }
          : { type: "spring", stiffness: 340, damping: 34, mass: 0.85 },
      });
    },
    [controls, offsetForIndex, x],
  );

  useEffect(() => {
    if (!hydrated || containerWidth <= 0) return;
    void snapTo(active);
  }, [active, snapTo, containerWidth, cardWidth, hydrated]);

  const nearestIndex = useCallback(
    (currentX: number) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const dist = Math.abs(currentX - offsetForIndex(i));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    },
    [count, offsetForIndex],
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (containerWidth <= 0) return;

      const currentX = x.get();
      const currentActive = activeRef.current;
      const next = resolveNextIndex(
        info,
        currentActive,
        cardWidth,
        currentX,
        nearestIndex,
        count,
      );

      if (next !== currentActive) {
        setActiveClamped(next);
      } else {
        void snapTo(next);
      }
    },
    [cardWidth, containerWidth, count, nearestIndex, setActiveClamped, snapTo, x],
  );

  const minX = offsetForIndex(count - 1);
  const maxX = offsetForIndex(0);
  const progress = ((active + 1) / count) * 100;
  const activePlan = pricingPlans[active];

  if (!hydrated) {
    return (
      <div
        ref={containerRef}
        className="min-h-[460px] animate-pulse rounded-2xl border border-zinc-800/50 bg-zinc-900/20"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="relative w-full"
      role="region"
      aria-label="Planes de inversión"
      aria-roledescription="carrusel"
    >
      <div className="mb-6 px-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500">
            Plan activo
          </p>
          <p className="font-mono text-[0.65rem] tabular-nums text-violet-400/90">
            {String(active + 1).padStart(2, "0")}
            <span className="text-zinc-600"> / </span>
            {String(count).padStart(2, "0")}
          </p>
        </div>
        <div className="relative h-1 overflow-hidden rounded-full bg-zinc-800/80">
          <motion.div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          />
        </div>
        <motion.p
          key={activePlan.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 truncate font-display text-sm font-semibold text-white"
        >
          {activePlan.name}
        </motion.p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="Plan anterior"
          disabled={active === 0}
          onClick={() => setActiveClamped(active - 1)}
          className={cn(
            "z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            "text-zinc-600 transition-colors duration-200",
            "hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-20",
          )}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div ref={containerRef} className="relative min-w-0 flex-1 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#050505] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#050505] to-transparent"
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-48 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            animate={{
              opacity: activePlan.popular ? 0.45 : 0.25,
              background: activePlan.popular
                ? "rgba(139,92,246,0.35)"
                : "rgba(6,182,212,0.2)",
            }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            drag="x"
            dragConstraints={{ left: minX, right: maxX }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            className="relative z-[1] flex cursor-grab touch-pan-y select-none items-stretch active:cursor-grabbing"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                className="shrink-0"
                style={{
                  width: cardWidth,
                  marginRight: i < count - 1 ? GAP : 0,
                }}
                animate={{
                  opacity: i === active ? 1 : 0.38,
                  scale: i === active ? 1 : 0.92,
                  filter: i === active ? "blur(0px)" : "blur(2px)",
                  y: i === active ? 0 : 8,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                onClick={() => setActiveClamped(i)}
              >
                <PricingCard plan={plan} entrance={false} compact />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          aria-label="Plan siguiente"
          disabled={active === count - 1}
          onClick={() => setActiveClamped(active + 1)}
          className={cn(
            "z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            "text-zinc-600 transition-colors duration-200",
            "hover:text-zinc-300 disabled:pointer-events-none disabled:opacity-20",
          )}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
