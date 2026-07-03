import type { Metadata } from "next";

import { ContactPageShell } from "@/components/sections/contact-page-shell";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Agenda una consultoría sin compromiso. Cuéntanos sobre tu proyecto y recibe una propuesta personalizada para web, e-commerce o software a la medida.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main>
      <ContactPageShell />
    </main>
  );
}
