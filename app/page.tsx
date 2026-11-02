import { ViewTransition } from "react";

import { PhotoGrid } from "@/components/photo-grid";
import { isCloudinaryAdminConfigured } from "@/lib/cloudinary-admin";
import { getPhotos } from "@/lib/photos";

export default async function Home() {
  const photos = await getPhotos();
  const years = photos
    .map((photo) => photo.year)
    .filter((year): year is number => typeof year === "number");
  const range =
    years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : null;
  const details = [
    `${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}`,
    range,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <section className="pb-12 pt-10 sm:pb-16 sm:pt-16">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
          Photographs
        </h1>
        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted">
          {details}
        </p>
      </section>

      <section aria-label="Photographs" className="pb-20">
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} />
        ) : (
          <p className="max-w-sm border-t border-line pt-4 text-[13px] leading-6 text-muted">
            {isCloudinaryAdminConfigured
              ? "No photographs in this folder yet."
              : "Add your Cloudinary credentials to .env.local to load the archive."}
          </p>
        )}
      </section>
    </ViewTransition>
  );
}
