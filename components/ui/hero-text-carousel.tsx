"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ShimmerText } from "@/components/ui/shimmer-text";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { heroSlides, type HeroSlide } from "@/lib/hero-slides";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const INTERVAL_MS = 5500;
const SWIPE_OFFSET = 36;
const SWIPE_VELOCITY = 220;
const WHEEL_COOLDOWN_MS = 700;

const titleClassName =
  "font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-white min-[380px]:text-[2rem] sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-7xl";

const subtitleClassName =
  "mt-3 max-w-2xl text-lg leading-relaxed text-zinc-100 sm:mt-6 sm:text-base sm:leading-relaxed sm:text-zinc-400 md:mt-8 md:text-lg";

function HeroSlideCopy({ slide }: { slide: HeroSlide }) {
  return (
    <>
      <h1 className={titleClassName}>
        <span className="inline">{slide.line1} </span>
        <span className="inline-block">
          <ShimmerText>{slide.highlight}</ShimmerText>
        </span>
        {slide.line2 && (
          <span className="mt-1 block sm:mt-0 sm:inline sm:ml-[0.15em]">
            {slide.line2}
          </span>
        )}
      </h1>
      <p className={subtitleClassName}>{slide.subtitle}</p>
    </>
  );
}

function createSlideVariants(isCoarse: boolean): Variants {
  const blurIn = isCoarse ? "blur(0px)" : "blur(14px)";
  const blurOut = isCoarse ? "blur(0px)" : "blur(10px)";

  return {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir * (isCoarse ? 40 : 64),
      y: isCoarse ? 12 : 24,
      scale: 0.94,
      rotateX: dir * (isCoarse ? 0 : 10),
      filter: blurIn,
      clipPath: isCoarse ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      clipPath: "inset(0 0% 0 0)",
      transition: {
        duration: isCoarse ? 0.45 : 0.62,
        ease,
        opacity: { duration: 0.35 },
        clipPath: { duration: 0.55, ease },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir * (isCoarse ? -32 : -56),
      y: isCoarse ? -8 : -18,
      scale: 0.97,
      rotateX: dir * (isCoarse ? 0 : -8),
      filter: blurOut,
      clipPath: isCoarse ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
      transition: { duration: isCoarse ? 0.32 : 0.4, ease },
    }),
  };
}

function createStaggerVariants(isCoarse: boolean): {
  container: Variants;
  item: Variants;
  subtitle: Variants;
} {
  const blurIn = isCoarse ? "blur(0px)" : "blur(10px)";

  return {
    container: {
      enter: {
        transition: { staggerChildren: 0.07, delayChildren: 0.06 },
      },
      center: {
        transition: { staggerChildren: 0.09, delayChildren: 0.04 },
      },
      exit: {
        transition: { staggerChildren: 0.04, staggerDirection: -1 },
      },
    },
    item: {
      enter: (dir: number) => ({
        opacity: 0,
        y: 22,
        x: dir * 16,
        filter: blurIn,
      }),
      center: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease },
      },
      exit: (dir: number) => ({
        opacity: 0,
        y: -14,
        x: dir * -12,
        filter: blurIn,
        transition: { duration: 0.28, ease },
      }),
    },
    subtitle: {
      enter: (dir: number) => ({
        opacity: 0,
        y: 18,
        x: dir * 10,
        filter: blurIn,
      }),
      center: {
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.52, ease, delay: 0.08 },
      },
      exit: {
        opacity: 0,
        y: -10,
        filter: blurIn,
        transition: { duration: 0.25, ease },
      },
    },
  };
}

