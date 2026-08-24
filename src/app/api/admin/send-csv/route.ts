import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { requireAdminSession } from "@/lib/require-admin-session";
import { sendCsvBatch, type CsvMerchantRow } from "@/lib/csv-batch-send";

export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file uploaded" }, { status: 400 });
  }

  const delayParam = formData?.get("delayMs");
  const delayMs = delayParam ? Math.max(1000, Number(delayParam)) : 5000;

  const content = await file.text();
  let records: Record<string, string>[];
  try {
    records = parse(content, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return NextResponse.json({ error: "Could not parse CSV file" }, { status: 400 });
  }

  const rows: CsvMerchantRow[] = records.map((row) => ({
    merchantName: row["Shop name"] ?? row["merchantName"] ?? "",
    merchantEmail: row["Shop email"] ?? row["merchantEmail"] ?? "",
    shopDomain: row["Shop domain"] ?? row["shopDomain"] ?? "",
    app: row["App"] ?? row["app"] ?? "",
  }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV has no rows" }, { status: 400 });
  }

  const results = await sendCsvBatch(rows, delayMs);

  return NextResponse.json({
    total: rows.length,
    sent: results.filter((r) => r.status === "sent").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  });
}
