import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin-session";
import { generateApiKey, hashApiKey } from "@/lib/api-key";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const application = await prisma.application.findUnique({ where: { id: params.id } });
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { plaintextKey, prefix } = generateApiKey();
  const apiKeyHash = await hashApiKey(plaintextKey);

  await prisma.application.update({
    where: { id: params.id },
    data: { apiKeyPrefix: prefix, apiKeyHash },
  });

  return NextResponse.json({ apiKey: plaintextKey });
}
