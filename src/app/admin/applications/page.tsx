import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CreateApplicationDialog } from "@/components/CreateApplicationDialog";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { feedback: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink">Applications</h1>
        <CreateApplicationDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/admin/applications/${app.id}`}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <Image
                src={app.logoUrl}
                alt={app.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-ink">{app.name}</p>
                <p className="text-xs text-zinc-500">{app.appId}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  app.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {app.status}
              </span>
              <span className="text-zinc-500">{app._count.feedback} responses</span>
            </div>
          </Link>
        ))}

        {applications.length === 0 && (
          <p className="text-sm text-zinc-500">No applications yet. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}
