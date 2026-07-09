"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { LogIn, LogOut, UserCircle } from "lucide-react";

export default function NavAuth() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="w-20 h-8 rounded-lg bg-stone-100 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate max-w-[140px]">
          <UserCircle size={16} className="text-teal shrink-0" />
          <span className="truncate">{user.name}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate hover:text-teal px-2 py-1.5 rounded-lg hover:bg-stone-100"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal px-3 py-2 rounded-lg hover:bg-teal-dark transition-colors"
    >
      <LogIn size={14} />
      Sign in
    </Link>
  );
}
