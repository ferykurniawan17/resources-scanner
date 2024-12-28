import type { NextConfig } from "next";
import { withResourcesScanner } from "resources-scanner";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default withResourcesScanner(nextConfig);
