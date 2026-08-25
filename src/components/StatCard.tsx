import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  accentColor = "#2a78d6",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        {icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
            style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
