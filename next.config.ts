import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "kulangara.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
