import { prisma } from "@/lib/prisma";
import { generateFeedbackToken } from "@/lib/token";
import { sendFeedbackRequestEmail } from "@/lib/email/send-feedback-request";
import { generateApiKey, hashApiKey } from "@/lib/api-key";
import { env } from "@/lib/env";
import type { Application } from "@prisma/client";

const AUTO_CREATE_COLORS = [
  "#6366f1",
  "#16a34a",
  "#f97316",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#ca8a04",
];

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "app"
  );
}

/**
 * Creates a new Application on the fly for a CSV "App" value that doesn't
 * match anything yet — same shape as manually creating one in /admin/applications
 * (placeholder logo, rotating brand color, real API key), just automatic.
 */
async function findOrCreateApplication(appName: string): Promise<Application> {
  const existing = await prisma.application.findFirst({ where: { name: { equals: appName } } });
  if (existing) return existing;

  const baseSlug = slugify(appName);
  let appId = baseSlug;
  let suffix = 1;
  while (await prisma.application.findUnique({ where: { appId } })) {
    appId = `${baseSlug}-${++suffix}`;
  }

  const brandColor = AUTO_CREATE_COLORS[Math.floor(Math.random() * AUTO_CREATE_COLORS.length)];
  const initials = appName.slice(0, 2).toUpperCase() || "AP";
  const { plaintextKey, prefix } = generateApiKey();
  const apiKeyHash = await hashApiKey(plaintextKey);

  return prisma.application.create({
    data: {
      appId,
      name: appName,
      logoUrl: `https://placehold.co/128x128/${brandColor.replace("#", "")}/ffffff.png?text=${initials}`,
      brandColor,
      apiKeyPrefix: prefix,
      apiKeyHash,
    },
  });
}

export interface CsvMerchantRow {
  merchantName: string;
  merchantEmail: string;
  shopDomain: string;
  app: string;
}

export interface CsvSendResult {
  merchantEmail: string;
  app: string;
  status: "sent" | "skipped" | "failed";
  detail: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends a feedback-request email for each row, one at a time with a delay —
 * same throttled-queue behavior as scripts/send-csv.ts, just triggered from
 * the admin dashboard instead of the CLI. Looks up the Application by name
 * (case-insensitive) directly in the DB, since this runs as an already-
 * authenticated admin action rather than through the public API-key route.
 */
export async function sendCsvBatch(
  rows: CsvMerchantRow[],
  delayMs: number
): Promise<CsvSendResult[]> {
  const results: CsvSendResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (!row.merchantEmail || !row.shopDomain) {
      results.push({
        merchantEmail: row.merchantEmail || "(missing)",
        app: row.app,
        status: "skipped",
        detail: "Missing email or shop domain",
      });
      continue;
    }

    if (!row.app.trim()) {
      results.push({
        merchantEmail: row.merchantEmail,
        app: row.app,
        status: "skipped",
        detail: "Missing App column value",
      });
      continue;
    }

    const wasExisting = await prisma.application.findFirst({
      where: { name: { equals: row.app } },
    });
    const application = wasExisting ?? (await findOrCreateApplication(row.app));

    if (application.status !== "ACTIVE") {
      results.push({
        merchantEmail: row.merchantEmail,
        app: row.app,
        status: "skipped",
        detail: `Application "${row.app}" is not active`,
      });
      continue;
    }

    try {
      const merchant = await prisma.merchant.upsert({
        where: {
          applicationId_shopDomain: {
            applicationId: application.id,
            shopDomain: row.shopDomain,
          },
        },
        update: { name: row.merchantName, email: row.merchantEmail },
        create: {
          applicationId: application.id,
          shopDomain: row.shopDomain,
          name: row.merchantName,
          email: row.merchantEmail,
        },
      });

      const token = generateFeedbackToken();
      const feedbackRequest = await prisma.feedbackRequest.create({
        data: {
          applicationId: application.id,
          merchantId: merchant.id,
          token,
          status: "PENDING",
        },
      });

      const feedbackUrl = `${env.appBaseUrl}/feedback/${token}`;
      const sendResult = await sendFeedbackRequestEmail({
        toEmail: merchant.email,
        appName: application.name,
        appLogo: application.logoUrl,
        appColor: application.brandColor,
        merchantName: merchant.name,
        feedbackUrl,
      });

      await prisma.feedbackRequest.update({
        where: { id: feedbackRequest.id },
        data: sendResult.ok
          ? { status: "SENT", sentAt: new Date(), resendMessageId: sendResult.messageId }
          : { status: "FAILED", error: sendResult.error },
      });

      const autoCreatedNote = wasExisting ? "" : " (new application auto-created)";
      results.push(
        sendResult.ok
          ? {
              merchantEmail: row.merchantEmail,
              app: row.app,
              status: "sent",
              detail: `${feedbackUrl}${autoCreatedNote}`,
            }
          : {
              merchantEmail: row.merchantEmail,
              app: row.app,
              status: "failed",
              detail: `${sendResult.error ?? "Unknown error"}${autoCreatedNote}`,
            }
      );
    } catch (err) {
      results.push({
        merchantEmail: row.merchantEmail,
        app: row.app,
        status: "failed",
        detail: err instanceof Error ? err.message : "Unknown error",
      });
    }

    if (i < rows.length - 1) {
      await sleep(delayMs);
    }
  }

  return results;
}
