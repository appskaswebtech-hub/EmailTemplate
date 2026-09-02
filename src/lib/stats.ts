import { prisma } from "@/lib/prisma";

const TREND_DAYS = 7;

/** Buckets timestamps into daily counts for the last TREND_DAYS days (oldest first). */
function bucketByDay(timestamps: Date[]): number[] {
  const buckets = new Array(TREND_DAYS).fill(0);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const ts of timestamps) {
    const dayStart = new Date(ts.getFullYear(), ts.getMonth(), ts.getDate());
    const daysAgo = Math.round((todayStart.getTime() - dayStart.getTime()) / 86400000);
    const index = TREND_DAYS - 1 - daysAgo;
    if (index >= 0 && index < TREND_DAYS) {
      buckets[index]++;
    }
  }

  return buckets;
}

export async function getFeedbackStats() {
  const trendSince = new Date(Date.now() - TREND_DAYS * 86400000);

  const [
    totalFeedback,
    byType,
    byApplication,
    recent,
    totalSent,
    totalCompleted,
    recentFeedbackTimestamps,
    recentSentTimestamps,
  ] = await Promise.all([
    prisma.feedback.count(),
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
    prisma.feedbackRequest.count({ where: { status: { in: ["SENT", "COMPLETED"] } } }),
    prisma.feedbackRequest.count({ where: { status: "COMPLETED" } }),
    prisma.feedback.findMany({
      where: { createdAt: { gte: trendSince } },
      select: { createdAt: true },
    }),
    prisma.feedbackRequest.findMany({
      where: { sentAt: { gte: trendSince } },
      select: { sentAt: true },
    }),
  ]);

  const applications = await prisma.application.findMany({
    where: { id: { in: byApplication.map((row) => row.applicationId) } },
    select: { id: true, name: true, brandColor: true },
  });
  const appById = new Map(applications.map((app) => [app.id, app]));

  return {
    totalFeedback,
    totalSent,
    responseRate: totalSent > 0 ? (totalCompleted / totalSent) * 100 : null,
    feedbackTrend: bucketByDay(recentFeedbackTimestamps.map((r) => r.createdAt)),
    sentTrend: bucketByDay(recentSentTimestamps.map((r) => r.sentAt as Date)),
    byType: byType.map((row) => ({ type: row.type, count: row._count._all })),
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
