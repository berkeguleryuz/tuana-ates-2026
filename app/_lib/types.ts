export interface PersonName {
  firstName: string;
  lastName: string;
}

export interface FamilyInfo {
  father: PersonName;
  mother: PersonName;
}

export interface WeddingData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  address: string;
  hasGallery: boolean;
  hasMemoryBook: boolean;
  inviteCode: string;
  groomFamily: FamilyInfo | null;
  brideFamily: FamilyInfo | null;
  eventSchedule: { time: string; label: string }[];
  storyMilestones: {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
  }[];
}
