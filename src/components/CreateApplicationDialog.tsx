"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateApplicationDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [appId, setAppId] = useState("");
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, name, logoUrl, brandColor }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create application.");
      return;
    }

    setCreatedKey(data.apiKey);
    router.refresh();
  }

  function reset() {
    setOpen(false);
    setAppId("");
    setName("");
    setLogoUrl("");
    setBrandColor("#6366f1");
    setCreatedKey(null);
    setError(null);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-gold dark:text-zinc-950"
      >
        + New Application
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:ring-1 dark:ring-zinc-800">
        {createdKey ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-ink dark:text-white">Application created</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Copy this API key now — it won&apos;t be shown again.
            </p>
            <code className="break-all rounded-lg bg-zinc-100 p-3 text-xs dark:bg-white/5 dark:text-zinc-200">{createdKey}</code>
            <button
              onClick={reset}
              className="mt-2 rounded-lg bg-ink py-2 text-sm font-semibold text-white dark:bg-gold dark:text-zinc-950"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <h2 className="font-bold text-ink dark:text-white">New Application</h2>

            <label className="text-sm font-medium text-ink dark:text-zinc-300">
              App ID (slug)
              <input
                required
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="wishkeeper"
                className="mt-1 w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </label>

            <label className="text-sm font-medium text-ink dark:text-zinc-300">
              Name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="WishKeeper"
                className="mt-1 w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </label>

            <label className="text-sm font-medium text-ink dark:text-zinc-300">
              Logo URL
              <input
                required
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://.../logo.png"
                className="mt-1 w-full rounded-lg border border-zinc-200 p-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </label>

            <label className="text-sm font-medium text-ink dark:text-zinc-300">
              Brand color
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="mt-1 h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-700"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-semibold text-ink dark:border-zinc-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-ink py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-gold dark:text-zinc-950"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
