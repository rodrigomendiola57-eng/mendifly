export interface HeroSlide {
  id: string;
  line1: string;
  highlight: string;
  line2?: string;
  subtitle: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "tecnologia",
    line1: "Construimos la",
    highlight: "tecnología del mañana",
    line2: "para tu empresa",
    subtitle:
      "Desarrollo web corporativo de alto impacto y sistemas de gestión empresarial — flotillas, CRM y POS — diseñados con precisión y rendimiento.",
  },
  {
    id: "precio",
    line1: "Haz tu página web desde",
    highlight: "$10,000 MXN",
    subtitle:
      "Presencia digital profesional con diseño premium, hosting y soporte incluido. Invierte en tu marca sin complicaciones.",
  },
  {
    id: "gestion",
    line1: "Sistemas de gestión",
    highlight: "a tu medida",
    line2: "flotillas, CRM y POS",
    subtitle:
      "Plataformas empresariales que centralizan operaciones, automatizan procesos y convierten datos en decisiones.",
  },
  {
    id: "valor",
    line1: "Diseño premium con",
    highlight: "valor real",
    line2: "para tu negocio",
    subtitle:
      "UX/UI de alto nivel, seguridad incluida, SEO integrado y rendimiento extremo en cada proyecto que entregamos.",
  },
];
