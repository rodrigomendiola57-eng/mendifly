"use client";

import dynamic from "next/dynamic";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import type { BeamsProps } from "@/components/ui/beams";

// Three.js solo se descarga cuando realmente se renderiza (desktop).
const Beams = dynamic(
  () => import("@/components/ui/beams").then((mod) => mod.Beams),
  { ssr: false },
);

/**
 * Fondo Beams premium en desktop; en móvil no monta WebGL (Three.js no se
 * descarga) para no cargar la GPU de teléfonos de gama baja. Las secciones
 * ya tienen gradientes de respaldo que mantienen la estética.
 */
export function BeamsBackdrop(props: BeamsProps) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) return null;

  return <Beams {...props} />;
}
