# Frames

A minimal personal photo gallery. Next.js 16, React 19, Tailwind CSS v4, Geist Serif, and Cloudinary.

Photos are read from Cloudinary, so the repo contains no image files.

## Run

```bash
bun install
cp .env.example .env.local
# fill in the cloud name, key, and secret
bun dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Admin API key (server only) |
| `CLOUDINARY_API_SECRET` | Admin API secret (server only) |
| `CLOUDINARY_FOLDER` | Optional folder, e.g. `photos/personal`. Empty lists everything |

Photos are listed server-side, newest first, up to 1,000 images, then cached with `'use cache'`. Without the three required values the index shows an empty state. Never prefix the key or secret with `NEXT_PUBLIC_`.

Optional Cloudinary context metadata:

| Key | Used for |
| --- | --- |
| `caption` | Title when no entry exists in `lib/photo-titles.ts` |
| `location` | Subtitle, shown before the date |
| `alt` | Accessible description |

Titles are curated in `lib/photo-titles.ts`, keyed by public ID; anything new falls back to its filename. Dates and times come from the upload timestamp and are shown in full (`14 July 2026 · 15:48`, UTC).

## How it works

- **Cache Components + PPR** — `cacheComponents: true`. Photo data is cached with `'use cache'`, so the index is served as a static shell and new photos can stream in on demand.
- **View transitions** — thumbnail-to-hero and title morphs, directional forward/back slides, and a pinned header. Reduced motion is respected.
- **Cloudinary loader** — 4:5 smart-cropped thumbnails, width-limited full frames, `f_auto` and `q_auto` for format and quality.
- **Revalidation** — call `revalidateTag("photos")` after adding or removing photos.

## Scripts

```bash
bun dev
bun build
bun start
bun lint
```
