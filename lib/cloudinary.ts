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

/** A 4:5, smart-cropped grid thumbnail. */
export function thumbSrc(publicId: string) {
  return `${THUMB_PREFIX}${publicId}`;
}

/** A 16:9, smart-cropped hero frame. */
export function heroSrc(publicId: string) {
  return `${HERO_PREFIX}${publicId}`;
}

export function parseSource(src: string) {
  if (src.startsWith(THUMB_PREFIX)) {
    return { mode: "thumb" as const, publicId: src.slice(THUMB_PREFIX.length) };
  }

  if (src.startsWith(HERO_PREFIX)) {
    return { mode: "hero" as const, publicId: src.slice(HERO_PREFIX.length) };
  }

  return { mode: "hero" as const, publicId: src };
}
