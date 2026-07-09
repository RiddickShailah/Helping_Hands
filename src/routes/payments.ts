import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const router = Router();

const DEMO_CARD_PREFIX = "4242";
const DEMO_CARD_FULL = "4242424242424242";

const demoPaymentSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  expMonth: z.string().min(1).max(2),
  expYear: z.string().min(2).max(4),
  cvc: z.string().min(3).max(4),
  zip: z.string().min(3).max(10),
  amount: z.number().positive().max(100_000),
  campaignId: z.string().uuid(),
});

function luhnCheck(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// POST /api/payments/demo — validates demo card and returns a sandbox authorization
router.post(
  "/demo",
  asyncHandler(async (req, res) => {
    const data = demoPaymentSchema.parse(req.body);
    const digits = data.cardNumber.replace(/\D/g, "");

    if (!luhnCheck(digits)) {
      throw ApiError.badRequest("Invalid card number. Use the demo Visa 4242 4242 4242 4242.");
    }

    if (digits !== DEMO_CARD_FULL && !digits.startsWith(DEMO_CARD_PREFIX)) {
      throw ApiError.badRequest("Only demo cards are accepted (Visa ending in 4242).");
    }

    const month = parseInt(data.expMonth, 10);
    if (month < 1 || month > 12) {
      throw ApiError.badRequest("Invalid expiration month.");
    }

    if (data.cvc.length < 3) {
      throw ApiError.badRequest("Invalid security code.");
    }

    // Simulate network latency for realistic UX
    await new Promise((r) => setTimeout(r, 800));

    const transactionId = `HH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    res.status(201).json({
      status: "sandbox_approved",
      transactionId,
      last4: digits.slice(-4),
      amount: data.amount,
      campaignId: data.campaignId,
      brand: "Visa",
      message: "Demo payment authorized — no real charge was made.",
    });
  })
);

export default router;
