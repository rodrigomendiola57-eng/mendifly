import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Menditech — Technology Studio",
  description:
    "Desarrollo web corporativo de alto impacto y sistemas de gestión empresarial. Flotillas, CRM y POS con tecnología de vanguardia.",
  icons: {
    icon: "/logo-menditech.png",
    apple: "/logo-menditech.png",
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
