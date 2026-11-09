import { HomeScrollMemory } from "@/components/home-scroll-memory";
import { PhotoGrid } from "@/components/photo-grid";
import { isCloudinaryAdminConfigured } from "@/lib/cloudinary-admin";
import { getPhotos, summarizePhotos } from "@/lib/photos";

export default async function Home() {
  const photos = await getPhotos();
  const details = summarizePhotos(photos);

  return (
    <>
      <HomeScrollMemory />

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
            {isCloudinaryAdminConfigured ||
            process.env.NODE_ENV !== "development"
              ? "No photographs yet."
              : "Add your Cloudinary credentials to .env.local to load the archive."}
          </p>
        )}
      </section>
    </>
  );
}
