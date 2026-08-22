import { getFeedbackStats } from "@/lib/stats";
import { StatCard } from "@/components/StatCard";
import { FeedbackByAppChart } from "@/components/FeedbackByAppChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  GENERAL: "General feedback",
  FEATURE_REQUEST: "Feature requests",
  BUG: "Bug reports",
  IMPROVEMENT: "Improvement suggestions",
};

export default async function AdminDashboardPage() {
  const stats = await getFeedbackStats();

  const typeCount = (type: string) =>
    stats.byType.find((row) => row.type === type)?.count ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total feedback" value={stats.totalFeedback} />
        <StatCard label="Average rating" value={stats.averageRating.toFixed(1)} />
        <StatCard label="Feature requests" value={typeCount("FEATURE_REQUEST")} />
        <StatCard label="Bug reports" value={typeCount("BUG")} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-ink">Feedback by application</h2>
        <FeedbackByAppChart
          data={stats.byApplication.map((row) => ({
            applicationName: row.applicationName,
            count: row.count,
            brandColor: row.brandColor,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <StatCard key={type} label={label} value={typeCount(type)} />
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Recent feedback</h2>
          <Link href="/admin/feedback" className="text-sm text-zinc-500 hover:text-ink">
            View all
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="text-sm text-zinc-500">No feedback yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100">
            {stats.recent.map((item) => (
              <Link
                key={item.id}
                href={`/admin/feedback/${item.id}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-ink">
                    {item.application.name} &middot; {item.merchant.name}
                  </p>
                  <p className="text-zinc-500">{item.comment || "No comment"}</p>
                </div>
                <span style={{ color: item.application.brandColor }} className="font-semibold">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
