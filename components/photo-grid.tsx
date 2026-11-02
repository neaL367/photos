import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";

import { thumbSrc } from "@/lib/cloudinary";
import { formatTimestamp } from "@/lib/format";
import type { Photo } from "@/lib/photos";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
      {photos.map((photo, index) => {
        const meta = [photo.location, formatTimestamp(photo.date)]
          .filter(Boolean)
          .join(" · ");

        return (
          <li key={photo.id}>
            <Link
              href={`/photo/${photo.id}`}
              transitionTypes={["nav-forward"]}
              className="group block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <ViewTransition
                name={`photo-${photo.id}`}
                share="morph"
                default="none"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden bg-surface"
                  style={{ backgroundColor: photo.color }}
                >
                  <Image
                    src={thumbSrc(photo.publicId)}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, 46vw"
                    loading={index < 3 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-95"
                  />
                </div>
              </ViewTransition>

              <p className="mt-3 text-[15px] leading-snug sm:text-base">
                {photo.title}
              </p>
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
