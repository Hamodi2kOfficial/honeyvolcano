import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → produces an `out/` folder of plain HTML/CSS/JS that can be
  // uploaded to any web host (entry: out/index.html).
  output: "export",
  images: {
    // required for static export: serve images as-is (no server optimizer)
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
