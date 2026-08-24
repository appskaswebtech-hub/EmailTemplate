import { z } from "zod";

/**
 * Body for POST /api/v1/feedback-requests, called server-to-server by a Shopify app.
 * App branding (name/logo/color) is NOT sent here — it's already stored once against
 * the Application record the API key belongs to, so callers only ever need to send
 * who the merchant is.
 */
export const createFeedbackRequestSchema = z.object({
  merchantName: z.string().min(1).max(200),
  merchantEmail: z.string().email(),
  shopDomain: z.string().min(1).max(200),
});

export type CreateFeedbackRequestInput = z.infer<typeof createFeedbackRequestSchema>;

/** Body for POST /api/v1/feedback, submitted from the public feedback webpage. */
export const submitFeedbackSchema = z.object({
  token: z.string().min(1),
  comment: z.string().max(5000).optional(),
  suggestion: z.string().max(5000).optional(),
  type: z.enum(["GENERAL", "FEATURE_REQUEST", "BUG", "IMPROVEMENT"]),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;

/** Body for POST /api/admin/applications */
export const createApplicationSchema = z.object({
  appId: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "appId must be lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1).max(200),
  logoUrl: z.string().url(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#111827"),
});

export const updateApplicationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  logoUrl: z.string().url().optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const feedbackFilterSchema = z.object({
  applicationId: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  type: z.enum(["GENERAL", "FEATURE_REQUEST", "BUG", "IMPROVEMENT"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
