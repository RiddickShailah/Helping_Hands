import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["ADMIN", "ORGANIZER", "DONOR"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createCampaignSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(10).max(5000),
  category: z.string().min(2).max(60),
  goalAmount: z.number().positive(),
  deadline: z.string().datetime().optional(),
  coverImageUrl: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).optional(),
  neighborhood: z.string().max(80).optional(),
  address: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const createDonationSchema = z.object({
  donorName: z.string().min(1).max(100),
  donorEmail: z.string().email(),
  amount: z.number().positive(),
  message: z.string().max(1000).optional(),
  anonymous: z.boolean().optional(),
});

export const createVolunteerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.string().min(2).max(80),
  hoursCommitted: z.number().positive().max(1000),
});

export const updateVolunteerSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "WITHDRAWN"]).optional(),
  hoursCommitted: z.number().positive().max(1000).optional(),
});

export const campaignQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
