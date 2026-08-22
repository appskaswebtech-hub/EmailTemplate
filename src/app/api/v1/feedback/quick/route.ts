import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

/**
 * One-click rating link used by the star icons in the feedback-request email.
 * A plain GET so it works as a plain <a href> from any email client (no JS/forms
 * required) — records the rating immediately and sends the merchant straight to
 * the thank-you page. If they later open the full feedback page to add a comment
 * or suggestion, POST /api/v1/feedback updates this same record instead of
 * creating a duplicate.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const ratingParam = url.searchParams.get("rating");
  const rating = ratingParam ? Number(ratingParam) : NaN;

  if (!token || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.redirect(`${env.appBaseUrl}/feedback/${token ?? ""}`);
  }

  const feedbackRequest = await prisma.feedbackRequest.findUnique({
    where: { token },
    include: { feedback: true },
  });

  if (!feedbackRequest) {
    return NextResponse.redirect(env.appBaseUrl);
  }

  const existing = feedbackRequest.feedback[0];

  if (existing) {
    await prisma.feedback.update({ where: { id: existing.id }, data: { rating } });
  } else {
    await prisma.feedback.create({
      data: {
        applicationId: feedbackRequest.applicationId,
        merchantId: feedbackRequest.merchantId,
        feedbackRequestId: feedbackRequest.id,
        rating,
        type: "GENERAL",
      },
    });
  }

  if (feedbackRequest.status !== "COMPLETED") {
    await prisma.feedbackRequest.update({
      where: { id: feedbackRequest.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  return NextResponse.redirect(`${env.appBaseUrl}/feedback/${token}/thank-you`);
}
