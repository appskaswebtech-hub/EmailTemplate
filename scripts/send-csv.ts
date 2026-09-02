/**
 * Sends a feedback-request email to every merchant in a CSV, one at a time
 * with a delay between sends — a burst of hundreds of emails at once is the
 * kind of pattern that gets a Gmail account flagged/rate-limited, so this
 * queues them out slowly instead of firing them all in parallel.
 *
 * The CSV's "App" column picks which application (and therefore which API
 * key, branding, and merchant record) each row belongs to — see
 * scripts/app-keys.example.json for the mapping file format. An optional
 * "Review Link" column, if present, adds a "Leave a Review" button to that
 * row's email pointing at the app's public review page.
 *
 * Usage:
 *   npm run send-csv -- data/merchants.csv
 *   npm run send-csv -- data/merchants.csv --test        (sends to the first row only)
 *   npm run send-csv -- data/merchants.csv --delay=8000   (ms between sends, default 5000)
 */
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import "dotenv/config";

interface MerchantRow {
  merchantName: string;
  merchantEmail: string;
  shopDomain: string;
  app: string;
  reviewUrl?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith("--"));
  const testMode = args.includes("--test");
  const delayArg = args.find((a) => a.startsWith("--delay="));
  const delayMs = delayArg ? Number(delayArg.split("=")[1]) : 5000;
  return { filePath, testMode, delayMs };
}

function loadRows(filePath: string): MerchantRow[] {
  const content = fs.readFileSync(filePath, "utf8");
  const records: Record<string, string>[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records
    .map((row) => ({
      merchantName: row["Shop name"] ?? row["merchantName"] ?? "",
      merchantEmail: row["Shop email"] ?? row["merchantEmail"] ?? "",
      shopDomain: row["Shop domain"] ?? row["shopDomain"] ?? "",
      app: row["App"] ?? row["app"] ?? "",
      reviewUrl: row["Review Link"] || row["reviewUrl"] || undefined,
    }))
    .filter((row) => row.merchantEmail && row.shopDomain);
}

/** appName (as it appears in the CSV's App column) -> API key, from scripts/app-keys.json */
function loadAppKeyMap(): Record<string, string> {
  const mapPath = path.resolve(process.cwd(), "scripts/app-keys.json");
  if (!fs.existsSync(mapPath)) {
    console.error(
      `Missing scripts/app-keys.json. Copy scripts/app-keys.example.json and fill in each app's API key (from /admin/applications).`
    );
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(mapPath, "utf8")) as Record<string, string>;
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    normalized[key.trim().toLowerCase()] = value;
  }
  return normalized;
}

async function sendOne(baseUrl: string, apiKey: string, row: MerchantRow) {
  const res = await fetch(`${baseUrl}/api/v1/feedback-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({
      merchantName: row.merchantName,
      merchantEmail: row.merchantEmail,
      shopDomain: row.shopDomain,
      reviewUrl: row.reviewUrl,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const { filePath, testMode, delayMs } = parseArgs();

  if (!filePath) {
    console.error("Usage: npm run send-csv -- <path-to-csv> [--test] [--delay=5000]");
    process.exit(1);
  }

  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const appKeys = loadAppKeyMap();

  const resolvedPath = path.resolve(process.cwd(), filePath);
  const allRows = loadRows(resolvedPath);
  const rows = testMode ? allRows.slice(0, 1) : allRows;

  if (rows.length === 0) {
    console.error("No valid rows found (need Shop name / Shop email / Shop domain / App columns).");
    process.exit(1);
  }

  console.log(
    `${testMode ? "[TEST MODE] " : ""}Sending to ${rows.length} of ${allRows.length} merchant(s), ${delayMs}ms between sends, target: ${baseUrl}\n`
  );

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const label = `[${i + 1}/${rows.length}] ${row.merchantEmail} (app: ${row.app || "?"})`;

    const apiKey = appKeys[row.app.trim().toLowerCase()];
    if (!apiKey) {
      skipped++;
      console.log(`${label} — SKIPPED, no API key mapped for app "${row.app}"`);
      continue;
    }

    try {
      const result = await sendOne(baseUrl, apiKey, row);
      if (result.ok) {
        sent++;
        console.log(`${label} — sent (feedbackUrl: ${result.data.feedbackUrl})`);
      } else {
        failed++;
        console.log(`${label} — FAILED (${result.status}): ${JSON.stringify(result.data)}`);
      }
    } catch (err) {
      failed++;
      console.log(`${label} — ERROR: ${err instanceof Error ? err.message : err}`);
    }

    if (i < rows.length - 1) {
      await sleep(delayMs);
    }
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}, Skipped: ${skipped}`);
}

main();
