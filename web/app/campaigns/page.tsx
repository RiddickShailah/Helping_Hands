import CampaignCard from "@/components/CampaignCard";
import { fetchCampaigns } from "@/lib/api";

export default async function CampaignsPage() {
  const campaigns = await fetchCampaigns();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Community Campaigns</h1>
      <p className="text-slate text-sm mb-8">
        {campaigns.length} active ways to support your neighbors — with photos, progress bars, and map locations.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    </div>
  );
}
