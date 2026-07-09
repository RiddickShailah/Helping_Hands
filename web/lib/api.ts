import type { Campaign } from "./types";
import { MOCK_CAMPAIGNS } from "./mock-campaigns";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchCampaignsClient(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API}/api/campaigns?limit=50`);
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data as Campaign[];
  } catch {
    return MOCK_CAMPAIGNS;
  }
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API}/api/campaigns?limit=50`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    return json.data as Campaign[];
  } catch {
    return MOCK_CAMPAIGNS;
  }
}

export async function fetchCampaign(id: string): Promise<Campaign | null> {
  try {
    const res = await fetch(`${API}/api/campaigns/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Not found");
    return (await res.json()) as Campaign;
  } catch {
    return MOCK_CAMPAIGNS.find((c) => c.id === id) ?? null;
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API}/api/stats`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return {
      totalCampaigns: MOCK_CAMPAIGNS.length,
      activeCampaigns: MOCK_CAMPAIGNS.length,
      totalDonations: 48,
      totalAmountRaised: MOCK_CAMPAIGNS.reduce((s, c) => s + c.raisedAmount, 0),
      totalVolunteers: 32,
      totalVolunteerHoursCommitted: 186,
    };
  }
}

export async function donate(campaignId: string, data: {
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
}) {
  const res = await fetch(`${API}/api/campaigns/${campaignId}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Donation failed");
  return res.json();
}

export async function volunteer(campaignId: string, data: {
  name: string;
  email: string;
  role: string;
  hoursCommitted: number;
}) {
  const res = await fetch(`${API}/api/campaigns/${campaignId}/volunteers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Volunteer signup failed");
  return res.json();
}
