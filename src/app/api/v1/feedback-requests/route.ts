import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateApp } from "@/lib/authenticate-app";
import { checkRateLimit } from "@/lib/rate-limit";
import { createFeedbackRequestSchema } from "@/lib/validation/schemas";
import { generateFeedbackToken } from "@/lib/token";
import { sendFeedbackRequestEmail } from "@/lib/email/send-feedback-request";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const auth = await authenticateApp(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const { application } = auth;

  if (!checkRateLimit(application.id)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const merchant = await prisma.merchant.upsert({
    where: {
      applicationId_shopDomain: {
        applicationId: application.id,
        shopDomain: input.shopDomain,
      },
    },
    update: { name: input.merchantName, email: input.merchantEmail },
    create: {
      applicationId: application.id,
      shopDomain: input.shopDomain,
      name: input.merchantName,
      email: input.merchantEmail,
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

  const result = await sendFeedbackRequestEmail({
    toEmail: merchant.email,
    appName: application.name,
    appLogo: application.logoUrl,
    appColor: application.brandColor,
    merchantName: merchant.name,
    feedbackUrl,
  });

  await prisma.feedbackRequest.update({
    where: { id: feedbackRequest.id },
    data: result.ok
      ? { status: "SENT", sentAt: new Date(), resendMessageId: result.messageId }
      : { status: "FAILED", error: result.error },
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "Feedback request created but the email failed to send", details: result.error },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { requestId: feedbackRequest.id, feedbackUrl },
    { status: 201 }
  );
}
