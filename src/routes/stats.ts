import { Router } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// GET /api/stats — aggregate platform metrics for a live dashboard / demo view
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [campaignCount, activeCampaigns, donationAgg, volunteerAgg, volunteerCount] =
      await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: "ACTIVE" } }),
        prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
        prisma.volunteerCommitment.aggregate({ _sum: { hoursCommitted: true } }),
        prisma.volunteerCommitment.count(),
      ]);

    res.json({
      totalCampaigns: campaignCount,
      activeCampaigns,
      totalDonations: donationAgg._count,
      totalAmountRaised: donationAgg._sum.amount ?? 0,
      totalVolunteers: volunteerCount,
      totalVolunteerHoursCommitted: volunteerAgg._sum.hoursCommitted ?? 0,
    });
  })
);

export default router;
