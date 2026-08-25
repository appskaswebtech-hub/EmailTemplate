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
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(confirmMessage)) return;

    setDeleting(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      alert("Failed to delete. Please try again.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className={
        small
          ? "rounded-full px-2 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          : "rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
      }
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
