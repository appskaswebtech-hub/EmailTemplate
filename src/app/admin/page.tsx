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

const TYPE_COLORS: Record<string, string> = {
  GENERAL: "#2a78d6",
  FEATURE_REQUEST: "#4a3aa7",
  BUG: "#e34948",
  IMPROVEMENT: "#1baf7a",
};

const TYPE_ICONS: Record<string, string> = {
  GENERAL: "\u{1F4AC}",
  FEATURE_REQUEST: "\u{1F4A1}",
  BUG: "\u{1F41B}",
  IMPROVEMENT: "✨",
};

export default async function AdminDashboardPage() {
  const stats = await getFeedbackStats();

  const typeCount = (type: string) =>
    stats.byType.find((row) => row.type === type)?.count ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total feedback"
          value={stats.totalFeedback}
          icon="📋"
          accentColor="#2a78d6"
          trend={stats.feedbackTrend}
        />
        <StatCard
          label="Emails sent"
          value={stats.totalSent}
          icon="📧"
          accentColor="#eb6834"
          trend={stats.sentTrend}
        />
        <StatCard
          label="Response rate"
          value={stats.responseRate != null ? `${stats.responseRate.toFixed(0)}%` : "—"}
          icon="📈"
          accentColor="#1baf7a"
        />
        <StatCard
          label="Feature requests"
          value={typeCount("FEATURE_REQUEST")}
          icon={TYPE_ICONS.FEATURE_REQUEST}
          accentColor={TYPE_COLORS.FEATURE_REQUEST}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <h2 className="mb-4 font-semibold text-ink dark:text-white">Feedback by application</h2>
        <FeedbackByAppChart
          data={stats.byApplication.map((row) => ({
            applicationName: row.applicationName,
            count: row.count,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <StatCard
            key={type}
            label={label}
            value={typeCount(type)}
            icon={TYPE_ICONS[type]}
            accentColor={TYPE_COLORS[type]}
          />
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink dark:text-white">Recent feedback</h2>
          <Link
            href="/admin/feedback"
            className="text-sm text-zinc-500 hover:text-ink dark:text-zinc-400 dark:hover:text-gold"
          >
            View all
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No feedback yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recent.map((item) => (
              <Link
                key={item.id}
                href={`/admin/feedback/${item.id}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-zinc-50 dark:hover:bg-white/5"
              >
                <div>
                  <p className="font-medium text-ink dark:text-white">
                    {item.application.name} &middot; {item.merchant.name}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400">{item.comment || "No comment"}</p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `${TYPE_COLORS[item.type]}1a`, color: TYPE_COLORS[item.type] }}
                >
                  {item.type.replace("_", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
