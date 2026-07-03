"use client";

import { useSyncExternalStore } from "react";

import { useHydrated } from "@/hooks/use-hydrated";

const QUERY = "(min-width: 768px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Devuelve true solo tras hidratar y si el viewport es >= 768px.
 * En móvil (y durante SSR/primer render) devuelve false, de modo que
 * los fondos WebGL pesados no se montan ni descargan su chunk en móviles.
 */
export function useIsDesktop() {
  const hydrated = useHydrated();
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return hydrated && isDesktop;
}
