"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TYPES = ["GENERAL", "FEATURE_REQUEST", "BUG", "IMPROVEMENT"];

export function FeedbackFilters({
  applications,
}: {
  applications: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/admin/feedback?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
      <select
        defaultValue={searchParams.get("applicationId") ?? ""}
        onChange={(e) => update("applicationId", e.target.value)}
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
        defaultValue={searchParams.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      >
        <option value="">All types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace("_", " ")}
          </option>
        ))}
      </select>

      <input
        type="date"
        defaultValue={searchParams.get("from")?.slice(0, 10) ?? ""}
        onChange={(e) =>
          update("from", e.target.value ? new Date(e.target.value).toISOString() : "")
        }
        className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      />
      <input
        type="date"
        defaultValue={searchParams.get("to")?.slice(0, 10) ?? ""}
        onChange={(e) =>
          update("to", e.target.value ? new Date(e.target.value).toISOString() : "")
        }
        className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      />
    </div>
  );
}
