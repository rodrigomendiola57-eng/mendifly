"use client";

import { useSyncExternalStore } from "react";

import { useHydrated } from "@/hooks/use-hydrated";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCoarseSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getCoarseServerSnapshot() {
  return false;
}

/**
 * Detecta touch/coarse pointer solo después de hidratar para evitar
 * mismatch SSR en móvil (servidor: false, cliente táctil: true).
 */
export function useCoarsePointer() {
  const hydrated = useHydrated();
  const coarse = useSyncExternalStore(
    subscribe,
    getCoarseSnapshot,
    getCoarseServerSnapshot,
  );

  return hydrated && coarse;
}
