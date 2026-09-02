"use client";

import { useEffect, useState } from "react";

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

interface CsvBatchLog {
  id: string;
  fileName: string;
  totalRows: number;
  sentCount: number;
  skippedCount: number;
  failedCount: number;
  uploadedBy: string | null;
  createdAt: string;
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
  const [history, setHistory] = useState<CsvBatchLog[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  async function loadHistory() {
    setHistoryLoading(true);
    const res = await fetch("/api/admin/send-csv");
    if (res.ok) {
      const data = await res.json();
      setHistory(data.logs);
    }
    setHistoryLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

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
    loadHistory();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-ink dark:text-white">Send feedback requests from CSV</h1>

      <form
        onSubmit={handleSend}
        className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800"
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink dark:text-white">CSV file</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Needs columns: Shop name, Shop email, Shop domain, App (auto-creates the application
            if it doesn&apos;t exist yet). Optional: Review Link — paste the app&apos;s plain
            Shopify App Store URL (e.g. apps.shopify.com/your-app) and it&apos;ll automatically
            open the review popup; adds a &quot;Leave a Review&quot; button to that row&apos;s email.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-ink dark:text-white">
            Delay between emails (seconds)
          </label>
          <input
            type="number"
            min={1}
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(Number(e.target.value))}
            className="w-32 rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="w-fit rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-gold dark:text-zinc-950"
        >
          {sending ? "Sending... this can take a while, don't close this tab" : "Send emails"}
        </button>
      </form>

      {response && (
        <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
          <div className="mb-4 flex gap-4 text-sm">
            <span className="font-semibold text-ink dark:text-white">{response.total} total</span>
            <span className="text-green-700 dark:text-green-400">{response.sent} sent</span>
            <span className="text-zinc-500 dark:text-zinc-400">{response.skipped} skipped</span>
            <span className="text-red-600 dark:text-red-400">{response.failed} failed</span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-2">Email</th>
                <th className="py-2">App</th>
                <th className="py-2">Status</th>
                <th className="py-2">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {response.results.map((r, i) => (
                <tr key={i}>
                  <td className="py-2 dark:text-zinc-300">{r.merchantEmail}</td>
                  <td className="py-2 dark:text-zinc-300">{r.app}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="max-w-xs truncate py-2 text-zinc-500 dark:text-zinc-400">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <h2 className="mb-4 font-semibold text-ink dark:text-white">Previously used CSVs</h2>

        {historyLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No CSVs sent yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-2">File</th>
                <th className="py-2">Rows</th>
                <th className="py-2">Sent</th>
                <th className="py-2">Skipped</th>
                <th className="py-2">Failed</th>
                <th className="py-2">By</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {history.map((log) => (
                <tr key={log.id}>
                  <td className="max-w-[200px] truncate py-2 font-medium text-ink dark:text-white">
                    {log.fileName}
                  </td>
                  <td className="py-2 dark:text-zinc-300">{log.totalRows}</td>
                  <td className="py-2 text-green-700 dark:text-green-400">{log.sentCount}</td>
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">{log.skippedCount}</td>
                  <td className="py-2 text-red-600 dark:text-red-400">{log.failedCount}</td>
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">{log.uploadedBy ?? "—"}</td>
                  <td className="py-2 text-zinc-500 dark:text-zinc-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
