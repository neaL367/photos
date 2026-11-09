import { cacheLife, cacheTag } from "next/cache";

import { fetchPhotosFromCloudinary } from "./cloudinary-admin";

export type Photo = {
  /** URL segment used by /photo/[id]. */
  id: string;
  /** Cloudinary public ID, without a file extension. */
  publicId: string;
  title: string;
  location?: string;
  /** ISO timestamp of the upload, shown as the photograph's date. */
  date?: string;
  /** Intrinsic dimensions of the source, used to reserve layout space. */
  width: number;
  height: number;
  alt: string;
  /** Average-ish colour shown while the image loads. */
  color: string;
};

export async function getPhotos(): Promise<Photo[]> {
  "use cache";
  cacheLife("days");
  cacheTag("photos");

  return fetchPhotosFromCloudinary();
}

/**
 * Human-readable summary of the archive for the home heading:
 * "47 photographs · 2025–2026".
 */
export function summarizePhotos(photos: Photo[]): string {
  const years = photos
    .map((photo) => (photo.date ? new Date(photo.date).getFullYear() : null))
    .filter((year): year is number => year !== null && Number.isFinite(year));

  const span =
    years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : null;

  return [
    `${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}`,
    span,
  ]
    .filter(Boolean)
    .join(" · ");
}

export async function getPhoto(id: string): Promise<Photo | null> {
  "use cache";
  cacheLife("days");
  cacheTag("photos", `photo-${id}`);

  const photos = await getPhotos();
  return photos.find((photo) => photo.id === id) ?? null;
}
