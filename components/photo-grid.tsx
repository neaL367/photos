import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

import { thumbSrc } from "@/lib/cloudinary";
import { formatTimestamp } from "@/lib/format";
import type { Photo } from "@/lib/photos";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <ul className="columns-2 gap-4 sm:gap-6 lg:columns-3 lg:gap-8">
      {photos.map((photo, index) => {
        const meta = [photo.location, formatTimestamp(photo.date)]
          .filter(Boolean)
          .join(" · ");

        return (
          <li key={photo.id} className="mb-8 break-inside-avoid sm:mb-10">
            <Link
              href={`/photo/${photo.id}`}
              transitionTypes={["nav-forward"]}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <ViewTransition
                name={`photo-${photo.id}`}
                share="morph"
                default="none"
              >
                <div
                  className="relative overflow-hidden bg-surface"
                  style={{
                    aspectRatio: `${photo.width} / ${photo.height}`,
                    backgroundColor: photo.color,
                  }}
                >
                  <Image
                    src={thumbSrc(photo.publicId)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 46vw"
                    loading={index < 4 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="object-cover transition duration-700 ease-out group-hover:opacity-90"
                  />
                </div>
              </ViewTransition>

              <p className="mt-3 text-[14px] leading-snug">{photo.title}</p>
              {meta ? (
                <p className="mt-0.5 text-[11px] tracking-wide text-muted">
                  {meta}
                </p>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
