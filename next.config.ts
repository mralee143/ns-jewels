import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    /** Next 16 defaults to [75] only; higher values are snapped to 75 without this */
    qualities: [75, 80, 85, 90, 92, 95, 100],
    formats: ["image/avif", "image/webp"],
    /** Extra breakpoints so 2×/3× displays request up to 4K-class widths when sources allow */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840, 4096],
  },
};

export default nextConfig;
