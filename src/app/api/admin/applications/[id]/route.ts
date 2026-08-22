import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";
import { updateApplicationSchema } from "@/lib/validation/schemas";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { _count: { select: { feedback: true, merchants: true, featureRequests: true } } },
  });
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { apiKeyHash: _apiKeyHash, ...safe } = application;
  return NextResponse.json({ application: safe });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = updateApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const application = await prisma.application.update({
    where: { id: params.id },
    data: parsed.data,
  });

  const { apiKeyHash: _apiKeyHash2, ...safe } = application;
  return NextResponse.json({ application: safe });
}
