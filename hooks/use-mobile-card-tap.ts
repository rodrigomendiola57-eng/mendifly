"use client";

import { useCallback, useState } from "react";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";

export function useMobileCardTap() {
  const isCoarse = useCoarsePointer();
  const [isTapped, setIsTapped] = useState(false);

  const toggleTap = useCallback(() => {
    if (!isCoarse) return;
    setIsTapped((prev) => !prev);
  }, [isCoarse]);

  const tapProps = isCoarse
    ? {
        onClick: toggleTap,
        role: "button" as const,
        "aria-pressed": isTapped,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTap();
          }
        },
      }
    : {};

  return { isCoarse, isTapped, toggleTap, tapProps };
}
