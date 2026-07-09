"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { parseGallery, progressPct } from "@/lib/types";
import { donate, volunteer } from "@/lib/api";

export default function CampaignDetailClient({ campaign }: { campaign: Campaign }) {
  const gallery = parseGallery(campaign);
  const allPhotos = [campaign.coverImageUrl, ...gallery].filter(Boolean) as string[];
  const pct = progressPct(campaign);
  const [tab, setTab] = useState<"donate" | "volunteer">("donate");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDonate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      await donate(campaign.id, {
        donorName: fd.get("name") as string,
        donorEmail: fd.get("email") as string,
        amount: Number(fd.get("amount")),
        message: (fd.get("message") as string) || undefined,
      });
      setMsg("Thank you! Your donation was recorded.");
    } catch {
      setMsg("Could not reach API — start the backend with npm run dev (port 4000).");
    }
    setLoading(false);
  }

  async function handleVolunteer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      await volunteer(campaign.id, {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        role: fd.get("role") as string,
        hoursCommitted: Number(fd.get("hours")),
      });
      setMsg("You're signed up! The organizer will confirm soon.");
    } catch {
      setMsg("Could not reach API — start the backend with npm run dev (port 4000).");
    }
    setLoading(false);
  }

  return (
    <div>
      <Link href="/campaigns" className="inline-flex items-center gap-1 text-sm text-teal mb-4 hover:underline">
        <ArrowLeft size={16} /> All campaigns
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
            <Image src={allPhotos[0]} alt={campaign.title} fill className="object-cover" priority sizes="600px" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allPhotos.slice(1, 5).map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-teal uppercase tracking-wide">{campaign.category}</span>
          <h1 className="font-display text-3xl text-ink mt-1">{campaign.title}</h1>
          {campaign.neighborhood && (
            <Link
              href={`/map?id=${campaign.id}`}
              className="flex items-center gap-1 text-sm text-slate mt-2 hover:text-teal"
            >
              <MapPin size={14} /> {campaign.neighborhood} · View on map
            </Link>
          )}
          <p className="text-slate mt-4 leading-relaxed">{campaign.description}</p>

          <div className="mt-6 p-4 rounded-xl bg-white border border-stone-200">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-teal">${campaign.raisedAmount.toLocaleString()} raised</span>
              <span className="text-slate">Goal ${campaign.goalAmount.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-slate mt-2">{pct}% funded</p>
          </div>

          <div className="flex gap-2 mt-6">
            {(["donate", "volunteer"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${
                  tab === t ? "bg-teal text-white" : "bg-stone-100 text-slate"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "donate" ? (
            <form onSubmit={handleDonate} className="mt-4 space-y-3">
              <input name="name" required placeholder="Your name" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <input name="email" type="email" required placeholder="Email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <input name="amount" type="number" min="1" required placeholder="Amount ($)" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <textarea name="message" placeholder="Message (optional)" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm min-h-[60px]" />
              <button type="submit" disabled={loading} className="w-full bg-coral text-white py-3 rounded-lg font-semibold disabled:opacity-50">
                Donate now
              </button>
            </form>
          ) : (
            <form onSubmit={handleVolunteer} className="mt-4 space-y-3">
              <input name="name" required placeholder="Your name" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <input name="email" type="email" required placeholder="Email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <input name="role" required placeholder="How you'd like to help" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <input name="hours" type="number" min="1" required placeholder="Hours you can commit" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={loading} className="w-full bg-teal text-white py-3 rounded-lg font-semibold disabled:opacity-50">
                Volunteer
              </button>
            </form>
          )}
          {msg && <p className="text-sm mt-3 text-teal-dark">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
