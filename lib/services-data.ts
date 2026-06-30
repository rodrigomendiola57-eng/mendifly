export type ServiceIconName =
  | "globe"
  | "layers"
  | "shopping-cart"
  | "workflow";

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  icon: ServiceIconName;
  gridClass: string;
  minHeight: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
  highlight: string;
}

export const services: ServiceItem[] = [
  {
    id: "web",
    title: "Sitios Web",
    shortDescription:
      "Desde landing pages de conversión hasta webs corporativas y portales complejos. Presencia digital que escala con tu negocio.",
    fullDescription:
      "Desarrollamos todo el espectro web que el mercado demanda hoy: landings rápidas para campañas y lanzamientos, sitios corporativos multi-página con SEO sólido, y plataformas web complejas con paneles, integraciones y arquitectura escalable.",
    features: [
      "Landing pages rápidas orientadas a conversión",
      "Webs corporativas multi-página con SEO técnico",
      "Portales y plataformas web complejas a medida",
      "Rendimiento, accesibilidad y Core Web Vitals",
    ],
    icon: "globe",
    gridClass: "md:col-span-8",
    minHeight: "min-h-[280px] md:min-h-[320px]",
  },
  {
    id: "sistemas",
    title: "Sistemas a Medida",
    shortDescription:
      "Software de negocio para tu operación: dashboards, CRM, ERP ligero, logística y herramientas internas que reemplazan Excel y procesos manuales.",
    fullDescription:
      "Diseñamos y desarrollamos sistemas que resuelven problemas reales de tu empresa. CRM comercial, gestión de flotillas, POS, inventarios, paneles de control y flujos operativos — pensados para cómo trabaja tu equipo, no plantillas genéricas.",
    features: [
      "CRM, ERP ligero y paneles de control",
      "Gestión operativa: flotillas, POS e inventarios",
      "Flujos de trabajo y permisos por rol",
      "Base de datos, reportes y trazabilidad",
    ],
    icon: "layers",
    gridClass: "md:col-span-4",
    minHeight: "min-h-[240px] md:min-h-[320px]",
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Tiendas Online",
    shortDescription:
      "Tiendas online que venden: catálogo, carrito, pagos seguros e inventario sincronizado. De catálogo digital a operación multi-sucursal.",
    fullDescription:
      "Construimos experiencias de compra optimizadas para convertir. Catálogos con filtros avanzados, checkout fluido con pasarelas de pago locales e internacionales, gestión de stock y paneles para tu equipo comercial.",
    features: [
      "Catálogo, carrito y checkout optimizado",
      "Integración con pasarelas de pago",
      "Control de inventario y pedidos",
      "Panel admin y reportes de ventas",
    ],
    icon: "shopping-cart",
    gridClass: "md:col-span-6",
    minHeight: "min-h-[220px] md:min-h-[260px]",
  },
  {
    id: "automatizacion",
    title: "Automatización & Integraciones",
    shortDescription:
      "Conecta tus herramientas y elimina trabajo manual. APIs, webhooks, sincronización de datos y flujos automatizados entre sistemas.",
    fullDescription:
      "Las empresas pierden horas copiando datos entre Excel, WhatsApp, ERP y CRM. Integramos tus sistemas existentes, automatizamos procesos repetitivos y construimos APIs robustas para que tu operación fluya sin fricción.",
    features: [
      "Integración entre ERP, CRM y herramientas",
      "APIs REST y webhooks a medida",
      "Automatización de procesos repetitivos",
      "Sincronización de datos en tiempo real",
    ],
    icon: "workflow",
    gridClass: "md:col-span-6",
    minHeight: "min-h-[220px] md:min-h-[260px]",
  },
];

export const serviceProcess: ServiceProcessStep[] = [
  {
    step: "01",
    title: "Consulta estratégica sin costo",
    description:
      "Analizamos tu operación, cuellos de botella y objetivos de negocio. Te entregamos un plan con alcance, tiempos y presupuesto transparente — para que decidas con información real, no suposiciones.",
    highlight: "Respuesta en menos de 24 horas",
  },
  {
    step: "02",
    title: "Desarrollo con avances que ves",
    description:
      "Construimos en ciclos cortos con demos funcionales cada semana. Participas del proceso, das feedback y el software evoluciona contigo. Sin cajas negras ni meses de silencio.",
    highlight: "Entregas incrementales, riesgo reducido",
  },
  {
    step: "03",
    title: "Lanzamiento y socios a largo plazo",
    description:
      "Desplegamos, capacitamos a tu equipo y te acompañamos post-lanzamiento. Tu plataforma sigue creciendo: optimizamos, escalamos y añadimos lo que tu negocio necesite.",
    highlight: "Soporte dedicado y evolución continua",
  },
];
