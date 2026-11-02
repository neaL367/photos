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
 * Thumbnails are cropped to a consistent 4:5 and hero frames to 16:9, both
 * with automatic gravity, so the grid and the photo page keep a fixed rhythm.
 * `f_auto` + `q_auto` let Cloudinary pick the best format and quality for the
 * requesting browser.
 */
export default function cloudinaryLoader({
  src,
  width,
}: CloudinaryLoaderArgs) {
  const { mode, publicId } = parseSource(src);
  const ratio = mode === "thumb" ? "4:5" : "16:9";
  const transformation = `c_fill,ar_${ratio},g_auto,w_${width}`;
  // Public IDs can contain spaces and unicode; keep folder separators intact.
  const encodedId = publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,${transformation}/${encodedId}`;
}
