import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";
import { sendCsvBatch, type CsvMerchantRow } from "@/lib/csv-batch-send";

export const maxDuration = 300;

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.csvBatchLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ logs });
}

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
    reviewUrl: row["Review Link"] || row["reviewUrl"] || undefined,
  }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV has no rows" }, { status: 400 });
  }

  const results = await sendCsvBatch(rows, delayMs);
  const sent = results.filter((r) => r.status === "sent").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  await prisma.csvBatchLog.create({
    data: {
      fileName: file.name,
      totalRows: rows.length,
      sentCount: sent,
      skippedCount: skipped,
      failedCount: failed,
      uploadedBy: session.user?.email ?? session.user?.name ?? null,
    },
  });

  return NextResponse.json({ total: rows.length, sent, skipped, failed, results });
}
