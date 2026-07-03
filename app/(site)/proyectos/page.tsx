import type { Metadata } from "next";

import { ProjectsPageShell } from "@/components/sections/projects-page-shell";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portafolio de webs, sistemas a medida, e-commerce e integraciones desarrolladas por Mendifly. Soluciones reales para problemas de negocio.",
  alternates: { canonical: "/proyectos" },
};

export default function ProyectosPage() {
  return (
    <main>
      <ProjectsPageShell />
    </main>
  );
}
