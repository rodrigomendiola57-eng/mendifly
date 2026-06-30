"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./scroll-float.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(
    () =>
      children.split("").map((char, i) => (
        <span className="char" key={i}>
          {char === " " ? "\u00A0" : char}
        </span>
      )),
    [children],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const scroller =
      scrollContainerRef?.current ? scrollContainerRef.current : window;

    const charEls = el.querySelectorAll<HTMLSpanElement>(".char");

    // Set initial hidden state
    gsap.set(charEls, {
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: "50% 0%",
    });

    const st = ScrollTrigger.create({
      trigger: el,
      scroller,
      start: "top 85%",
      // "play none none reset" → plays when scrolling down into view,
      // resets when scrolling back up so it replays next time
      onEnter: () => {
        gsap.to(charEls, {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          onComplete: () => {
            charEls.forEach((span) => {
              span.style.willChange = "auto";
            });
          },
        });
      },
      onLeaveBack: () => {
        // Reset so it plays again next scroll-down
        gsap.set(charEls, {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: "50% 0%",
        });
      },
    });

    const tween = { scrollTrigger: st, kill: () => st.kill() };

    return () => {
      st.kill();
    };
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
  ]);

  return (
    <h2
      ref={containerRef}
      className={`scroll-float ${containerClassName}`}
    >
      <span className={`scroll-float-text ${textClassName}`}>
        {splitText}
      </span>
    </h2>
  );
}

export default ScrollFloat;
