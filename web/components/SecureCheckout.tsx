"use client";

import { useState } from "react";
import { Lock, X, Loader2, CheckCircle2, CreditCard } from "lucide-react";
import { DEMO_CARD } from "@/lib/demo-credentials";
import { processDemoPayment } from "@/lib/api";
import TrustBadges from "@/components/TrustBadges";

type Props = {
  open: boolean;
  onClose: () => void;
  amount: number;
  campaignId: string;
  campaignTitle: string;
  onSuccess: (receipt: { transactionId: string; last4: string }) => Promise<void>;
};

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export default function SecureCheckout({
  open,
  onClose,
  amount,
  campaignId,
  campaignTitle,
  onSuccess,
}: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ transactionId: string; last4: string } | null>(null);

  if (!open) return null;

  function fillDemoCard() {
    setCardNumber(formatCardNumber(DEMO_CARD.number));
    setExp(DEMO_CARD.exp);
    setCvc(DEMO_CARD.cvc);
    setZip(DEMO_CARD.zip);
    setError("");
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStep("processing");

    const digits = cardNumber.replace(/\D/g, "");
    const [expMonth, expYear] = exp.split("/");

    try {
      const result = await processDemoPayment({
        cardNumber: digits,
        expMonth: expMonth?.trim() ?? "",
        expYear: expYear?.trim() ?? "",
        cvc,
        zip,
        amount,
        campaignId,
      });

      await onSuccess({ transactionId: result.transactionId, last4: result.last4 });
      setReceipt({ transactionId: result.transactionId, last4: result.last4 });
      setStep("success");
    } catch (err) {
      setStep("form");
      setError(err instanceof Error ? err.message : "Payment could not be processed.");
    }
  }

  function handleClose() {
    setStep("form");
    setError("");
    setReceipt(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-teal-dark text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-teal-light" />
            <div>
              <p className="text-sm font-semibold">Secure checkout</p>
              <p className="text-[11px] text-white/70">Demo sandbox · encrypted connection</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {step === "processing" && (
          <div className="p-10 text-center">
            <Loader2 size={40} className="mx-auto text-teal animate-spin mb-4" />
            <p className="font-semibold text-ink">Securing your payment…</p>
            <p className="text-sm text-slate mt-1">Verifying card and authorizing ${amount.toFixed(2)}</p>
          </div>
        )}

        {step === "success" && receipt && (
          <div className="p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-teal mb-4" />
            <h3 className="font-display text-xl text-ink">Payment authorized</h3>
            <p className="text-sm text-slate mt-2">
              ${amount.toFixed(2)} to <span className="font-medium text-ink">{campaignTitle}</span>
            </p>
            <div className="mt-4 p-3 rounded-lg bg-stone-50 border border-stone-200 text-left text-xs space-y-1">
              <p><span className="text-slate">Transaction ID:</span> {receipt.transactionId}</p>
              <p><span className="text-slate">Card:</span> •••• {receipt.last4}</p>
              <p><span className="text-slate">Status:</span> <span className="text-teal font-medium">Approved (demo)</span></p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full bg-teal text-white py-3 rounded-lg font-semibold text-sm"
            >
              Done
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handlePay} className="p-5 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-slate">Amount due</span>
              <span className="font-display text-2xl text-teal-dark">${amount.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={fillDemoCard}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-teal/30 bg-teal/5 text-teal text-sm font-semibold hover:bg-teal/10 transition-colors"
            >
              <CreditCard size={16} />
              Use demo card (4242 ·••• 4242)
            </button>

            <div>
              <label className="text-xs font-medium text-slate block mb-1">Card number</label>
              <input
                required
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate block mb-1">Expiry</label>
                <input
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={exp}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                    setExp(v);
                  }}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate block mb-1">CVC</label>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate block mb-1">ZIP</label>
                <input
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="30303"
                  maxLength={10}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-lg font-semibold text-sm hover:bg-coral/90 transition-colors"
            >
              <Lock size={16} />
              Pay ${amount.toFixed(2)} securely
            </button>

            <TrustBadges compact />
            <p className="text-[10px] text-center text-slate leading-relaxed">
              Demo mode only — card data is validated locally and never stored. Use the demo Visa ending in 4242.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
