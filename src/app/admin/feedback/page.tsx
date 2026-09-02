import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { feedbackFilterSchema } from "@/lib/validation/schemas";
import { queryFeedback } from "@/lib/feedback-query";
import { FeedbackFilters } from "@/components/FeedbackFilters";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function FeedbackListPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const filters = feedbackFilterSchema.parse(searchParams);
  const [{ items, total }, applications] = await Promise.all([
    queryFeedback(filters),
    prisma.application.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const cleanParams = Object.fromEntries(
    Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-ink dark:text-white">Feedback</h1>

      <FeedbackFilters applications={applications} />

      <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-white/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/feedback/${item.id}`} className="block dark:text-white">
                    {item.application.name}
                  </Link>
                </td>
                <td className="px-4 py-3 dark:text-zinc-300">{item.merchant.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-white/10 dark:text-zinc-300">
                    {item.type.replace("_", " ")}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {item.comment || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    endpoint={`/api/admin/feedback/${item.id}`}
                    confirmMessage={`Delete this feedback from ${item.merchant.name}? This cannot be undone.`}
                    small
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  No feedback matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          Page {filters.page} of {totalPages} &middot; {total} total
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/feedback?${new URLSearchParams({
              ...cleanParams,
              page: String(Math.max(1, filters.page - 1)),
            }).toString()}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-zinc-700 dark:text-white"
          >
            Previous
          </Link>
          <Link
            href={`/admin/feedback?${new URLSearchParams({
              ...cleanParams,
              page: String(Math.min(totalPages, filters.page + 1)),
            }).toString()}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-zinc-700 dark:text-white"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
