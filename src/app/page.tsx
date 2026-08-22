import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink">Kaswebtech Feedback Platform</h1>
      <p className="max-w-md text-sm text-zinc-500">
        Central feedback collection for every Kaswebtech Shopify app. Feedback links are
        sent by email to merchants; staff manage responses in the admin dashboard.
      </p>
      <Link
        href="/admin"
        className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white"
      >
        Go to Admin Dashboard
      </Link>
    </main>
  );
}
