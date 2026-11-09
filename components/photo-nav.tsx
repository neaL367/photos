import Image from "next/image";
import Link from "next/link";

import { thumbSrc } from "@/lib/cloudinary";
import { formatDate } from "@/lib/format";
import type { Photo } from "@/lib/photos";

type Direction = "previous" | "next";

/**
 * Previous and next frames, shown as small previews with their title and date
 * so the next step is legible before it is taken.
 */
export function PhotoNav({
  previous,
  next,
}: {
  previous: Photo | null;
  next: Photo | null;
}) {
  return (
    <nav
      aria-label="Photographs"
      className="mt-16 grid grid-cols-2 items-start gap-4 border-t border-line pt-6 sm:gap-8"
    >
      <PhotoNavLink photo={previous} direction="previous" />
      <PhotoNavLink photo={next} direction="next" />
    </nav>
  );
}

function PhotoNavLink({
  photo,
  direction,
}: {
  photo: Photo | null;
  direction: Direction;
}) {
  if (!photo) {
    return <span />;
  }

  const isNext = direction === "next";
  const date = formatDate(photo.date);
  const key = isNext ? "ArrowRight" : "ArrowLeft";

  return (
    <Link
      href={`/photo/${photo.id}`}
      prefetch={true}
      transitionTypes={[isNext ? "nav-forward" : "nav-back"]}
      data-photo-nav={direction}
      aria-label={`${isNext ? "Next" : "Previous"} photograph: ${photo.title}`}
      aria-keyshortcuts={key}
      className={`group flex min-w-0 items-start gap-4 outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
        isNext ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span
        // Keep the frame's own ratio so a vertical photograph reads as one.
        className="relative hidden h-20 shrink-0 overflow-hidden bg-surface sm:block"
        style={{
          width: Math.round(80 * (photo.width / photo.height)),
          backgroundColor: photo.color,
        }}
      >
        <Image
          src={thumbSrc(photo.publicId)}
          alt=""
          fill
          sizes="160px"
          className="object-cover transition duration-700 ease-out group-hover:opacity-80"
        />
      </span>

      <span className="flex min-w-0 flex-col">
        <span
          className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted ${
            isNext ? "justify-end" : ""
          }`}
        >
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${
              isNext
                ? "group-hover:translate-x-0.5"
                : "group-hover:-translate-x-0.5"
            }`}
          >
            {isNext ? "→" : "←"}
          </span>
          {isNext ? "Next" : "Previous"}
        </span>

        <span className="mt-1.5 block truncate text-[15px] leading-snug group-hover:underline group-hover:underline-offset-4">
          {photo.title}
        </span>

        {date ? (
          <span className="mt-1 block text-[11px] tracking-wide text-muted">
            {date}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
