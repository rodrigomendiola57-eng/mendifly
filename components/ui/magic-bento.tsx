"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap } from "gsap";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { cn } from "@/lib/utils";

import "./magic-bento.css";

const DEFAULT_GLOW_COLOR = "132, 0, 255";
const TOUCH_GLOW_RADIUS = 320;
const TOUCH_CLEAR_DELAY_MS = 450;

export interface MagicBentoConfig {
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest("a, button, input, textarea, select, label")
  );
}

function createParticleElement(x: number, y: number, glowColor: string) {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    background: rgba(${glowColor}, 1);
    box-shadow: 0 0 6px rgba(${glowColor}, 0.6);
  `;
  return el;
}

function calculateSpotlightValues(radius: number) {
  return {
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75,
  };
}

function updateCardGlowProperties(
  card: HTMLElement,
  clientX: number,
  clientY: number,
  glow: number,
  radius: number,
) {
  const rect = card.getBoundingClientRect();
  const relativeX = ((clientX - rect.left) / rect.width) * 100;
  const relativeY = ((clientY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
}

function resetCardGlow(card: HTMLElement) {
  card.style.setProperty("--glow-intensity", "0");
}

export interface MagicBentoSpotlightProps extends MagicBentoConfig {
  gridRef: RefObject<HTMLElement | null>;
  sectionClassName?: string;
}

export function MagicBentoSpotlight({
  gridRef,
  enableSpotlight = true,
  disableAnimations = false,
  spotlightRadius = 510,
  glowColor = DEFAULT_GLOW_COLOR,
  sectionClassName = "bento-section",
}: MagicBentoSpotlightProps) {
  const isCoarse = useCoarsePointer();
  const reducedMotion = useReducedMotion();
  const animationsOff = disableAnimations || reducedMotion;

  useEffect(() => {
    if (animationsOff || !enableSpotlight || !gridRef.current) return;

    const spotlightSize = isCoarse ? 520 : 800;
    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: ${spotlightSize}px;
      height: ${spotlightSize}px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 40;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);

    const getCards = () =>
      gridRef.current?.querySelectorAll<HTMLElement>(".magic-bento-card") ??
      [];

    const clearGlow = () => {
      getCards().forEach(resetCardGlow);
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    const updateFromPointer = (clientX: number, clientY: number) => {
      if (!gridRef.current) return;

      const section = gridRef.current.closest(`.${sectionClassName}`);
      const rect = section?.getBoundingClientRect();
      const pointerInside =
        !!rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      const cards = getCards();

      if (!pointerInside) {
        clearGlow();
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(clientX - centerX, clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          card,
          clientX,
          clientY,
          glowIntensity,
          spotlightRadius,
        );
      });

      gsap.to(spotlight, {
        left: clientX,
        top: clientY,
        duration: isCoarse ? 0.05 : 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? isCoarse
            ? 0.65
            : 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) *
              (isCoarse ? 0.65 : 0.8)
            : 0;

      gsap.to(spotlight, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      updateFromPointer(e.clientX, e.clientY);
    };

    const handlePointerEnd = () => {
      clearGlow();
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerup", handlePointerEnd, { passive: true });
    document.addEventListener("pointercancel", handlePointerEnd, {
      passive: true,
    });
    document.addEventListener("mouseleave", handlePointerEnd);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerEnd);
      document.removeEventListener("pointercancel", handlePointerEnd);
      document.removeEventListener("mouseleave", handlePointerEnd);
      spotlight.remove();
    };
  }, [
    gridRef,
    animationsOff,
    enableSpotlight,
    spotlightRadius,
    glowColor,
    sectionClassName,
    isCoarse,
  ]);

  return null;
}

export interface MagicBentoCardProps extends MagicBentoConfig {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MagicBentoCard({
  children,
  className,
  style,
  enableStars = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  disableAnimations = false,
  particleCount = 12,
  glowColor = DEFAULT_GLOW_COLOR,
}: MagicBentoCardProps) {
  const isCoarse = useCoarsePointer();
  const reducedMotion = useReducedMotion();
  const animationsOff = disableAnimations || reducedMotion;
  const effectiveParticleCount = isCoarse
    ? Math.min(particleCount, 5)
    : particleCount;

  const cardRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const touchClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => particle.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from(
      { length: effectiveParticleCount },
      () =>
        createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor,
        ),
    );
    particlesInitialized.current = true;
  }, [effectiveParticleCount, glowColor]);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableStars) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    const staggerMs = isCoarse ? 140 : 100;

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * (isCoarse ? 60 : 100),
          y: (Math.random() - 0.5) * (isCoarse ? 60 : 100),
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * staggerMs);

      timeoutsRef.current.push(timeoutId);
    });
  }, [enableStars, initializeParticles, isCoarse]);

  const spawnRipple = useCallback(
    (clientX: number, clientY: number) => {
      const element = cardRef.current;
      if (!element || !clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("div");
      ripple.className = "magic-bento-ripple";
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 20;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    },
    [clickEffect, glowColor],
  );

  const scheduleTouchClear = useCallback(() => {
    if (touchClearTimeoutRef.current) {
      clearTimeout(touchClearTimeoutRef.current);
    }

    touchClearTimeoutRef.current = setTimeout(() => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (cardRef.current) {
        resetCardGlow(cardRef.current);
      }
    }, TOUCH_CLEAR_DELAY_MS);
  }, [clearAllParticles]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || animationsOff) return;

    const startHover = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const endHover = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      startHover();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || isInteractiveTarget(e.target)) return;

      if (e.pointerType === "touch") {
        if (touchClearTimeoutRef.current) {
          clearTimeout(touchClearTimeoutRef.current);
        }

        startHover();

        if (enableBorderGlow) {
          updateCardGlowProperties(
            element,
            e.clientX,
            e.clientY,
            1,
            TOUCH_GLOW_RADIUS,
          );
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!e.isPrimary) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (
        e.pointerType === "touch" &&
        enableBorderGlow &&
        x >= 0 &&
        x <= rect.width &&
        y >= 0 &&
        y <= rect.height
      ) {
        updateCardGlowProperties(
          element,
          e.clientX,
          e.clientY,
          1,
          TOUCH_GLOW_RADIUS,
        );
      }

      if (e.pointerType !== "mouse") return;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        magnetismAnimationRef.current = gsap.to(element, {
          x: (x - centerX) * 0.05,
          y: (y - centerY) * 0.05,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      endHover();
      resetCardGlow(element);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return;
      scheduleTouchClear();
    };

    const handlePointerCancel = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      scheduleTouchClear();
    };

    const handleClick = (e: MouseEvent) => {
      if (isInteractiveTarget(e.target)) return;
      spawnRipple(e.clientX, e.clientY);
    };

    element.addEventListener("pointerenter", handlePointerEnter);
    element.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    element.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    element.addEventListener("pointerleave", handlePointerLeave);
    element.addEventListener("pointerup", handlePointerUp, { passive: true });
    element.addEventListener("pointercancel", handlePointerCancel, {
      passive: true,
    });
    element.addEventListener("click", handleClick);

    return () => {
      if (touchClearTimeoutRef.current) {
        clearTimeout(touchClearTimeoutRef.current);
      }
      isHoveredRef.current = false;
      element.removeEventListener("pointerenter", handlePointerEnter);
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    animationsOff,
    clearAllParticles,
    enableBorderGlow,
    enableMagnetism,
    enableTilt,
    scheduleTouchClear,
    spawnRipple,
  ]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "magic-bento-card magic-bento-particle-container",
        enableBorderGlow && "magic-bento-card--border-glow",
        isCoarse && "magic-bento-card--touch",
        className,
      )}
      style={
        {
          ...style,
          "--glow-rgb": glowColor,
        } as React.CSSProperties
      }
    >
      {children}
    </article>
  );
}

export const SERVICE_MAGIC_BENTO_CONFIG: Required<
  Pick<
    MagicBentoConfig,
    | "enableStars"
    | "enableSpotlight"
    | "enableBorderGlow"
    | "enableTilt"
    | "enableMagnetism"
    | "clickEffect"
    | "disableAnimations"
    | "spotlightRadius"
    | "particleCount"
    | "glowColor"
  >
> = {
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  enableTilt: false,
  enableMagnetism: false,
  clickEffect: true,
  disableAnimations: false,
  spotlightRadius: 510,
  particleCount: 12,
  glowColor: DEFAULT_GLOW_COLOR,
};
