import Link from "next/link";
import { Heart, Lock } from "lucide-react";
import TrustBadges from "@/components/TrustBadges";

export default function SecurityFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-display text-lg text-teal-dark">
              <Heart size={18} className="text-coral fill-coral" />
              Helping Hands
            </div>
            <p className="text-xs text-slate mt-2 max-w-sm leading-relaxed">
              A secure community platform for local giving. All payments run through encrypted demo checkout — no real charges.
            </p>
          </div>
          <TrustBadges />
        </div>
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate">
          <span className="inline-flex items-center gap-1">
            <Lock size={10} className="text-teal" />
            Demo environment · PCI-ready patterns · JWT session auth
          </span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-teal">Sign in</Link>
            <Link href="/campaigns" className="hover:text-teal">Campaigns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
