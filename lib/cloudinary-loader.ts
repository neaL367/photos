"use client";

import { cloudName, parseSource } from "./cloudinary";

type CloudinaryLoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * Builds a Cloudinary delivery URL for `next/image`.
 *
 * Thumbnails keep the photograph's own aspect ratio so the masonry grid can
 * breathe; hero frames are cropped to 16:9 with automatic gravity. `f_auto` +
 * `q_auto` let Cloudinary pick the best format and quality for the requesting
 * browser.
 */
export default function cloudinaryLoader({
  src,
  width,
}: CloudinaryLoaderArgs) {
  const { mode, publicId } = parseSource(src);
  const transformation =
    mode === "hero"
      ? `c_fill,ar_16:9,g_auto,w_${width}`
      : `c_limit,w_${width}`;
  // Public IDs can contain spaces and unicode; keep folder separators intact.
  const encodedId = publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,${transformation}/${encodedId}`;
}
