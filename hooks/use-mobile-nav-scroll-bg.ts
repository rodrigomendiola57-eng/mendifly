"use client";

import { useEffect, useRef, useState } from "react";

const SCROLL_FADE_DISTANCE = 72;

export function useMobileNavScrollBg() {
  const [opacity, setOpacity] = useState(0);
  const [instant, setInstant] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (y <= 4) {
        setInstant(true);
        setOpacity(0);
        lastScrollY.current = y;
        return;
      }

      if (y < lastScrollY.current) {
        setInstant(true);
        setOpacity(0);
      } else if (y > lastScrollY.current) {
        setInstant(false);
        setOpacity(Math.min(y / SCROLL_FADE_DISTANCE, 1));
      }

      lastScrollY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { opacity, instant };
}
