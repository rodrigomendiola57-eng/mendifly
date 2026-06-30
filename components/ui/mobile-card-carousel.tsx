"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const SWIPE_OFFSET = 36;
const SWIPE_VELOCITY = 280;

interface MobileCardCarouselProps {
  children: ReactNode[];
  desktopClassName: string;
  ariaLabel: string;
  getDesktopItemClassName?: (index: number) => string | undefined;
}

export function MobileCardCarousel({
  children,
  desktopClassName,
  ariaLabel,
  getDesktopItemClassName,
}: MobileCardCarouselProps) {
  const count = children.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
      next();
      return;
    }

    if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      prev();
    }
  };

  const slideOffset = direction * 72;

  return (
    <>
      <div
        className="relative md:hidden"
        role="region"
        aria-roledescription="carrusel"
        aria-label={ariaLabel}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-1/2 z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-[calc(50%+1px)] z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-violet-500/15 to-transparent"
        />

        <div className="relative z-[1] overflow-hidden" style={{ perspective: 1200 }}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="touch-pan-y"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: slideOffset,
                  scale: 0.9,
                  rotateY: direction * -12,
                  filter: "blur(14px)",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotateY: 0,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  x: -slideOffset,
                  scale: 0.9,
                  rotateY: direction * 12,
                  filter: "blur(14px)",
                }}
                transition={{ duration: 0.48, ease }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full"
              >
                {children[index]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            aria-label="Tarjeta anterior"
            onClick={prev}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-950/60 text-zinc-500 backdrop-blur-sm transition-colors active:border-cyan-500/30 active:text-cyan-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="relative h-[3px] overflow-hidden rounded-full bg-zinc-900">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 shadow-[0_0_16px_rgba(6,182,212,0.45)]"
                animate={{ width: `${((index + 1) / count) * 100}%` }}
                transition={{ duration: 0.45, ease }}
              />
              <motion.div
                className="absolute inset-y-0 w-8 rounded-full bg-white/40 blur-sm"
                animate={{ left: `calc(${((index + 1) / count) * 100}% - 1rem)` }}
                transition={{ duration: 0.45, ease }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              <span className="text-cyan-500/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-zinc-700">/</span>
              <span>{String(count).padStart(2, "0")}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Siguiente tarjeta"
            onClick={next}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-950/60 text-zinc-500 backdrop-blur-sm transition-colors active:border-violet-500/30 active:text-violet-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={cn("hidden md:grid", desktopClassName)}>
        {children.map((child, childIndex) => (
          <div
            key={childIndex}
            className={cn("h-full", getDesktopItemClassName?.(childIndex))}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
