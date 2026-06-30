export type ProjectCategory =
  | "web"
  | "sistemas"
  | "ecommerce"
  | "automatizacion";

export type ProjectStatus = "published" | "coming-soon";

/** Sitio público con URL · sistema interno solo con captura (sin enlace) */
export type ProjectKind = "live-site" | "internal-system";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  label?: string;
  objectFit?: "cover" | "contain";
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: ProjectCategory;
  kind: ProjectKind;
  summary: string;
  highlights: string[];
  technologies: string[];
  status: ProjectStatus;
  featured: boolean;
  year: number;
  /** Imagen principal — fallback si no hay galería */
  coverImage?: string;
  coverAlt?: string;
  /** Carrusel de capturas (sistemas internos, etc.) */
  gallery?: ProjectGalleryImage[];
  /** Card a ancho completo en grid de 2 columnas */
  layout?: "default" | "wide";
  /** Solo para kind: live-site */
  externalUrl?: string;
}

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  web: "Sitios Web",
  sistemas: "Sistemas a Medida",
  ecommerce: "E-Commerce",
  automatizacion: "Automatización",
};

export const projectKindLabels: Record<ProjectKind, string> = {
  "live-site": "Sitio en producción",
  "internal-system": "Bajo demanda",
};

export const projectsPageCopy = {
  moduleLabel: "Módulo de Proyectos",
  title: "Soluciones que hemos",
  titleAccent: "construido",
  subtitle:
    "Webs en producción y sistemas a medida para operaciones reales. Cada entrega resuelve un problema concreto de negocio.",
  liveSitesEyebrow: "Portafolio web",
  liveSitesTitle: "Sitios y e-commerce",
  liveSitesDescription:
    "Webs en producción y tiendas a medida. Diseño, rendimiento y estructura pensados para generar confianza, destacar el producto y convertir.",
  internalEyebrow: "Bajo demanda",
  internalTitle: "Sistemas internos",
  internalDescription:
    "Plataformas privadas que no pueden publicarse en línea. Mostramos capturas reales del software que opera el día a día de nuestros clientes.",
  emptyState: "Próximamente publicaremos más proyectos.",
  ctaTitle: "¿Tienes un proyecto en mente?",
  ctaDescription:
    "Cuéntanos tu idea y te proponemos alcance, tiempos y presupuesto sin compromiso.",
  ctaButton: "Agendar consulta",
  visitSite: "Visitar sitio",
  confidentialNote: "Bajo demanda",
} as const;

