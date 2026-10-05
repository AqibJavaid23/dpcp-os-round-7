import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // The prototype is opened at 127.0.0.1. Next treats that as a different origin from localhost and blocks the dev client.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
