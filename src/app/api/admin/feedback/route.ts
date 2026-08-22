import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin-session";
import { feedbackFilterSchema } from "@/lib/validation/schemas";
import { queryFeedback } from "@/lib/feedback-query";

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const parsed = feedbackFilterSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const filters = parsed.data;
  const { items, total } = await queryFeedback(filters);

  return NextResponse.json({
    items,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
  });
}
