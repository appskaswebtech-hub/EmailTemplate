import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FeedbackDetailPage({ params }: { params: { id: string } }) {
  const feedback = await prisma.feedback.findUnique({
    where: { id: params.id },
    include: {
      application: true,
      merchant: true,
      featureRequest: true,
      feedbackRequest: true,
    },
  });

  if (!feedback) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Image
          src={feedback.application.logoUrl}
          alt={feedback.application.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h1 className="text-lg font-bold text-ink">{feedback.application.name}</h1>
          <p className="text-sm text-zinc-500">
            {feedback.merchant.name} &middot; {feedback.merchant.email} &middot;{" "}
            {feedback.merchant.shopDomain}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-end">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold">
            {feedback.type.replace("_", " ")}
          </span>
        </div>

        <p className="mb-1 text-sm font-semibold text-ink">Comment</p>
        <p className="mb-4 text-sm text-zinc-600">{feedback.comment || "No comment provided."}</p>

        <p className="text-xs text-zinc-400">
          Submitted {new Date(feedback.createdAt).toLocaleString()}
        </p>
      </div>

      {feedback.featureRequest && (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Feature suggestion</p>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {feedback.featureRequest.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-zinc-600">{feedback.featureRequest.description}</p>
        </div>
      )}
    </div>
  );
}
