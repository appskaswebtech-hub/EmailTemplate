import { prisma } from "@/lib/prisma";

export async function getFeedbackStats() {
  const [totalFeedback, ratingAgg, byType, byApplication, recent, byRating] = await Promise.all([
    prisma.feedback.count(),
    prisma.feedback.aggregate({ _avg: { rating: true } }),
    prisma.feedback.groupBy({ by: ["type"], _count: { _all: true } }),
    prisma.feedback.groupBy({ by: ["applicationId"], _count: { _all: true } }),
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        application: { select: { name: true, brandColor: true, logoUrl: true } },
        merchant: { select: { name: true } },
      },
    }),
    prisma.feedback.groupBy({ by: ["rating"], _count: { _all: true } }),
  ]);

  const applications = await prisma.application.findMany({
    where: { id: { in: byApplication.map((row) => row.applicationId) } },
    select: { id: true, name: true, brandColor: true },
  });
  const appById = new Map(applications.map((app) => [app.id, app]));

  return {
    totalFeedback,
    averageRating: ratingAgg._avg.rating,
    byType: byType.map((row) => ({ type: row.type, count: row._count._all })),
    byRating: byRating.map((row) => ({ rating: row.rating, count: row._count._all })),
    byApplication: byApplication.map((row) => ({
      applicationId: row.applicationId,
      applicationName: appById.get(row.applicationId)?.name ?? "Unknown",
      brandColor: appById.get(row.applicationId)?.brandColor ?? "#111827",
      count: row._count._all,
    })),
    recent,
  };
}

export type FeedbackStats = Awaited<ReturnType<typeof getFeedbackStats>>;
