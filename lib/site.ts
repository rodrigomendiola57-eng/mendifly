/**
 * URL pública del sitio. Configúrala en Vercel como NEXT_PUBLIC_SITE_URL
 * (ej. https://mendifly.com o https://tu-proyecto.vercel.app).
 * Se usa para metadataBase, Open Graph, canonical, robots y sitemap.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://mendifly.vercel.app";

export const siteName = "Mendifly";
