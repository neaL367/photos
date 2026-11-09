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
const HERO_PREFIX = "hero:";

/** A grid thumbnail, scaled down to the requested width. */
export function thumbSrc(publicId: string) {
  return `${THUMB_PREFIX}${publicId}`;
}

/** The full photograph, scaled to the requested width. */
export function heroSrc(publicId: string) {
  return `${HERO_PREFIX}${publicId}`;
}

/** Strips the delivery prefix and returns the Cloudinary public ID. */
export function parseSource(src: string) {
  if (src.startsWith(THUMB_PREFIX)) {
    return src.slice(THUMB_PREFIX.length);
  }

  if (src.startsWith(HERO_PREFIX)) {
    return src.slice(HERO_PREFIX.length);
  }

  return src;
}
