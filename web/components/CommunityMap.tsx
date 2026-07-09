"use client";

import { useEffect, useRef, useState } from "react";
import type { Campaign } from "@/lib/types";

interface CommunityMapProps {
  campaigns: Campaign[];
  highlightId?: string;
  onSelect?: (id: string) => void;
}

export default function CommunityMap({ campaigns, highlightId, onSelect }: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<import("leaflet").Map | null>(null);
  const [ready, setReady] = useState(false);

  const mappable = campaigns.filter((c) => c.latitude != null && c.longitude != null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([33.749, -84.388], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mappable.forEach((c) => {
        const marker = L.marker([c.latitude!, c.longitude!]).addTo(map);
        marker.bindPopup(
          `<strong>${c.title}</strong><br/><em>${c.neighborhood ?? ""}</em><br/>$${c.raisedAmount.toLocaleString()} raised`
        );
        marker.on("click", () => onSelect?.(c.id));
        if (c.id === highlightId) {
          marker.openPopup();
          map.setView([c.latitude!, c.longitude!], 14);
        }
      });

      mapInstance.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [campaigns, highlightId, onSelect]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-[420px] md:h-[520px]">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-slate text-sm z-10">
          Loading community map…
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute bottom-3 left-3 bg-white/95 rounded-full px-3 py-1 text-xs text-slate shadow z-[400]">
        {mappable.length} campaigns pinned in your community
      </div>
    </div>
  );
}
