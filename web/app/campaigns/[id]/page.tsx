import { notFound } from "next/navigation";
import CampaignDetailClient from "@/components/CampaignDetailClient";
import { fetchCampaign } from "@/lib/api";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = await fetchCampaign(params.id);
  if (!campaign) notFound();
  return <CampaignDetailClient campaign={campaign} />;
}
