"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Evita que Safari y otros navegadores restauren scroll a mitad de página
 * al abrir o recargar (común en móvil y túneles ngrok).
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const scrollTop = () => {
      window.scrollTo(0, 0);
    };

    scrollTop();
    requestAnimationFrame(scrollTop);
    const t = window.setTimeout(scrollTop, 0);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
