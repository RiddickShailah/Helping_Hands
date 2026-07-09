import Link from "next/link";
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/map", label: "Map" },
  { href: "/stories", label: "Stories" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-teal-dark">
          <Heart size={22} className="text-coral fill-coral" />
          Helping Hands
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-teal transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <BottomNav />
    </header>
  );
}