export function HeroTextCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const lastWheelRef = useRef(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCoarse = useCoarsePointer();
  const slideVariants = createSlideVariants(isCoarse);
  const { container, item, subtitle } = createStaggerVariants(isCoarse);

  // Altura mínima estable en SSR/hidratación para evitar saltos de scroll en Safari
  const carouselMinHeight = viewportHeight ?? 220;

  useLayoutEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl) return;

    const updateHeight = () => {
      const slides = measureEl.querySelectorAll<HTMLElement>("[data-slide-measure]");
      if (!slides.length) return;

      const maxHeight = Math.max(
        ...Array.from(slides, (slide) => slide.getBoundingClientRect().height),
      );

      setViewportHeight(Math.ceil(maxHeight));
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(measureEl);

    return () => ro.disconnect();
  }, [isCoarse]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setPaused(false), 8000);
  }, []);

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setActive((index + heroSlides.length) % heroSlides.length);
      pauseTemporarily();
    },
    [pauseTemporarily],
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  useEffect(() => {
    if (isCoarse) return;

    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 12) return;

      const now = Date.now();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) return;
      lastWheelRef.current = now;

      e.preventDefault();
      if (delta > 0) {
        setDirection(1);
        setActive((p) => (p + 1) % heroSlides.length);
      } else {
        setDirection(-1);
        setActive((p) => (p - 1 + heroSlides.length) % heroSlides.length);
      }
      pauseTemporarily();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [pauseTemporarily, isCoarse]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
      setDirection(1);
      setActive((p) => (p + 1) % heroSlides.length);
      pauseTemporarily();
      return;
    }

    if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      setDirection(-1);
      setActive((p) => (p - 1 + heroSlides.length) % heroSlides.length);
      pauseTemporarily();
    }
  };

  const slide = heroSlides[active];

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ perspective: 1200 }}
      >
        <div
          aria-hidden
          ref={measureRef}
          className="pointer-events-none invisible absolute left-0 top-0 -z-10 w-full"
        >
          {heroSlides.map((item) => (
            <div key={item.id} data-slide-measure className="w-full">
              <HeroSlideCopy slide={item} />
            </div>
          ))}
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{ minHeight: carouselMinHeight }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-x-0 top-0 w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {!isCoarse && (
                <motion.div
                  aria-hidden
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: "220%", opacity: [0, 0.85, 0] }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-y-[-20%] left-0 z-20 w-[45%] skew-x-[-12deg] bg-gradient-to-r from-transparent via-cyan-400/20 to-violet-500/10 blur-[1px]"
                />
              )}

              <motion.div
                variants={container}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                className="relative z-10"
              >
                <h1 className={titleClassName}>
                  <motion.span
                    variants={item}
                    custom={direction}
                    className="inline"
                  >
                    {slide.line1}{" "}
                  </motion.span>
                  <motion.span
                    variants={item}
                    custom={direction}
                    className="inline-block"
                  >
                    <ShimmerText>{slide.highlight}</ShimmerText>
                  </motion.span>
                  {slide.line2 && (
                    <motion.span
                      variants={item}
                      custom={direction}
                      className="mt-1 block sm:mt-0 sm:inline sm:ml-[0.15em]"
                    >
                      {slide.line2}
                    </motion.span>
                  )}
                </h1>

                <motion.p
                  variants={subtitle}
                  custom={direction}
                  className={subtitleClassName}
                >
                  {slide.subtitle}
                </motion.p>
              </motion.div>

              {!isCoarse && (
                <motion.div
                  aria-hidden
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 0.7, 0.25] }}
                  transition={{ duration: 0.55, ease, delay: 0.1 }}
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-gradient-to-r from-cyan-400/60 via-violet-400/40 to-transparent"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-5 flex justify-center sm:mt-6 sm:justify-between sm:gap-4">
        <div className="flex items-center justify-center gap-2.5">
          {heroSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir al mensaje ${index + 1}: ${item.highlight}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => goTo(index, index > active ? 1 : -1)}
              className="flex min-h-10 min-w-10 items-center justify-center sm:min-h-11 sm:min-w-11"
            >
              <motion.span
                layout
                className={cn(
                  "block h-1.5 rounded-full",
                  active === index
                    ? "bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_10px_rgba(6,182,212,0.45),0_0_14px_rgba(139,92,246,0.35)]"
                    : "bg-zinc-800",
                )}
                animate={{
                  width: active === index ? (isCoarse ? 36 : 40) : 16,
                }}
                transition={{ duration: 0.45, ease }}
              />
            </button>
          ))}
        </div>

        <p className="hidden items-center gap-1.5 text-xs text-zinc-600 sm:flex">
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Scroll o desliza</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </p>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          aria-label="Mensaje anterior"
          onClick={() => {
            prev();
            pauseTemporarily();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors active:border-violet-500/30 active:text-violet-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs text-zinc-600">Desliza</span>
        <button
          type="button"
          aria-label="Siguiente mensaje"
          onClick={() => {
            next();
            pauseTemporarily();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors active:border-violet-500/30 active:text-violet-400"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
