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
 * `c_limit` keeps each photograph's own frame, so the height follows the
 * requested width instead of cropping the image to a fixed ratio. `f_auto` +
 * `q_auto` let Cloudinary pick the best format and quality for the requesting
 * browser.
 */
export default function cloudinaryLoader({
  src,
  width,
}: CloudinaryLoaderArgs) {
  // Public IDs can contain spaces and unicode; keep folder separators intact.
  const encodedId = parseSource(src)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_limit,w_${width}/${encodedId}`;
}
