"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { parseGallery, progressPct } from "@/lib/types";
import { donate, volunteer } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import SecureCheckout from "@/components/SecureCheckout";

const PRESETS = [25, 50, 100];

export default function CampaignDetailClient({ campaign }: { campaign: Campaign }) {
  const { user } = useAuth();
  const gallery = parseGallery(campaign);
  const allPhotos = [campaign.coverImageUrl, ...gallery].filter(Boolean) as string[];
  const pct = progressPct(campaign);
  const [tab, setTab] = useState<"donate" | "volunteer">("donate");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");

  const effectiveAmount = customAmount ? Number(customAmount) : amount;
  const displayName = donorName || user?.name || "";
  const displayEmail = donorEmail || user?.email || "";

  async function recordDonation(receipt: { transactionId: string; last4: string }) {
    await donate(campaign.id, {
      donorName: displayName,
      donorEmail: displayEmail,
      amount: effectiveAmount,
      message: message || undefined,
    });
    setMsg(`Thank you! $${effectiveAmount} donated · Ref ${receipt.transactionId}`);
  }

  function handleDonateContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !displayEmail.trim()) {
      setMsg("Please enter your name and email, or sign in to auto-fill.");
      return;
    }
    if (!effectiveAmount || effectiveAmount < 1) {
      setMsg("Please choose a valid donation amount.");
      return;
    }
    setMsg("");
    setCheckoutOpen(true);
  }

  async function handleVolunteer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      await volunteer(campaign.id, {
        name: (fd.get("name") as string) || user?.name || "",
        email: (fd.get("email") as string) || user?.email || "",
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
            <form onSubmit={handleDonateContinue} className="mt-4 space-y-3">
              {user ? (
                <div className="flex items-center gap-2 text-xs text-teal bg-teal/5 border border-teal/20 rounded-lg px-3 py-2">
                  <ShieldCheck size={14} />
                  Signed in as <span className="font-semibold">{user.name}</span> — details auto-filled
                </div>
              ) : (
                <p className="text-xs text-slate">
                  <Link href="/login" className="text-teal font-medium hover:underline">Sign in</Link>
                  {" "}to auto-fill your details securely.
                </p>
              )}

              {!user && (
                <>
                  <input
                    name="name"
                    required
                    placeholder="Your name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                </>
              )}

              <div>
                <p className="text-xs font-medium text-slate mb-2">Choose amount</p>
                <div className="flex gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setAmount(p); setCustomAmount(""); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${
                        amount === p && !customAmount
                          ? "bg-teal text-white border-teal"
                          : "bg-white text-slate border-stone-200 hover:border-teal/40"
                      }`}
                    >
                      ${p}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  placeholder="Custom amount ($)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full mt-2 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>

              <textarea
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-teal/30"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-lg font-semibold hover:bg-coral/90"
              >
                <Lock size={16} />
                Continue to secure checkout
              </button>
              <p className="text-[10px] text-center text-slate">
                Demo Visa 4242 ·••• 4242 · no real charges
              </p>
            </form>
          ) : (
            <form onSubmit={handleVolunteer} className="mt-4 space-y-3">
              {user ? (
                <div className="text-xs text-teal bg-teal/5 border border-teal/20 rounded-lg px-3 py-2">
                  Volunteering as <span className="font-semibold">{user.name}</span>
                </div>
              ) : (
                <>
                  <input name="name" required placeholder="Your name" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                  <input name="email" type="email" required placeholder="Email" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm" />
                </>
              )}
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

      <SecureCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        amount={effectiveAmount}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        onSuccess={recordDonation}
      />
    </div>
  );
}
