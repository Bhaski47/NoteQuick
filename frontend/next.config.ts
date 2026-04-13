import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    host:process.env.NEXT_PUBLIC_API_URL
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
