import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaswebtech Feedback Platform",
  description: "Central feedback management for Kaswebtech Shopify apps",
};

const THEME_INIT_SCRIPT = `
  try {
    var theme = localStorage.getItem("admin-theme");
    if (theme === "dark" || (!theme)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
