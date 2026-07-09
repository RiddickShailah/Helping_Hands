export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  coverImageUrl?: string | null;
  galleryImages?: string;
  neighborhood?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  organizer?: { id: string; name: string };
  _count?: { donations: number; volunteers: number };
}

export function parseGallery(campaign: Campaign): string[] {
  if (!campaign.galleryImages) return [];
  try {
    return JSON.parse(campaign.galleryImages) as string[];
  } catch {
    return [];
  }
}

export function progressPct(c: Campaign): number {
  if (!c.goalAmount) return 0;
  return Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100));
}
