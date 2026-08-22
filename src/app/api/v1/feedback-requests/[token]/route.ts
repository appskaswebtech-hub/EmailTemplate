import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const feedbackRequest = await prisma.feedbackRequest.findUnique({
    where: { token: params.token },
    include: { application: true, merchant: true },
  });

  if (!feedbackRequest) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    appName: feedbackRequest.application.name,
    appLogo: feedbackRequest.application.logoUrl,
    appColor: feedbackRequest.application.brandColor,
    merchantName: feedbackRequest.merchant.name,
    alreadyCompleted: feedbackRequest.status === "COMPLETED",
  });
}
