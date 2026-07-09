import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { parseGallery, progressPct } from "@/lib/types";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct = progressPct(campaign);
  const gallery = parseGallery(campaign);

  return (
    <article className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/campaigns/${campaign.id}`} className="block relative aspect-[16/10]">
        <Image
          src={campaign.coverImageUrl ?? gallery[0] ?? "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"}
          alt={campaign.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 400px"
        />
        <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-2.5 py-1 rounded-full text-teal-dark">
          {campaign.category}
        </span>
      </Link>
      <div className="p-4">
        <Link href={`/campaigns/${campaign.id}`}>
          <h3 className="font-display text-lg text-ink hover:text-teal transition-colors">
            {campaign.title}
          </h3>
        </Link>
        {campaign.neighborhood && (
          <p className="flex items-center gap-1 text-xs text-slate mt-1">
            <MapPin size={12} /> {campaign.neighborhood}
          </p>
        )}
        <p className="text-sm text-slate mt-2 line-clamp-2">{campaign.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-teal">${campaign.raisedAmount.toLocaleString()} raised</span>
            <span className="text-slate">{pct}% of ${campaign.goalAmount.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal to-teal-light rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {campaign._count && (
          <p className="flex items-center gap-1 text-xs text-slate mt-3">
            <Users size={12} /> {campaign._count.volunteers} volunteers · {campaign._count.donations} donations
          </p>
        )}
        {gallery.length > 1 && (
          <div className="flex gap-1.5 mt-3 overflow-x-auto">
            {gallery.slice(0, 4).map((url) => (
              <div key={url} className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <Image src={url} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
