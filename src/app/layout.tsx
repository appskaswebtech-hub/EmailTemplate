import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaswebtech Feedback Platform",
  description: "Central feedback management for Kaswebtech Shopify apps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
