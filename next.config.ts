import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables `use cache`, `cacheLife`, `cacheTag`, and PPR (static shell +
  // streaming dynamic holes) across the App Router.
  cacheComponents: true,
  // Links prefetch one shared App Shell per route. Routes that read params opt
  // into per-link prefetching with `<Link prefetch={true}>` (see the photo grid).
  partialPrefetching: true,
  images: {
    // Cloudinary does the resizing and format negotiation, so Next.js hands
    // image URLs straight to the browser instead of proxying them.
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
