import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 95, 100],
  },
  // Permite abrir el dev server desde la IP de red y túneles externos
  allowedDevOrigins: [
    "192.168.10.247",
    "localhost",
    "127.0.0.1",
    "*.ngrok-free.dev",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
};

export default nextConfig;
