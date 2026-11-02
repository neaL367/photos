/**
 * Cloudinary delivery helpers.
 *
 * The gallery never proxies images through Next.js. `next/image` uses the
 * loader in `cloudinary-loader.ts`, which turns the prefixed source strings
 * below into Cloudinary delivery URLs.
 */
export const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";

const THUMB_PREFIX = "thumb:";
const FULL_PREFIX = "full:";

/** A 4:5, smart-cropped grid thumbnail. */
export function thumbSrc(publicId: string) {
  return `${THUMB_PREFIX}${publicId}`;
}

/** The full frame, width-limited but never cropped. */
export function fullSrc(publicId: string) {
  return `${FULL_PREFIX}${publicId}`;
}

export function parseSource(src: string) {
  if (src.startsWith(THUMB_PREFIX)) {
    return { mode: "thumb" as const, publicId: src.slice(THUMB_PREFIX.length) };
  }

  if (src.startsWith(FULL_PREFIX)) {
    return { mode: "full" as const, publicId: src.slice(FULL_PREFIX.length) };
  }

  return { mode: "full" as const, publicId: src };
}
