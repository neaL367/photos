import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { heroSrc } from "@/lib/cloudinary";
import { formatTimestamp } from "@/lib/format";
import { getPhoto, getPhotos } from "@/lib/photos";

export async function generateStaticParams() {
  const photos = await getPhotos();

  // Cache Components requires at least one param at build time. When the
  // Cloudinary environment is not configured yet, this placeholder renders the
  // 404 page instead of failing the build.
  return photos.length > 0
    ? photos.map((photo) => ({ id: photo.id }))
    : [{ id: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/photo/[id]">): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhoto(id);

  if (!photo) {
    return {};
  }

  return {
    title: photo.title,
    description: photo.alt,
  };
}

export default async function PhotoPage({ params }: PageProps<"/photo/[id]">) {
  const { id } = await params;
  const [photo, photos] = await Promise.all([getPhoto(id), getPhotos()]);

  if (!photo) {
    notFound();
  }

  const index = photos.findIndex((entry) => entry.id === photo.id);
  const previous = index > 0 ? photos[index - 1] : null;
  const next = index < photos.length - 1 ? photos[index + 1] : null;
  const meta = [photo.location, formatTimestamp(photo.date)]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="pb-16 pt-6 sm:pb-20 sm:pt-10">
      <ViewTransition name={`photo-${photo.id}`} share="morph" default="none">
        <div
          className="relative aspect-video overflow-hidden bg-surface"
          style={{ backgroundColor: photo.color }}
        >
          <Image
            src={heroSrc(photo.publicId)}
            alt={photo.alt}
            fill
            sizes="(min-width: 1200px) 1024px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>
      </ViewTransition>

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
        <div>
          <div className="mt-8">
            <h1 className="max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.015em]">
              {photo.title}
            </h1>
            {meta ? (
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">
                {meta}
              </p>
            ) : null}
          </div>

          <nav
            aria-label="Photographs"
            className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-5 text-[13px]"
          >
            <div>
              {previous ? (
                <Link
                  href={`/photo/${previous.id}`}
                  transitionTypes={["nav-back"]}
                  className="inline-flex max-w-full items-baseline gap-2 outline-none focus-visible:underline focus-visible:underline-offset-4"
                >
                  <span aria-hidden="true" className="text-muted">
                    ←
                  </span>
                  <span className="truncate">{previous.title}</span>
                </Link>
              ) : null}
            </div>

            <div className="text-right">
              {next ? (
                <Link
                  href={`/photo/${next.id}`}
                  transitionTypes={["nav-forward"]}
                  className="inline-flex max-w-full items-baseline justify-end gap-2 outline-none focus-visible:underline focus-visible:underline-offset-4"
                >
                  <span className="truncate">{next.title}</span>
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                </Link>
              ) : null}
            </div>
          </nav>
        </div>
      </ViewTransition>
    </article>
  );
}
