import type { Photo } from "./photos";

/**
 * Lists photos from the Cloudinary account configured through environment
 * variables.
 *
 * Required:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Optional:
 *   CLOUDINARY_FOLDER — when omitted, the whole account is listed.
 *
 * The key and secret are server-only and must never use a NEXT_PUBLIC_ prefix.
 */
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
const folder = process.env.CLOUDINARY_FOLDER?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const config =
  cloud && apiKey && apiSecret
    ? { cloud, folder: folder || null, apiKey, apiSecret }
    : null;

export const isCloudinaryAdminConfigured = config !== null;

type CloudinaryResource = {
  public_id: string;
  display_name?: string;
  created_at?: string;
  width?: number;
  height?: number;
  format?: string;
  context?: {
    custom?: Record<string, string>;
  };
};

type CloudinaryListResponse = {
  resources?: CloudinaryResource[];
  next_cursor?: string;
};

const MAX_PAGES = 5;
const PAGE_SIZE = 200;

const TONES = [
  "#c9c2b6",
  "#b8c1c2",
  "#cbb9a8",
  "#aeb8ac",
  "#c6bdb2",
  "#b3b0a8",
];

function toneFor(id: string) {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }

  return TONES[hash % TONES.length];
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "photo"
  );
}

function titleFor(resource: CloudinaryResource) {
  const caption = resource.context?.custom?.caption?.trim();

  if (caption) {
    return caption;
  }

  const name =
    resource.display_name?.trim() ||
    resource.public_id.split("/").pop() ||
    "Untitled";

  return (
    name
      // Cloudinary appends a random six-character suffix on upload.
      .replace(/_[a-z0-9]{6}$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^\w/, (character) => character.toUpperCase()) || "Untitled"
  );
}

async function listFolder(): Promise<Photo[]> {
  if (!config) {
    return [];
  }

  const {
    cloud,
    folder: prefixFolder,
    apiKey: key,
    apiSecret: secret,
  } = config;
  const prefix = prefixFolder
    ? prefixFolder.endsWith("/")
      ? prefixFolder
      : `${prefixFolder}/`
    : null;
  const scope = prefix ? `"${prefix}"` : "the account";
  const authorization = `Basic ${Buffer.from(`${key}:${secret}`).toString(
    "base64",
  )}`;

  const resources: CloudinaryResource[] = [];
  let cursor: string | undefined;

  try {
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const params = new URLSearchParams({
        max_results: String(PAGE_SIZE),
        context: "true",
      });

      if (prefix) {
        params.set("prefix", prefix);
      }

      if (cursor) {
        params.set("next_cursor", cursor);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/resources/image?${params.toString()}`,
        {
          headers: { Authorization: authorization },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        console.warn(
          `[cloudinary] Could not list ${scope} (${response.status} ${response.statusText}).`,
        );
        return [];
      }

      const data = (await response.json()) as CloudinaryListResponse;
      resources.push(...(data.resources ?? []));

      cursor = data.next_cursor;

      if (!cursor) {
        break;
      }
    }
  } catch (error) {
    console.warn(`[cloudinary] Could not list ${scope}.`, error);
    return [];
  }

  const usedIds = new Map<string, number>();

  return resources
    .filter(
      (resource) =>
        Boolean(resource.width) &&
        Boolean(resource.height) &&
        resource.format !== "svg" &&
        Boolean(resource.public_id),
    )
    .sort((left, right) =>
      (right.created_at ?? "").localeCompare(left.created_at ?? ""),
    )
    .map((resource) => {
      const title = titleFor(resource);
      const baseId = slugify(title === "Untitled" ? resource.public_id : title);
      const count = (usedIds.get(baseId) ?? 0) + 1;
      usedIds.set(baseId, count);

      const id = count === 1 ? baseId : `${baseId}-${count}`;
      const parsedYear = resource.created_at
        ? new Date(resource.created_at).getFullYear()
        : undefined;
      const year =
        parsedYear !== undefined && Number.isFinite(parsedYear)
          ? parsedYear
          : undefined;

      return {
        id,
        publicId: resource.public_id,
        title,
        location: resource.context?.custom?.location?.trim() || undefined,
        year,
        width: Math.round(resource.width as number),
        height: Math.round(resource.height as number),
        alt: resource.context?.custom?.alt?.trim() || title,
        color: toneFor(id),
      } satisfies Photo;
    });
}

export async function fetchPhotosFromCloudinary(): Promise<Photo[]> {
  return listFolder();
}
