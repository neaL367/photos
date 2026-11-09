"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, ViewTransition } from "react";

import { thumbSrc } from "@/lib/cloudinary";
import { formatTimestamp } from "@/lib/format";
import type { Photo } from "@/lib/photos";

const WIDE = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(WIDE).matches ? 3 : 2;
}

function getServerSnapshot() {
  return 2;
}

/**
 * Fills the shortest column first, using each photo's aspect ratio to estimate
 * its height. Photos therefore read left to right across the top row while the
 * columns stay balanced.
 */
function distribute(photos: Photo[], count: number) {
  const columns: Photo[][] = Array.from({ length: count }, () => []);
  const heights = new Array<number>(count).fill(0);

  for (const photo of photos) {
    let shortest = 0;

    for (let index = 1; index < count; index += 1) {
      if (heights[index] < heights[shortest]) {
        shortest = index;
      }
    }

    columns[shortest].push(photo);
    // Aspect ratio plus roughly one caption's worth of column width.
    heights[shortest] += photo.height / photo.width + 0.16;
  }

  return columns;
}

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const columns = useColumnCount();
  const distributed = distribute(photos, columns);
  const eager = new Set(photos.slice(0, 4).map((photo) => photo.id));

  return (
    <div
      className="grid items-start gap-x-4 sm:gap-x-6 lg:gap-x-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {distributed.map((column, columnIndex) => (
        <ul key={columnIndex} className="flex flex-col gap-y-8 sm:gap-y-10">
          {column.map((photo) => {
            const meta = [photo.location, formatTimestamp(photo.date)]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={photo.id}>
                <Link
                  href={`/photo/${photo.id}`}
                  prefetch={true}
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
                        loading={eager.has(photo.id) ? "eager" : "lazy"}
                        fetchPriority={
                          photo.id === photos[0]?.id ? "high" : "auto"
                        }
                        className="object-cover transition duration-700 ease-out group-hover:opacity-90"
                      />
                    </div>
                  </ViewTransition>

                  <ViewTransition
                    name={`photo-title-${photo.id}`}
                    share="morph"
                    default="none"
                  >
                    <p className="mt-3 text-[14px] leading-snug">
                      {photo.title}
                    </p>
                  </ViewTransition>
                  {meta ? (
                    <ViewTransition
                      name={`photo-meta-${photo.id}`}
                      share="morph"
                      default="none"
                    >
                      <p className="mt-0.5 text-[11px] tracking-wide text-muted">
                        {meta}
                      </p>
                    </ViewTransition>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}

function useColumnCount() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
