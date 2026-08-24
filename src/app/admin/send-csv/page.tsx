"use client";

import { useState } from "react";

interface SendResult {
  merchantEmail: string;
  app: string;
  status: "sent" | "skipped" | "failed";
  detail: string;
}

interface SendResponse {
  total: number;
  sent: number;
  skipped: number;
  failed: number;
  results: SendResult[];
}

const STATUS_STYLES: Record<SendResult["status"], string> = {
  sent: "bg-green-100 text-green-700",
  skipped: "bg-zinc-100 text-zinc-600",
  failed: "bg-red-100 text-red-700",
};

export default function SendCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<SendResponse | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }

    setSending(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("delayMs", String(delaySeconds * 1000));

    const res = await fetch("/api/admin/send-csv", { method: "POST", body: formData });
    const data = await res.json();

    setSending(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to send batch.");
      return;
    }

    setResponse(data);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-ink">Send feedback requests from CSV</h1>

      <form onSubmit={handleSend} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">CSV file</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-zinc-200 p-2 text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Needs columns: Shop name, Shop email, Shop domain, App (the app name must match one
            already created in Applications).
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">
            Delay between emails (seconds)
          </label>
          <input
            type="number"
            min={1}
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(Number(e.target.value))}
            className="w-32 rounded-lg border border-zinc-200 p-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="w-fit rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending... this can take a while, don't close this tab" : "Send emails"}
        </button>
      </form>

      {response && (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex gap-4 text-sm">
            <span className="font-semibold text-ink">{response.total} total</span>
            <span className="text-green-700">{response.sent} sent</span>
            <span className="text-zinc-500">{response.skipped} skipped</span>
            <span className="text-red-600">{response.failed} failed</span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="py-2">Email</th>
                <th className="py-2">App</th>
                <th className="py-2">Status</th>
                <th className="py-2">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {response.results.map((r, i) => (
                <tr key={i}>
                  <td className="py-2">{r.merchantEmail}</td>
                  <td className="py-2">{r.app}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="max-w-xs truncate py-2 text-zinc-500">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
