import { cacheLife, cacheTag } from "next/cache";

import { fetchPhotosFromCloudinary } from "./cloudinary-admin";

export type Photo = {
  /** URL segment used by /photo/[id]. */
  id: string;
  /** Cloudinary public ID, without a file extension. */
  publicId: string;
  title: string;
  location?: string;
  year?: number;
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

export async function getPhoto(id: string): Promise<Photo | null> {
  "use cache";
  cacheLife("days");
  cacheTag("photos", `photo-${id}`);

  const photos = await getPhotos();
  return photos.find((photo) => photo.id === id) ?? null;
}
