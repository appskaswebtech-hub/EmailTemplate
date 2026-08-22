import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface FeedbackFilters {
  applicationId?: string;
  rating?: number;
  type?: "GENERAL" | "FEATURE_REQUEST" | "BUG" | "IMPROVEMENT";
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
}

export async function queryFeedback(filters: FeedbackFilters) {
  const where: Prisma.FeedbackWhereInput = {
    ...(filters.applicationId ? { applicationId: filters.applicationId } : {}),
    ...(filters.rating ? { rating: filters.rating } : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from ? { gte: new Date(filters.from) } : {}),
            ...(filters.to ? { lte: new Date(filters.to) } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        application: { select: { name: true, appId: true, brandColor: true, logoUrl: true } },
        merchant: { select: { name: true, email: true, shopDomain: true } },
        featureRequest: true,
      },
    }),
    prisma.feedback.count({ where }),
  ]);

  return { items, total };
}
