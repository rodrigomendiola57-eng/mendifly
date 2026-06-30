"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
  type Transition,
} from "framer-motion";

import { cn } from "@/lib/utils";

import "./carousel.css";

export interface CarouselItemData {
  title: string;
  description: string;
  id: string | number;
  icon: ReactNode;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

interface CarouselItemProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: MotionValue<number>;
  transition: Transition;
  isActive: boolean;
  isCardHovered: boolean;
}

function CarouselItem({
  item,
  index,
  itemWidth,
  trackItemOffset,
  x,
  transition,
  isActive,
  isCardHovered,
}: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      className={cn(
        "carousel-item",
        isCardHovered && isActive && "carousel-item--hovered",
      )}
      style={{
        width: itemWidth,
        height: "100%",
        rotateY,
      }}
      transition={transition}
    >
      <div className="carousel-item-header">
        <motion.span
          className="carousel-icon-container"
          animate={
            isCardHovered && isActive
              ? { scale: 1.08, y: -2 }
              : { scale: 1, y: 0 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {item.icon}
        </motion.span>
      </div>
      <div className="carousel-item-content">
        <motion.div
          className="carousel-item-title"
          animate={
            isCardHovered && isActive ? { scale: 1.02 } : { scale: 1 }
          }
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.title}
        </motion.div>
        <motion.p
          className="carousel-item-description"
          animate={{ opacity: isCardHovered && isActive ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          {item.description}
        </motion.p>
      </div>

      {isCardHovered && isActive && (
        <motion.div
          aria-hidden
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: "220%", opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="carousel-item-shine pointer-events-none absolute inset-y-0 left-0 z-10 w-[40%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}
    </motion.div>
  );
}

export interface CarouselProps {
  items: CarouselItemData[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  themeIndex?: number;
  isHovered?: boolean;
  className?: string;
}

export function Carousel({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  themeIndex = 0,
  isHovered: isHoveredExternal,
  className,
}: CarouselProps) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(() => (loop ? 1 : 0));
  const x = useMotionValue(0);
  const [isHoveredInternal, setIsHoveredInternal] = useState(false);
  const isHovered = isHoveredExternal ?? isHoveredInternal;
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHoveredExternal !== undefined || !containerRef.current) return;

    const container = containerRef.current;
    const handleMouseEnter = () => setIsHoveredInternal(true);
    const handleMouseLeave = () => setIsHoveredInternal(false);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHoveredExternal]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useLayoutEffect(() => {
    x.set(-position * trackItemOffset);
  }, [position, trackItemOffset, x]);

  const effectiveTransition: Transition = isJumping
    ? { duration: 0 }
    : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const maxPosition = Math.max(itemsForRender.length - 1, 0);
  const clampedPosition = loop
    ? position
    : Math.min(Math.max(position, 0), maxPosition);

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1);

  if (items.length === 0) return null;

  return (
    <motion.div
      ref={containerRef}
      data-theme={themeIndex}
      className={cn(
        "carousel-container border border-white/[0.06] bg-zinc-950/30 backdrop-blur-xl transition-colors duration-500",
        isHovered && "carousel-container--hovered",
        className,
      )}
      style={{ width: `${baseWidth}px`, maxWidth: "100%" }}
      animate={{ scale: isHovered ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${clampedPosition * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(clampedPosition * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
            isActive={index === clampedPosition}
            isCardHovered={isHovered}
          />
        ))}
      </motion.div>

      {items.length > 1 && (
        <div className="carousel-indicators-container">
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <motion.button
                type="button"
                key={index}
                className={cn(
                  "carousel-indicator",
                  activeIndex === index ? "active" : "inactive",
                )}
                aria-label={`Ir a ${items[index]?.title ?? `slide ${index + 1}`}`}
                aria-current={activeIndex === index ? "true" : undefined}
                animate={{ scale: activeIndex === index ? 1.05 : 1 }}
                onClick={() => setPosition(loop ? index + 1 : index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
