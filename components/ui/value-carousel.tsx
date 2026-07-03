"use client";

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  type PanInfo,
} from "framer-motion";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { cn } from "@/lib/utils";

const GAP = 24;
const MOBILE_GAP = 16;

function getCardWidth() {
  if (typeof window === "undefined") return 320;
  const w = window.innerWidth;
  if (w >= 1024) return 400;
  if (w >= 640) return 360;
  return Math.min(w - 48, 320); // full-width with padding on small screens
}

interface ValueCarouselProps {
  children: ReactNode[];
  ariaLabel?: string;
  activeIndex?: number;
  onActiveChange?: (i: number) => void;
}

export function ValueCarousel({
  children,
  ariaLabel = "Carrusel",
  activeIndex: externalActive,
  onActiveChange,
}: ValueCarouselProps) {
  const count = children.length;
  const isCoarse = useCoarsePointer();
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileScrollTimerRef = useRef<number | null>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const active = externalActive ?? current;

  const setActive = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(count - 1, i));
      setCurrent(clamped);
      onActiveChange?.(clamped);
    },
    [count, onActiveChange],
  );

  // Track container + card sizes
  useEffect(() => {
    const update = () => {
      setCardWidth(getCardWidth());
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Center offset for card at index i:
  // place card center at container center
  const offsetForIndex = useCallback(
    (i: number) => {
      const cardCenter = i * (cardWidth + GAP) + cardWidth / 2;
      return containerWidth / 2 - cardCenter;
    },
    [cardWidth, containerWidth],
  );

  // Snap to active card (centered)
  const snapTo = useCallback(
    (i: number) => {
      controls.start({
        x: offsetForIndex(i),
        transition: { type: "spring", stiffness: 220, damping: 30 },
      });
    },
    [controls, offsetForIndex],
  );

  // Re-snap when active, cardWidth or containerWidth changes
  useEffect(() => {
    if (!isCoarse && containerWidth > 0) snapTo(active);
  }, [active, snapTo, containerWidth, cardWidth, isCoarse]);

  // Find nearest card index from current x position
  const nearestIndex = useCallback(
    (currentX: number) => {
      // Which card center is closest to container center?
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
      const vel = info.velocity.x;
      const currentXVal = x.get();

      // Fast flick → go ±1
      if (vel < -500) {
        setActive(active + 1);
        return;
      }
      if (vel > 500) {
        setActive(active - 1);
        return;
      }

      // Slow drag → find nearest
      const nearest = nearestIndex(currentXVal);
      setActive(nearest);
    },
    [active, x, nearestIndex, setActive],
  );

  const scrollMobileTo = useCallback(
    (i: number, behavior: ScrollBehavior = "smooth") => {
      const clamped = Math.max(0, Math.min(count - 1, i));
      setActive(clamped);
      mobileTrackRef.current?.scrollTo({
        left: clamped * (cardWidth + MOBILE_GAP),
        behavior,
      });
    },
    [cardWidth, count, setActive],
  );

  const updateMobileActiveFromScroll = useCallback(() => {
    const el = mobileTrackRef.current;
    if (!el) return;

    const next = Math.max(
      0,
      Math.min(count - 1, Math.round(el.scrollLeft / (cardWidth + MOBILE_GAP))),
    );

    if (next !== active) setActive(next);
  }, [active, cardWidth, count, setActive]);

  const handleMobileScroll = useCallback(() => {
    if (mobileScrollTimerRef.current) {
      window.clearTimeout(mobileScrollTimerRef.current);
    }

    // No actualizamos estado durante el gesto; solo cuando el scroll descansa.
    mobileScrollTimerRef.current = window.setTimeout(() => {
      updateMobileActiveFromScroll();
    }, 120);
  }, [updateMobileActiveFromScroll]);

  useEffect(() => {
    return () => {
      if (mobileScrollTimerRef.current) {
        window.clearTimeout(mobileScrollTimerRef.current);
      }
    };
  }, []);

  // Drag bounds: first and last card both perfectly centered
  const minX = offsetForIndex(count - 1);
  const maxX = offsetForIndex(0);

  if (isCoarse) {
    const sidePadding = Math.max((containerWidth - cardWidth) / 2, 0);

    return (
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        role="region"
        aria-label={ariaLabel}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#050505] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#050505] to-transparent"
        />

        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="flex snap-x snap-mandatory items-stretch overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            gap: MOBILE_GAP,
            paddingLeft: sidePadding,
            paddingRight: sidePadding,
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="shrink-0 snap-center"
              style={{ width: cardWidth }}
            >
              {child}
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollMobileTo(active - 1)}
              disabled={active === 0}
              className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-300 transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Beneficio anterior"
            >
              ←
            </button>

            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-600">
              <span className="text-cyan-400/90">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-zinc-700">/</span>
              <span>{String(count).padStart(2, "0")}</span>
            </p>

            <button
              type="button"
              onClick={() => scrollMobileTo(active + 1)}
              disabled={active === count - 1}
              className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-300 transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Siguiente beneficio"
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Tarjeta ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => scrollMobileTo(i)}
                className="relative h-1.5 overflow-hidden rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                style={{ width: i === active ? 28 : 8 }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-full transition-colors duration-200",
                    i === active
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                      : "bg-zinc-700",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      role="region"
      aria-label={ariaLabel}
    >
      {/* Fade edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050505] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050505] to-transparent"
      />

      {/* Draggable track */}
      <motion.div
        drag="x"
        dragConstraints={{ left: minX, right: maxX }}
        dragElastic={0.06}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="flex cursor-grab touch-pan-y select-none items-stretch active:cursor-grabbing"
      >
        {children.map((child, i) => (
          <motion.div
            key={i}
            className="shrink-0"
            style={{
              width: cardWidth,
              marginRight: i < count - 1 ? GAP : 0,
            }}
            animate={{
              opacity: i === active ? 1 : 0.4,
              scale: i === active ? 1 : 0.93,
              filter: i === active ? "blur(0px)" : "blur(1.5px)",
            }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={() => setActive(i)}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {/* Dot pills */}
        <div className="flex items-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Tarjeta ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => setActive(i)}
              className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              style={{ width: i === active ? 28 : 8 }}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-full transition-colors duration-300",
                  i === active
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                    : "bg-zinc-700 hover:bg-zinc-500",
                )}
              />
            </button>
          ))}
        </div>

        {/* Counter */}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-600">
          <span className="text-cyan-400/90">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 text-zinc-700">/</span>
          <span>{String(count).padStart(2, "0")}</span>
        </p>
      </div>
    </div>
  );
}
