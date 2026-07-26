import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    unoptimized: true
  },
  // Keep metadata in <head> for every client, including audit and unfurling agents.
  htmlLimitedBots: /.*/
};

export default nextConfig;
