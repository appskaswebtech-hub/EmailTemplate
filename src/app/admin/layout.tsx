import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-zinc-900">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}
