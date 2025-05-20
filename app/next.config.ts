// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',    // Utiliser 'http' ou 'https' en fonction de votre serveur
        hostname: 'localhost', // Si vous utilisez localhost pour votre API
        port: '5000',         // Port de l'API où les images sont servies
        pathname: '/images/**', // Le chemin vers vos images
      },
      {
        protocol: 'https',
        hostname: 'www.ldb-micaresearch.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,  // Désactive l'optimisation d'image pour ce domaine
  },
};

export default nextConfig;
