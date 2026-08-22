import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feedback = await prisma.feedback.findUnique({
    where: { id: params.id },
    include: {
      application: true,
      merchant: true,
      feedbackRequest: true,
      featureRequest: true,
    },
  });
  if (!feedback) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ feedback });
}
