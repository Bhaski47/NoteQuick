import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    host:"http://localhost:8080"
    // host:"http://192.168.1.3:8080"
    // host:"http://192.168.0.182:8080"
    // host:"http://10.132.3.74:8080"
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
