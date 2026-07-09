import { Lock, Shield, BadgeCheck } from "lucide-react";

export default function TrustBadges({ compact = false }: { compact?: boolean }) {
  const items = [
    { icon: Lock, label: "Encrypted checkout" },
    { icon: Shield, label: "Fraud protection" },
    { icon: BadgeCheck, label: "Verified platform" },
  ];

  return (
    <div className={`flex ${compact ? "gap-3" : "flex-wrap gap-4 justify-center"}`}>
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={`inline-flex items-center gap-1.5 text-slate ${compact ? "text-[10px]" : "text-xs"}`}
        >
          <Icon size={compact ? 12 : 14} className="text-teal shrink-0" />
          {label}
        </div>
      ))}
    </div>
  );
}
