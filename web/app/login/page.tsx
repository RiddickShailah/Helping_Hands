"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Building2, Loader2 } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/lib/demo-credentials";
import { useAuth } from "@/components/AuthProvider";
import TrustBadges from "@/components/TrustBadges";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  if (user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Invalid email or password. Try a demo account below.");
    }
    setLoading(false);
  }

  async function handleDemoLogin(key: keyof typeof DEMO_ACCOUNTS) {
    const account = DEMO_ACCOUNTS[key];
    setDemoLoading(key);
    setError("");
    try {
      await login(account.email, account.password);
      router.push("/");
    } catch {
      setError("Could not sign in — make sure the API is running on port 4000.");
    }
    setDemoLoading(null);
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal/10 text-teal mb-4">
          <ShieldCheck size={28} />
        </div>
        <h1 className="font-display text-3xl text-ink">Sign in securely</h1>
        <p className="text-sm text-slate mt-2">
          Your session is encrypted and protected. Demo accounts are available below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-slate block mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-medium text-slate block mb-1">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Sign in
        </button>
      </form>

      <div className="mt-8">
        <p className="text-xs font-semibold text-slate uppercase tracking-wide text-center mb-3">
          One-click demo login
        </p>
        <div className="space-y-3">
          {(Object.entries(DEMO_ACCOUNTS) as [keyof typeof DEMO_ACCOUNTS, typeof DEMO_ACCOUNTS.donor][]).map(
            ([key, account]) => (
              <button
                key={key}
                type="button"
                disabled={demoLoading !== null}
                onClick={() => handleDemoLogin(key)}
                className="w-full flex items-start gap-3 p-4 rounded-xl border border-stone-200 bg-white hover:border-teal/40 hover:bg-teal/5 transition-colors text-left disabled:opacity-50"
              >
                <div className="p-2 rounded-lg bg-stone-100 text-teal shrink-0">
                  {key === "organizer" ? <Building2 size={18} /> : <User size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ink">{account.label}</p>
                  <p className="text-xs text-slate mt-0.5">{account.description}</p>
                  <p className="text-[11px] font-mono text-teal mt-1.5">{account.email}</p>
                </div>
                {demoLoading === key && <Loader2 size={16} className="animate-spin text-teal shrink-0 mt-1" />}
              </button>
            )
          )}
        </div>
        <p className="text-[11px] text-center text-slate mt-3">
          Demo password for all accounts: <code className="font-mono bg-stone-100 px-1 rounded">password123</code>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-stone-200">
        <TrustBadges />
        <p className="text-[11px] text-center text-slate mt-4 leading-relaxed">
          Sessions use JWT tokens stored in your browser session only — cleared when you close the tab.
          {" "}
          <Link href="/campaigns" className="text-teal hover:underline">Browse without signing in →</Link>
        </p>
      </div>
    </div>
  );
}
