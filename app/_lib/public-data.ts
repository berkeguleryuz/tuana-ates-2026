import "server-only";
import { cache } from "react";
import { upstreamUrl } from "./upstream";

export interface GalleryPhoto {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  uploader: string;
}

export interface MemoryEntry {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

interface UpstreamPhoto {
  _id?: string;
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  uploader?: string;
}

interface UpstreamMemory {
  _id?: string;
  authorName?: string;
  message?: string;
  createdAt?: string;
}

export const getGalleryPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  try {
    const res = await fetch(upstreamUrl("/gallery"), { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { photos?: UpstreamPhoto[] };
    if (!Array.isArray(data?.photos)) return [];
    return data.photos.map((p) => ({
      id: p._id ?? "",
      name: p.name ?? "",
      url: p.url ?? "",
      thumbnailUrl: p.thumbnailUrl ?? p.url ?? "",
      uploader: p.uploader ?? "",
    }));
  } catch {
    return [];
  }
});

export const getMemories = cache(async (): Promise<MemoryEntry[]> => {
  try {
    const res = await fetch(upstreamUrl("/memories"), { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { memories?: UpstreamMemory[] };
    if (!Array.isArray(data?.memories)) return [];
    return data.memories.map((m) => ({
      id: m._id ?? "",
      authorName: m.authorName ?? "",
      message: m.message ?? "",
      createdAt: m.createdAt ?? "",
    }));
  } catch {
    return [];
  }
});
