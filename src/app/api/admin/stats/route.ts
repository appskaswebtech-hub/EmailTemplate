import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin-session";
import { getFeedbackStats } from "@/lib/stats";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stats = await getFeedbackStats();
  return NextResponse.json(stats);
}
