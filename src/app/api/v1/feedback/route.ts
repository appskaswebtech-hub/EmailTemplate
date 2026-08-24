import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitFeedbackSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  if (!checkRateLimit(`feedback-submit:${ip}`)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const feedbackRequest = await prisma.feedbackRequest.findUnique({
    where: { token: input.token },
    include: { feedback: { include: { featureRequest: true } } },
  });
  if (!feedbackRequest) {
    return NextResponse.json({ error: "Invalid or expired feedback link" }, { status: 404 });
  }

  // A merchant revisiting the same link updates their existing submission
  // instead of creating a duplicate.
  const existing = feedbackRequest.feedback[0];

  const feedback = existing
    ? await prisma.feedback.update({
        where: { id: existing.id },
        data: {
          comment: input.comment || null,
          type: input.type,
        },
      })
    : await prisma.feedback.create({
        data: {
          applicationId: feedbackRequest.applicationId,
          merchantId: feedbackRequest.merchantId,
          feedbackRequestId: feedbackRequest.id,
          comment: input.comment || null,
          type: input.type,
        },
      });

  if (input.suggestion && input.suggestion.trim().length > 0) {
    if (existing?.featureRequest) {
      await prisma.featureRequest.update({
        where: { id: existing.featureRequest.id },
        data: { description: input.suggestion.trim() },
      });
    } else {
      await prisma.featureRequest.create({
        data: {
          applicationId: feedbackRequest.applicationId,
          merchantId: feedbackRequest.merchantId,
          feedbackId: feedback.id,
          description: input.suggestion.trim(),
        },
      });
    }
  }

  if (feedbackRequest.status !== "COMPLETED") {
    await prisma.feedbackRequest.update({
      where: { id: feedbackRequest.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
