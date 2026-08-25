import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const feedbackRequest = await prisma.feedbackRequest.findUnique({ where: { id: params.id } });
  if (!feedbackRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.feedbackRequest.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
