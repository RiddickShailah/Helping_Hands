import Image from "next/image";
import Link from "next/link";
import CampaignCard from "@/components/CampaignCard";
import CommunityMap from "@/components/CommunityMap";
import { fetchCampaigns, fetchStats } from "@/lib/api";

export default async function HomePage() {
  const [campaigns, stats] = await Promise.all([fetchCampaigns(), fetchStats()]);

  return (
    <div className="space-y-12">
      <section className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&q=80"
          alt="Community volunteers"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 text-white max-w-2xl">
          <p className="text-teal-light text-sm font-semibold uppercase tracking-wider mb-2">
            Know your community
          </p>
          <h1 className="font-display text-3xl md:text-5xl leading-tight">
            See the good happening <span className="text-coral">right next door</span>
          </h1>
          <p className="mt-4 text-white/80 text-sm md:text-base leading-relaxed">
            Discover local campaigns on an interactive map, browse photo stories from neighbors,
            donate, and volunteer — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/map" className="rounded-full bg-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-coral/90">
              Explore the Map →
            </Link>
            <Link href="/campaigns" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium hover:bg-white/10">
              Browse Campaigns
            </Link>
            <Link href="/login" className="rounded-full bg-white/15 border border-white/30 px-5 py-2.5 text-sm font-medium hover:bg-white/25">
              Demo sign in →
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active campaigns", value: stats.activeCampaigns },
          { label: "Total raised", value: `$${Math.round(stats.totalAmountRaised).toLocaleString()}` },
          { label: "Volunteers", value: stats.totalVolunteers },
          { label: "Hours committed", value: stats.totalVolunteerHoursCommitted },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-stone-200 p-4 text-center">
            <p className="font-display text-2xl text-teal-dark">{s.value}</p>
            <p className="text-xs text-slate mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl text-ink">Community map</h2>
          <Link href="/map" className="text-sm text-teal hover:underline">Full map →</Link>
        </div>
        <CommunityMap campaigns={campaigns} />
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-4">Featured campaigns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.slice(0, 6).map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-teal-dark text-white p-8 md:p-10 text-center">
        <h2 className="font-display text-2xl mb-2">Your neighborhood needs you</h2>
        <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
          Every pin on the map is a real campaign run by neighbors like you. Pick one and make a difference today.
        </p>
        <Link href="/campaigns" className="inline-block rounded-full bg-coral px-6 py-3 font-semibold text-sm hover:bg-coral/90">
          Find a campaign near you
        </Link>
      </section>
    </div>
  );
}
