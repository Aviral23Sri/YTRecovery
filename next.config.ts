import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.devtunnels.ms',
        '*.ngrok-free.app',
        '*.ngrok.io'
      ],
    },
  },
};

export default nextConfig;
