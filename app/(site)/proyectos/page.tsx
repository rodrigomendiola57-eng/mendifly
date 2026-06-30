import type { Metadata } from "next";

import { ProjectsPageShell } from "@/components/sections/projects-page-shell";

export const metadata: Metadata = {
  title: "Proyectos — Menditech",
  description:
    "Portafolio de webs, sistemas a medida, e-commerce e integraciones desarrolladas por Menditech. Soluciones reales para problemas de negocio.",
};

export default function ProyectosPage() {
  return (
    <main>
      <ProjectsPageShell />
    </main>
  );
}
