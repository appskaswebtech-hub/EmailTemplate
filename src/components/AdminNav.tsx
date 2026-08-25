"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/sent-emails", label: "Sent Emails" },
  { href: "/admin/send-csv", label: "Send CSV" },
];

export function AdminNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <nav className="flex items-center gap-6 text-sm">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "font-semibold text-ink"
              : "text-zinc-500 hover:text-ink"
          }
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="text-zinc-500 hover:text-ink"
      >
        Sign out
      </button>
    </nav>
  );
}
