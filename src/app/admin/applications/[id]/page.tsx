import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { ApplicationActions } from "@/components/ApplicationActions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { feedback: true, merchants: true, featureRequests: true } },
    },
  });

  if (!application) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Image
          src={application.logoUrl}
          alt={application.name}
          width={56}
          height={56}
          className="rounded-full"
        />
        <div>
          <h1 className="text-lg font-bold text-ink">{application.name}</h1>
          <p className="text-sm text-zinc-500">
            {application.appId} &middot; key prefix {application.apiKeyPrefix}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Feedback responses" value={application._count.feedback} />
        <StatCard label="Merchants" value={application._count.merchants} />
        <StatCard label="Feature requests" value={application._count.featureRequests} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-ink">API key management</h2>
        <ApplicationActions applicationId={application.id} status={application.status} />
      </div>
    </div>
  );
}
