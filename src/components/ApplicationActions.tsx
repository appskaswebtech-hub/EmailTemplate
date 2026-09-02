"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplicationActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: "ACTIVE" | "INACTIVE";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  async function regenerateKey() {
    if (!confirm("This will invalidate the current API key immediately. Continue?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/applications/${applicationId}/regenerate-key`, {
      method: "POST",
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setNewKey(data.apiKey);
  }

  async function toggleStatus() {
    setLoading(true);
    await fetch(`/api/admin/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={regenerateKey}
          disabled={loading}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60 dark:border-zinc-700 dark:text-white dark:hover:bg-white/5"
        >
          Regenerate API key
        </button>
        <button
          onClick={toggleStatus}
          disabled={loading}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60 dark:border-zinc-700 dark:text-white dark:hover:bg-white/5"
        >
          {status === "ACTIVE" ? "Deactivate" : "Activate"}
        </button>
      </div>

      {newKey && (
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-white/5">
          <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
            New API key — copy it now, it won&apos;t be shown again:
          </p>
          <code className="break-all text-xs dark:text-zinc-200">{newKey}</code>
        </div>
      )}
    </div>
  );
}
