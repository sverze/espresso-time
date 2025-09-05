import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude infrastructure directory from Next.js compilation
  webpack: (config, { isServer }) => {
    // Ignore CDK infrastructure directory during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/infrastructure/**', '**/node_modules/**']
    };
    
    return config;
  },
  
  // Exclude infrastructure from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  }
};

export default nextConfig;
