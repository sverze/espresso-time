import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pass environment variables to runtime
  env: {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_REGION: process.env.AWS_REGION,
    REGION: process.env.REGION,
  },
  
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
