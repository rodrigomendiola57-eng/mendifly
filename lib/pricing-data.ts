import { buildContactHref } from "@/lib/contact-data";

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  /** Descripción corta — visible en móvil / carrusel */
  briefDescription: string;
  description: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  /** Cuántas características incluidas mostrar en vista compacta */
  compactIncludedLimit: number;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "landing",
    name: "Landing Page Premium",
    tagline: "Campañas, lanzamientos y profesionales que buscan captar clientes con alto impacto visual.",
    briefDescription:
      "Una sola página diseñada para captar leads y presentar tu oferta con impacto.",
    description:
      "Una sola página web de alto impacto y scroll fluido, diseñada específicamente para convertir visitantes en clientes potenciales.",
    price: "$10,000",
    priceNote: "pago único · MXN",
    compactIncludedLimit: 4,
    features: [
      { text: "Diseño responsivo premium", included: true },
      { text: "Hero, beneficios, FAQ y contacto", included: true },
      { text: "Integración Mailchimp / WhatsApp", included: true },
      { text: "SEO básico y velocidad optimizada", included: true },
      { text: "Animaciones de entrada", included: true },
      { text: "Panel de administración", included: false },
      { text: "Blog o secciones múltiples", included: false },
      { text: "Pasarela de pagos", included: false },
      { text: "Backend y base de datos", included: false },
    ],
    cta: "Comenzar proyecto",
    ctaHref: buildContactHref("landing"),
  },
  {
    id: "corporativa",
    name: "Web Corporativa",
    tagline: "Empresas que necesitan proyectar imagen sólida y centralizar su ecosistema digital.",
    briefDescription:
      "Sitio multi-página con panel para que actualices textos, imágenes y secciones.",
    description:
      "Sitio web multi-página (hasta 5 secciones) ideal para comunicar la visión de tu empresa y detallar tus servicios a fondo.",
    price: "$18,000",
    priceNote: "pago único · MXN",
    compactIncludedLimit: 5,
    features: [
      { text: "Hasta 5 secciones (Inicio, Nosotros, Servicios…)", included: true },
      { text: "Panel de administración de contenido", included: true },
      { text: "Animaciones premium al scroll", included: true },
      { text: "Correos corporativos configurados", included: true },
      { text: "Blog o galería integrada", included: true },
      { text: "Mapa interactivo y formularios", included: true },
      { text: "Velocidad y seguridad avanzadas", included: true },
      { text: "Catálogo de productos / e-commerce", included: false },
      { text: "Pasarela de pagos", included: false },
      { text: "Backend personalizado", included: false },
    ],
    cta: "Comenzar proyecto",
    ctaHref: buildContactHref("corporativa"),
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    badge: "Más popular",
    tagline: "Emprendedores y marcas que quieren vender y recibir pagos automatizados 24/7.",
    briefDescription:
      "Tienda en línea con pagos, inventario, cupones y panel para gestionar todo.",
    description:
      "Tienda en línea robusta y autoadministrable, optimizada para una experiencia de compra impecable, rápida y segura.",
    price: "$28,000",
    priceNote: "pago único · MXN",
    popular: true,
    compactIncludedLimit: 7,
    features: [
      { text: "Catálogo con filtros, categorías y buscador", included: true },
      { text: "Stripe, PayPal y Mercado Pago", included: true },
      { text: "Panel de inventario, pedidos y clientes", included: true },
      { text: "Cupones y correos automáticos", included: true },
      { text: "SSL y protección de datos", included: true },
      { text: "Multi-sucursal y roles de usuario", included: true },
      { text: "Reportes de ventas en tiempo real", included: true },
      { text: "Notificaciones de pedidos", included: true },
      { text: "Backend personalizado a medida", included: false },
      { text: "Infraestructura cloud dedicada", included: false },
    ],
    cta: "Agendar consulta",
    ctaHref: buildContactHref("ecommerce"),
  },
  {
    id: "enterprise",
    name: "A la Medida",
    tagline: "Empresas que necesitan digitalizar procesos, CRMs propios o aplicaciones con lógica compleja.",
    briefDescription:
      "Software desde cero: CRM, POS, flotillas o lo que tu operación necesite.",
    description:
      "Desarrollamos software desde cero adaptado exactamente a las reglas de tu negocio. Arquitectura escalable y nivel empresarial.",
    price: "A medida",
    priceNote: "cotización personalizada",
    compactIncludedLimit: 9,
    features: [
      { text: "Arquitectura backend a medida", included: true },
      { text: "Bases de datos relacionales optimizadas", included: true },
      { text: "Dashboards con analíticas e informes", included: true },
      { text: "Roles, permisos y multi-usuario", included: true },
      { text: "Automatización, PDFs, facturas y APIs", included: true },
      { text: "Infraestructura cloud segura y escalable", included: true },
      { text: "CRM, POS o gestión de flotillas", included: true },
      { text: "Integraciones con sistemas externos", included: true },
      { text: "Soporte dedicado 12 meses + SLA", included: true },
      { text: "Módulos e integraciones ilimitados", included: true },
    ],
    cta: "Hablar con un experto",
    ctaHref: buildContactHref("enterprise"),
  },
];
