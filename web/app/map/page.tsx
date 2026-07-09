"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { fetchCampaignsClient } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { useEffect, useState } from "react";

const CommunityMap = dynamic(() => import("@/components/CommunityMap"), { ssr: false });

function MapContent() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("id") ?? undefined;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaignsClient().then(setCampaigns);
  }, []);

  useEffect(() => {
    if (highlight && campaigns.length) {
      setSelected(campaigns.find((c) => c.id === highlight) ?? null);
    }
  }, [highlight, campaigns]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CommunityMap
          campaigns={campaigns}
          highlightId={selected?.id ?? highlight}
          onSelect={(id) => setSelected(campaigns.find((c) => c.id === id) ?? null)}
        />
      </div>
      <div className="space-y-3 max-h-[520px] overflow-y-auto">
        <h2 className="font-display text-lg sticky top-0 bg-cream py-2">Pinned campaigns</h2>
        {campaigns.filter((c) => c.latitude).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c)}
            className={`w-full text-left rounded-xl border p-3 flex gap-3 transition-colors ${
              selected?.id === c.id ? "border-teal bg-teal/5" : "border-stone-200 bg-white hover:border-teal/40"
            }`}
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={c.coverImageUrl ?? "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&q=80"}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{c.title}</p>
              <p className="text-xs text-slate">{c.neighborhood}</p>
            </div>
          </button>
        ))}
        {selected && (
          <Link
            href={`/campaigns/${selected.id}`}
            className="block text-center text-sm text-teal font-medium pt-2 hover:underline"
          >
            View {selected.title} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Community Map</h1>
      <p className="text-slate text-sm mb-6">
        Every campaign is pinned where the work happens. Click a marker or list item to learn more.
      </p>
      <Suspense fallback={<div className="h-96 bg-stone-100 rounded-2xl animate-pulse" />}>
        <MapContent />
      </Suspense>
    </div>
  );
}
