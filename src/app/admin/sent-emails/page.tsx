import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const STATUS_STYLES: Record<string, string> = {
  SENT: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  PENDING: "bg-zinc-100 text-zinc-600",
  FAILED: "bg-red-100 text-red-700",
};

export default async function SentEmailsPage({
  searchParams,
}: {
  searchParams: { page?: string; applicationId?: string; status?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const applicationId = searchParams.applicationId || undefined;
  const status = searchParams.status || undefined;

  const where = {
    ...(applicationId ? { applicationId } : {}),
    ...(status ? { status: status as "PENDING" | "SENT" | "FAILED" | "COMPLETED" } : {}),
  };

  const [items, total, applications] = await Promise.all([
    prisma.feedbackRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        status: true,
        sentAt: true,
        error: true,
        reviewUrl: true,
        application: { select: { name: true, brandColor: true } },
        merchant: { select: { name: true, email: true, shopDomain: true } },
      },
    }),
    prisma.feedbackRequest.count({ where }),
    prisma.application.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(targetPage: number) {
    const params = new URLSearchParams();
    if (applicationId) params.set("applicationId", applicationId);
    if (status) params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/sent-emails?${params.toString()}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-ink dark:text-white">Sent emails</h1>

      <form className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <select
          name="applicationId"
          defaultValue={applicationId ?? ""}
          className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value="">All applications</option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value="">All statuses</option>
          <option value="SENT">Sent</option>
          <option value="COMPLETED">Completed (merchant responded)</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-gold dark:text-zinc-950"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent at</th>
              <th className="px-4 py-3">Error</th>
              <th className="px-4 py-3">Review link</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-white/5">
                <td className="px-4 py-3" style={{ color: item.application.brandColor }}>
                  {item.application.name}
                </td>
                <td className="px-4 py-3 dark:text-zinc-300">{item.merchant.name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{item.merchant.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      STATUS_STYLES[item.status] ?? "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {item.sentAt ? new Date(item.sentAt).toLocaleString() : "—"}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-red-600 dark:text-red-400">{item.error || "—"}</td>
                <td className="max-w-[160px] truncate px-4 py-3">
                  {item.reviewUrl ? (
                    <a
                      href={item.reviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {item.reviewUrl}
                    </a>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    endpoint={`/api/admin/sent-emails/${item.id}`}
                    confirmMessage={`Delete this sent-email record for ${item.merchant.email}? This cannot be undone.`}
                    small
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No emails sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          Page {page} of {totalPages} &middot; {total} total
        </span>
        <div className="flex gap-2">
          <Link
            href={pageUrl(Math.max(1, page - 1))}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-zinc-700 dark:text-white"
          >
            Previous
          </Link>
          <Link
            href={pageUrl(Math.min(totalPages, page + 1))}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-zinc-700 dark:text-white"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
