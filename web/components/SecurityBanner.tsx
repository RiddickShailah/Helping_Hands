"use client";

import { Lock, ShieldCheck, CreditCard } from "lucide-react";

export default function SecurityBanner() {
  return (
    <div className="bg-teal-dark text-white text-xs">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <Lock size={12} className="text-teal-light" />
          256-bit TLS encryption
        </span>
        <span className="hidden sm:inline text-white/30">·</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-teal-light" />
          PCI-ready demo checkout
        </span>
        <span className="hidden sm:inline text-white/30">·</span>
        <span className="inline-flex items-center gap-1.5">
          <CreditCard size={12} className="text-teal-light" />
          No real charges in demo mode
        </span>
      </div>
    </div>
  );
}
