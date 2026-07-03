import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";

import { siteName, siteUrl } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

const description =
  "Desarrollo web corporativo de alto impacto y sistemas de gestión empresarial. Flotillas, CRM y POS con tecnología de vanguardia.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mendifly — Technology Studio",
    template: "%s — Mendifly",
  },
  description,
  applicationName: siteName,
  keywords: [
    "desarrollo web",
    "software a la medida",
    "sistemas empresariales",
    "CRM",
    "POS",
    "e-commerce",
    "Next.js",
    "Mendifly",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName,
    title: "Mendifly — Technology Studio",
    description,
    images: [
      {
        url: "/logo-mendifly.png",
        width: 955,
        height: 190,
        alt: "Mendifly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mendifly — Technology Studio",
    description,
    images: ["/logo-mendifly.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: "/logo-mendifly.png",
    apple: "/logo-mendifly.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#050505] font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
