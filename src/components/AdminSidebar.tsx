"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/applications", label: "Applications", icon: "🧩" },
  { href: "/admin/feedback", label: "Feedback", icon: "💬" },
  { href: "/admin/sent-emails", label: "Sent Emails", icon: "📧" },
  { href: "/admin/send-csv", label: "Send CSV", icon: "📤" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950">
      <Link href="/admin" className="mb-8 px-2 text-base font-bold text-ink dark:text-white">
        Kaswebtech <span className="text-gold-dark dark:text-gold">Feedback</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "flex items-center gap-3 rounded-lg border-l-2 border-gold bg-amber-50 px-3 py-2 text-sm font-semibold text-gold-dark dark:bg-white/5 dark:text-gold"
                  : "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-ink dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-50 hover:text-ink dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <span>🚪</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
