"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  confirmMessage,
  redirectTo,
  small = false,
}: {
  endpoint: string;
  confirmMessage: string;
  redirectTo?: string;
  small?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setOpen(true);
  }

  function closeDialog(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (deleting) return;
    setOpen(false);
    setError(null);
  }

  async function handleConfirm(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    setDeleting(true);
    setError(null);
    const res = await fetch(endpoint, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      setError("Failed to delete. Please try again.");
      return;
    }

    setOpen(false);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={
          small
            ? "rounded-full px-2 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            : "rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        }
      >
        Delete
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={closeDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-zinc-800"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl dark:bg-red-500/10">
              🗑️
            </div>

            <h2 className="mb-1 text-base font-bold text-ink dark:text-white">Delete this record?</h2>
            <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">{confirmMessage}</p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeDialog}
                disabled={deleting}
                className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-semibold text-ink disabled:opacity-50 dark:border-zinc-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-red-500"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
