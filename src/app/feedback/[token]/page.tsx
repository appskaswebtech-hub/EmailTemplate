import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { FeedbackForm } from "@/components/FeedbackForm";

export const dynamic = "force-dynamic";

export default async function FeedbackPage({ params }: { params: { token: string } }) {
  const feedbackRequest = await prisma.feedbackRequest.findUnique({
    where: { token: params.token },
    include: {
      application: true,
      merchant: true,
      feedback: { include: { featureRequest: true } },
    },
  });

  if (!feedbackRequest) {
    notFound();
  }

  const { application, merchant } = feedbackRequest;
  const existing = feedbackRequest.feedback[0];

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-card sm:p-10">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Image
            src={application.logoUrl}
            alt={application.name}
            width={56}
            height={56}
            className="rounded-full border border-zinc-100 shadow"
          />
          <p className="text-sm text-zinc-500">Hi {merchant.name},</p>
          {existing && (
            <p className="rounded-lg bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-500">
              You already left feedback for this request — feel free to update it below.
            </p>
          )}
        </div>

        <FeedbackForm
          token={feedbackRequest.token}
          appName={application.name}
          appColor={application.brandColor}
          initialComment={existing?.comment ?? ""}
          initialSuggestion={existing?.featureRequest?.description ?? ""}
          initialType={existing?.type ?? "GENERAL"}
        />
      </div>
    </main>
  );
}
