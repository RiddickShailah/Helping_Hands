"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, MapPin, Heart, Camera } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/campaigns", label: "Campaigns", icon: Heart },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/stories", label: "Stories", icon: Camera },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden flex border-t border-stone-200 bg-white">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex-1 flex flex-col items-center py-2 text-[10px] font-medium",
              active ? "text-teal" : "text-slate"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
