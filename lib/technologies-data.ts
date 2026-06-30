export type TechCategory =
  | "Frontend"
  | "Backend"
  | "Base de datos"
  | "Cloud & DevOps";

export interface Technology {
  name: string;
  abbr: string;
  category: TechCategory;
  description: string;
}

export interface TechCategoryGroup {
  id: string;
  title: string;
  hint: string;
  items: Technology[];
}

export const techCategories: TechCategoryGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    hint: "UI · COMPONENTS · PERFORMANCE",
    items: [
      {
        name: "React",
        abbr: "Rx",
        category: "Frontend",
        description:
          "Interfaces dinámicas y componentes reutilizables de alto rendimiento.",
      },
      {
        name: "Next.js",
        abbr: "Nx",
        category: "Frontend",
        description:
          "Framework full-stack para aplicaciones web escalables y SEO-friendly.",
      },
      {
        name: "TypeScript",
        abbr: "TS",
        category: "Frontend",
        description:
          "Código tipado, mantenible y libre de errores en tiempo de compilación.",
      },
      {
        name: "Tailwind CSS",
        abbr: "Tw",
        category: "Frontend",
        description:
          "Sistemas de diseño consistentes con utilidades atómicas y responsive.",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    hint: "APIs · MICROSERVICES · SCALE",
    items: [
      {
        name: "Python",
        abbr: "Py",
        category: "Backend",
        description:
          "APIs robustas, automatización, IA y procesamiento de datos empresarial.",
      },
      {
        name: "Node.js",
        abbr: "Nd",
        category: "Backend",
        description:
          "Servicios en tiempo real, microservicios y APIs de alta concurrencia.",
      },
      {
        name: "Java",
        abbr: "Jv",
        category: "Backend",
        description:
          "Sistemas empresariales sólidos con ecosistema maduro y alta disponibilidad.",
      },
      {
        name: "Go",
        abbr: "Go",
        category: "Backend",
        description:
          "Microservicios ultrarrápidos con concurrencia nativa y despliegue eficiente.",
      },
    ],
  },
  {
    id: "database",
    title: "Data Layer",
    hint: "STORAGE · QUERIES · MODELING",
    items: [
      {
        name: "PostgreSQL",
        abbr: "Pg",
        category: "Base de datos",
        description:
          "Almacenamiento relacional confiable para datos críticos de negocio.",
      },
      {
        name: "MySQL",
        abbr: "My",
        category: "Base de datos",
        description:
          "Bases relacionales probadas para aplicaciones web y sistemas transaccionales.",
      },
      {
        name: "MongoDB",
        abbr: "Mg",
        category: "Base de datos",
        description:
          "Documentos flexibles para productos que evolucionan rápido.",
      },
      {
        name: "SQL",
        abbr: "SQ",
        category: "Base de datos",
        description:
          "Consultas optimizadas, reportes avanzados y modelado de datos preciso.",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & Infra",
    hint: "DOCKER · AWS · KUBERNETES",
    items: [
      {
        name: "Docker",
        abbr: "Dk",
        category: "Cloud & DevOps",
        description:
          "Contenedores para despliegues reproducibles y entornos aislados.",
      },
      {
        name: "AWS",
        abbr: "Aw",
        category: "Cloud & DevOps",
        description:
          "Infraestructura escalable en la nube con servicios gestionados de primer nivel.",
      },
      {
        name: "Azure",
        abbr: "Az",
        category: "Cloud & DevOps",
        description:
          "Integración empresarial con ecosistema Microsoft y despliegues híbridos.",
      },
      {
        name: "Kubernetes",
        abbr: "K8",
        category: "Cloud & DevOps",
        description:
          "Orquestación de contenedores para alta disponibilidad y escalado automático.",
      },
    ],
  },
];

export const technologies: Technology[] = techCategories.flatMap(
  (group) => group.items,
);
