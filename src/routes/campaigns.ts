import { Router } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  campaignQuerySchema,
  createCampaignSchema,
  updateCampaignSchema,
} from "../types/schemas";
import donationsRouter from "./donations";
import volunteersRouter from "./volunteers";

const router = Router();

// GET /api/campaigns — discovery: filter by category/status, free-text search, pagination
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = campaignQuerySchema.parse(req.query);
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;

    const where = {
      ...(q.category ? { category: q.category } : {}),
      ...(q.status ? { status: q.status } : {}),
      ...(q.search
        ? {
            OR: [
              { title: { contains: q.search } },
              { description: { contains: q.search } },
            ],
          }
        : {}),
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          organizer: { select: { id: true, name: true } },
          _count: { select: { donations: true, volunteers: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({ data: campaigns, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
);

// GET /api/campaigns/:id — single campaign with donation/volunteer summary
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        organizer: { select: { id: true, name: true } },
        _count: { select: { donations: true, volunteers: true } },
      },
    });
    if (!campaign) throw ApiError.notFound("Campaign not found");
    res.json(campaign);
  })
);

// POST /api/campaigns — create (organizer/admin only)
router.post(
  "/",
  requireAuth,
  requireRole("ORGANIZER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const data = createCampaignSchema.parse(req.body);
    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        galleryImages: JSON.stringify(data.galleryImages ?? []),
        organizerId: req.user!.sub,
      },
    });
    res.status(201).json(campaign);
  })
);

// PUT /api/campaigns/:id — update (owner or admin only)
router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Campaign not found");
    if (existing.organizerId !== req.user!.sub && req.user!.role !== "ADMIN") {
      throw ApiError.forbidden("Only the campaign organizer or an admin can update this campaign");
    }

    const data = updateCampaignSchema.parse(req.body);
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        galleryImages: data.galleryImages
          ? JSON.stringify(data.galleryImages)
          : undefined,
      },
    });
    res.json(campaign);
  })
);

// DELETE /api/campaigns/:id — owner or admin only
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!existing) throw ApiError.notFound("Campaign not found");
    if (existing.organizerId !== req.user!.sub && req.user!.role !== "ADMIN") {
      throw ApiError.forbidden("Only the campaign organizer or an admin can delete this campaign");
    }
    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
);

// Nested resources
router.use("/:campaignId/donations", donationsRouter);
router.use("/:campaignId/volunteers", volunteersRouter);

export default router;
