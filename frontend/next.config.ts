import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    host:process.env.NEXT_PUBLIC_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  }
};

export default nextConfig;
