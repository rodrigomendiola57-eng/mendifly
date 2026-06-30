export type ContactServiceId =
  | "landing"
  | "corporativa"
  | "ecommerce"
  | "enterprise"
  | "web"
  | "sistemas"
  | "automatizacion"
  | "general";

export interface ContactServiceOption {
  id: ContactServiceId;
  label: string;
  group: "pricing" | "services" | "general";
}

export const contactServiceOptions: ContactServiceOption[] = [
  {
    id: "landing",
    label: "Landing Page Premium",
    group: "pricing",
  },
  {
    id: "corporativa",
    label: "Web Corporativa Profesional",
    group: "pricing",
  },
  {
    id: "ecommerce",
    label: "E-Commerce / Plataforma de Negocios",
    group: "pricing",
  },
  {
    id: "enterprise",
    label: "Sistemas y Plataformas a la Medida",
    group: "pricing",
  },
  {
    id: "web",
    label: "Sitios Web",
    group: "services",
  },
  {
    id: "sistemas",
    label: "Sistemas a Medida",
    group: "services",
  },
  {
    id: "automatizacion",
    label: "Automatización & Integraciones",
    group: "services",
  },
  {
    id: "general",
    label: "Consulta general",
    group: "general",
  },
];

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  service: ContactServiceId;
  message: string;
  sourcePage?: string;
  website?: string;
}

export function getContactServiceLabel(id: string): string {
  return (
    contactServiceOptions.find((option) => option.id === id)?.label ?? id
  );
}

export function isValidContactService(id: string): id is ContactServiceId {
  return contactServiceOptions.some((option) => option.id === id);
}

/** Builds the contact page URL with an optional pre-selected service. */
export function buildContactHref(serviceId: ContactServiceId): string {
  return `/contacto?servicio=${serviceId}`;
}
