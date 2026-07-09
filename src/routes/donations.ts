import { Router } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { createDonationSchema } from "../types/schemas";

const router = Router({ mergeParams: true });

// GET /api/campaigns/:campaignId/donations
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const donations = await prisma.donation.findMany({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });
    res.json(donations);
  })
);

// POST /api/campaigns/:campaignId/donations
// Records the donation and atomically increments the campaign's raisedAmount.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const data = createDonationSchema.parse(req.body);

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw ApiError.notFound("Campaign not found");
    if (campaign.status !== "ACTIVE") {
      throw ApiError.badRequest("Donations can only be made to active campaigns");
    }

    const [donation] = await prisma.$transaction([
      prisma.donation.create({ data: { ...data, campaignId } }),
      prisma.campaign.update({
        where: { id: campaignId },
        data: { raisedAmount: { increment: data.amount } },
      }),
    ]);

    res.status(201).json(donation);
  })
);

export default router;
