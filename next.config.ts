import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables `use cache`, `cacheLife`, `cacheTag`, and PPR (static shell +
  // streaming dynamic holes) across the App Router.
  cacheComponents: true,
  images: {
    // Cloudinary does the resizing and format negotiation, so Next.js hands
    // image URLs straight to the browser instead of proxying them.
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
