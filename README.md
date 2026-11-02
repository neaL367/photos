# Frames

A minimal personal photo gallery. Next.js 16, React 19, Tailwind CSS v4, Geist Serif, and Cloudinary.

Photos are read from a Cloudinary folder, so the repo contains no image files.

## Run

```bash
bun install
cp .env.example .env.local
# fill in the four values below
bun dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_FOLDER` | Folder to list, e.g. `photos/personal` |
| `CLOUDINARY_API_KEY` | Admin API key (server only) |
| `CLOUDINARY_API_SECRET` | Admin API secret (server only) |

The folder is listed server-side, newest first, up to 1,000 images, then cached with `'use cache'`. Without these values the index shows an empty state. Never prefix the key or secret with `NEXT_PUBLIC_`.

Optional Cloudinary context metadata:

| Key | Used for |
| --- | --- |
| `caption` | Title |
| `location` | Subtitle |
| `alt` | Accessible description |

## How it works

- **Cache Components + PPR** — `cacheComponents: true`. Photo data is cached; the footer timestamp streams through a `<Suspense>` hole over the static shell.
- **View transitions** — thumbnail-to-hero morph, directional forward/back slides, and a pinned header. Reduced motion is respected.
- **Cloudinary loader** — 4:5 smart-cropped thumbnails, width-limited full frames, `f_auto` and `q_auto` for format and quality.
- **Revalidation** — call `revalidateTag("photos")` after changing the folder.

## Scripts

```bash
bun dev
bun build
bun start
bun lint
```
