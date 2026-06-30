import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Palette,
  Search,
  Shield,
  Zap,
  Headphones,
} from "lucide-react";

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const valueProps: ValueProp[] = [
  {
    id: "ux-ui",
    title: "Diseño UX/UI Premium",
    description:
      "Interfaces modernas que priorizan la experiencia del usuario. Tu web será el espejo de tu marca — elegante, intuitiva y memorable.",
    icon: Palette,
  },
  {
    id: "security",
    title: "Seguridad Incluida",
    description:
      "SSL, protección contra ataques, copias de seguridad automáticas y actualizaciones regulares. Tu negocio siempre protegido.",
    icon: Shield,
  },
  {
    id: "seo",
    title: "SEO Integrado",
    description:
      "Optimización técnica y de contenido desde el día uno: meta tags, sitemap, schema markup y Core Web Vitals en verde.",
    icon: Search,
  },
  {
    id: "performance",
    title: "Rendimiento Extremo",
    description:
      "Carga ultrarrápida con optimización de assets, lazy loading y arquitectura pensada para escalar sin fricción.",
    icon: Zap,
  },
  {
    id: "support",
    title: "Soporte Dedicado",
    description:
      "Acompañamiento post-lanzamiento con respuesta ágil, monitoreo proactivo y evolución continua de tu plataforma.",
    icon: Headphones,
  },
  {
    id: "analytics",
    title: "Analytics & Métricas",
    description:
      "Dashboards e integraciones con herramientas de medición para que cada decisión de negocio esté respaldada por datos.",
    icon: BarChart3,
  },
];
