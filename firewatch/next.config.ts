import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Force webpack instead of Turbopack for custom optimizations
  webpack: (config, { isServer }) => {
    // Improve build performance with code splitting
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // ArcGIS separate chunk
          arcgis: {
            name: 'arcgis',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]@arcgis[\\/]/,
            priority: 20,
          },
          // Other vendor chunks
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
  
  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Reduce build memory usage
  experimental: {
    optimizePackageImports: ['@arcgis/core', 'leaflet', 'd3'],
  },
};

export default nextConfig;
