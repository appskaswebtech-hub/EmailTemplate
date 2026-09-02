import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/DeleteButton";

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={feedback.application.logoUrl}
            alt={feedback.application.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-lg font-bold text-ink dark:text-white">{feedback.application.name}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {feedback.merchant.name} &middot; {feedback.merchant.email} &middot;{" "}
              {feedback.merchant.shopDomain}
            </p>
          </div>
        </div>
        <DeleteButton
          endpoint={`/api/admin/feedback/${feedback.id}`}
          confirmMessage="Delete this feedback? This cannot be undone."
          redirectTo="/admin/feedback"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
        <div className="mb-4 flex items-center justify-end">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold dark:bg-white/10 dark:text-zinc-300">
            {feedback.type.replace("_", " ")}
          </span>
        </div>

        <p className="mb-1 text-sm font-semibold text-ink dark:text-white">Comment</p>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">{feedback.comment || "No comment provided."}</p>

        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Submitted {new Date(feedback.createdAt).toLocaleString()}
        </p>
      </div>

      {feedback.featureRequest && (
        <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink dark:text-white">Feature suggestion</p>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              {feedback.featureRequest.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{feedback.featureRequest.description}</p>
        </div>
      )}
    </div>
  );
}