export const projects: ProjectItem[] = [
  {
    id: "icasa-cargo",
    slug: "icasa-cargo",
    title: "ICASA Cargo",
    clientName: "Integradores de Carga Aérea",
    category: "web",
    kind: "live-site",
    summary:
      "Web corporativa para operador logístico de carga aérea: servicios especializados, certificaciones, aliados comerciales y canales de contacto B2B.",
    highlights: [
      "Arquitectura multi-sección para servicios y destinos",
      "Enfoque B2B con CTAs a WhatsApp y contacto directo",
      "Secciones de credibilidad: certificaciones y aliados",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "published",
    featured: true,
    year: 2026,
    externalUrl: "https://www.integracargo.com/",
    coverImage: "/proyectos/integracargo.png",
    coverAlt: "Captura del sitio web de ICASA Cargo",
  },
  {
    id: "total-living",
    slug: "total-living",
    title: "Total Living",
    clientName: "Total Living Inmobiliaria",
    category: "web",
    kind: "live-site",
    summary:
      "Plataforma inmobiliaria con catálogo de propiedades, mapa interactivo, asesoría comercial y captación de leads para compra, venta y renta.",
    highlights: [
      "Listado y fichas de propiedades destacadas",
      "Integración de mapa y zonas de interés",
      "Flujos de contacto y WhatsApp para conversión",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "published",
    featured: true,
    year: 2026,
    externalUrl: "https://www.totalliving.mx/",
    coverImage: "/proyectos/totalliving.png",
    coverAlt: "Captura del sitio web de Total Living",
  },
  {
    id: "aroma-aura",
    slug: "aroma-aura",
    title: "Aroma Aura",
    clientName: "Aroma Aura · Perfumería de autor",
    category: "ecommerce",
    kind: "live-site",
    summary:
      "E-commerce de perfumería premium con estética oscura y tipografía editorial: catálogo curado de fragancias de lujo, búsqueda inteligente, categorías por familia olfativa y una experiencia de compra diseñada para elevar el ticket y la percepción de marca.",
    highlights: [
      "Hero con producto destacado, precio visible y CTAs de conversión",
      "Catálogo, filtros y navegación por categorías de fragancias",
      "Flujos de cuenta, registro y checkout orientados a venta de alto valor",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "published",
    featured: true,
    year: 2025,
    coverImage: "/proyectos/aroma-aura.png",
    coverAlt: "Captura de la tienda en línea Aroma Aura — perfumería premium",
  },
  {
    id: "sim-icasa",
    slug: "sim-icasa",
    title: "SIM — Sistema Integral de Mantenimiento",
    clientName: "ICASA · Integradores de Carga Aérea",
    category: "sistemas",
    kind: "internal-system",
    summary:
      "Plataforma web y app móvil para el control total de una flotilla de transporte con más de 500 unidades: documentación vehicular, verificaciones, checklists en ruta, mantenimientos y un dashboard que traduce la operación en estadísticas y alertas accionables.",
    highlights: [
      "Dashboard con KPIs en tiempo real y alertas de documentos vencidos",
      "Gestión documental, mantenimientos y checklists con app móvil para choferes",
      "Control de flotilla, empleados y trazabilidad operativa centralizada",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "App móvil"],
    status: "published",
    featured: true,
    year: 2025,
    coverImage: "/proyectos/sim-documentacion.png",
    coverAlt: "Módulo de documentación vehicular de SIM para ICASA",
    gallery: [
      {
        src: "/proyectos/sim-documentacion.png",
        alt: "Módulo de documentación vehicular — verificaciones, placas, seguros y permisos",
        label: "Documentación",
        objectFit: "cover",
      },
      {
        src: "/proyectos/sim-mantenimientos.png",
        alt: "Módulo de mantenimientos con estados, costos y gestión de talleres",
        label: "Mantenimientos",
        objectFit: "cover",
      },
      {
        src: "/proyectos/sim-mobile.png",
        alt: "App móvil SIM — dashboard, alertas y checklists para choferes",
        label: "App móvil",
        objectFit: "contain",
      },
    ],
  },
  {
    id: "sistemageo",
    slug: "sistemageo",
    title: "Sistema GEO — Gestión Organizacional",
    clientName: "Cliente confidencial · Sector logístico",
    category: "sistemas",
    kind: "internal-system",
    summary:
      "Plataforma integral para gobernar la estructura, los procesos y el conocimiento de una organización en crecimiento: organigrama vivo, modelado de flujos, capacitación corporativa y documentación oficial con trazabilidad, aprobaciones y métricas de salud documental.",
    highlights: [
      "Organigrama interactivo con perfiles de puesto, competencias y comités",
      "Flujogramas, mapeo de procesos, automatización y KPIs de ciclo operativo",
      "LMS corporativo y manual de organización con versiones, aprobaciones y búsqueda avanzada",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Mermaid"],
    status: "published",
    featured: true,
    year: 2025,
    coverImage: "/proyectos/sistemageo-dashboard.png",
    coverAlt: "Dashboard del Sistema GEO — command center organizacional",
    gallery: [
      {
        src: "/proyectos/sistemageo-dashboard.png",
        alt: "Dashboard con índice de salud documental, cuellos de botella y velocidad de ciclo",
        label: "Dashboard",
        objectFit: "cover",
      },
      {
        src: "/proyectos/sistemageo-procesos.png",
        alt: "Editor de flujogramas con código Mermaid y vista previa en tiempo real",
        label: "Procesos",
        objectFit: "cover",
      },
      {
        src: "/proyectos/sistemageo-learning.png",
        alt: "Catálogo de cursos y plataforma de capacitación corporativa",
        label: "Capacitación",
        objectFit: "cover",
      },
      {
        src: "/proyectos/sistemageo-documentacion.png",
        alt: "Centro de documentación del manual de organización con categorías y estados",
        label: "Documentación",
        objectFit: "cover",
      },
    ],
  },
];

export function getProjectKindLabel(project: ProjectItem): string {
  if (project.kind === "live-site" && !project.externalUrl) {
    return "Tienda en línea";
  }
  return projectKindLabels[project.kind];
}

export function getPublishedProjects(): ProjectItem[] {
  return projects.filter((project) => project.status === "published");
}

export function getLiveSiteProjects(): ProjectItem[] {
  return getPublishedProjects().filter((project) => project.kind === "live-site");
}

export function getInternalProjects(): ProjectItem[] {
  return getPublishedProjects().filter(
    (project) => project.kind === "internal-system",
  );
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return projects.find((project) => project.slug === slug);
}
