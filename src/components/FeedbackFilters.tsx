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
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-card">
      <select
        defaultValue={searchParams.get("applicationId") ?? ""}
        onChange={(e) => update("applicationId", e.target.value)}
        className="rounded-lg border border-zinc-200 p-2 text-sm"
      >
        <option value="">All applications</option>
        {applications.map((app) => (
          <option key={app.id} value={app.id}>
            {app.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("rating") ?? ""}
        onChange={(e) => update("rating", e.target.value)}
        className="rounded-lg border border-zinc-200 p-2 text-sm"
      >
        <option value="">All ratings</option>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className="rounded-lg border border-zinc-200 p-2 text-sm"
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
        className="rounded-lg border border-zinc-200 p-2 text-sm"
      />
      <input
        type="date"
        defaultValue={searchParams.get("to")?.slice(0, 10) ?? ""}
        onChange={(e) =>
          update("to", e.target.value ? new Date(e.target.value).toISOString() : "")
        }
        className="rounded-lg border border-zinc-200 p-2 text-sm"
      />
    </div>
  );
}
