import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { feedbackFilterSchema } from "@/lib/validation/schemas";
import { queryFeedback } from "@/lib/feedback-query";
import { FeedbackFilters } from "@/components/FeedbackFilters";

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
      <h1 className="text-lg font-bold text-ink">Feedback</h1>

      <FeedbackFilters applications={applications} />

      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/feedback/${item.id}`} className="block">
                    {item.application.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{item.merchant.name}</td>
                <td className="px-4 py-3" style={{ color: item.application.brandColor }}>
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">
                    {item.type.replace("_", " ")}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-zinc-500">
                  {item.comment || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No feedback matches these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Page {filters.page} of {totalPages} &middot; {total} total
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/feedback?${new URLSearchParams({
              ...cleanParams,
              page: String(Math.max(1, filters.page - 1)),
            }).toString()}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5"
          >
            Previous
          </Link>
          <Link
            href={`/admin/feedback?${new URLSearchParams({
              ...cleanParams,
              page: String(Math.min(totalPages, filters.page + 1)),
            }).toString()}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
