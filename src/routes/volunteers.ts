import { Router } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAuth } from "../middleware/auth";
import { createVolunteerSchema, updateVolunteerSchema } from "../types/schemas";

const router = Router({ mergeParams: true });

// GET /api/campaigns/:campaignId/volunteers
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const volunteers = await prisma.volunteerCommitment.findMany({
      where: { campaignId },
      orderBy: { createdAt: "desc" },
    });
    res.json(volunteers);
  })
);

// POST /api/campaigns/:campaignId/volunteers — commit to volunteer for a campaign
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const data = createVolunteerSchema.parse(req.body);

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw ApiError.notFound("Campaign not found");
    if (campaign.status !== "ACTIVE") {
      throw ApiError.badRequest("Volunteer commitments can only be made for active campaigns");
    }

    const commitment = await prisma.volunteerCommitment.create({
      data: { ...data, campaignId },
    });
    res.status(201).json(commitment);
  })
);

export default router;

// Separate router mounted at /api/volunteers for direct status/hours updates by id.
export const volunteerByIdRouter = Router();

volunteerByIdRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = updateVolunteerSchema.parse(req.body);
    const existing = await prisma.volunteerCommitment.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Volunteer commitment not found");

    const updated = await prisma.volunteerCommitment.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  })
);
