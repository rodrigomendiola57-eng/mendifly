import type { Metadata } from "next";

import { ServicesPageHero } from "@/components/sections/services-page-hero";
import { ServicesBody } from "@/components/sections/services-body";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Sitios web, sistemas a medida, e-commerce y automatización. Soluciones de software premium alineadas con lo que el mercado demanda hoy.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <main>
      <ServicesPageHero />
      <ServicesBody />
    </main>
  );
}
