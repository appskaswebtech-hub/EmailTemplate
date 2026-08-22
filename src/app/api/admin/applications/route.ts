import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";
import { createApplicationSchema } from "@/lib/validation/schemas";
import { generateApiKey, hashApiKey } from "@/lib/api-key";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { feedback: true } } },
  });

  return NextResponse.json({
    applications: applications.map((app) => ({
      id: app.id,
      appId: app.appId,
      name: app.name,
      logoUrl: app.logoUrl,
      brandColor: app.brandColor,
      status: app.status,
      feedbackCount: app._count.feedback,
      createdAt: app.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const existing = await prisma.application.findUnique({ where: { appId: input.appId } });
  if (existing) {
    return NextResponse.json({ error: "appId already exists" }, { status: 409 });
  }

  const { plaintextKey, prefix } = generateApiKey();
  const apiKeyHash = await hashApiKey(plaintextKey);

  const application = await prisma.application.create({
    data: {
      appId: input.appId,
      name: input.name,
      logoUrl: input.logoUrl,
      brandColor: input.brandColor,
      apiKeyPrefix: prefix,
      apiKeyHash,
    },
  });

  return NextResponse.json(
    {
      application: {
        id: application.id,
        appId: application.appId,
        name: application.name,
      },
      apiKey: plaintextKey,
    },
    { status: 201 }
  );
}
