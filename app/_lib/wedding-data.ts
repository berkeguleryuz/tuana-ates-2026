import "server-only";
import { cache } from "react";
import type { WeddingData, FamilyInfo } from "./types";
import { upstreamUrl } from "./upstream";

interface InvitationApiResponse {
  invitation: {
    groomName: string;
    brideName: string;
    weddingDate: string;
    weddingTime?: string;
    venueName?: string;
    venueAddress?: string;
    address?: string;
    hasGallery: boolean;
    hasMemoryBook: boolean;
    inviteCode: string;
    groomFamily: FamilyInfo | null;
    brideFamily: FamilyInfo | null;
    eventSchedule: { time: string; label: string }[];
    storyMilestones: {
      date?: string;
      title?: string;
      description?: string;
      imageUrl?: string;
    }[];
  };
}

export const getWeddingData = cache(async (): Promise<WeddingData> => {
  const res = await fetch(upstreamUrl(""), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Düğün verisi alınamadı (HTTP ${res.status}).`);
  }

  const data = (await res.json()) as InvitationApiResponse;
  const i = data.invitation;

  return {
    brideName: i.brideName,
    groomName: i.groomName,
    weddingDate: i.weddingDate,
    weddingTime: i.weddingTime || "",
    venueName: i.venueName || "",
    venueAddress: i.venueAddress || "",
    address: i.address || "",
    hasGallery: i.hasGallery,
    hasMemoryBook: i.hasMemoryBook,
    inviteCode: i.inviteCode,
    brideFamily: i.brideFamily,
    groomFamily: i.groomFamily,
    eventSchedule: i.eventSchedule || [],
    storyMilestones: (i.storyMilestones || []).map((m) => ({
      date: m.date || "",
      title: m.title || "",
      description: m.description || "",
      imageUrl: m.imageUrl || "",
    })),
  };
});
