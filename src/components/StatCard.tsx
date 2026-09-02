import type { ReactNode } from "react";
import { Sparkline } from "@/components/Sparkline";

export function StatCard({
  label,
  value,
  icon,
  accentColor = "#2a78d6",
  trend,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accentColor?: string;
  trend?: number[];
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card dark:bg-zinc-950 dark:shadow-card-dark dark:ring-1 dark:ring-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        {icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm dark:bg-white/5"
            style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-ink dark:text-gold">{value}</p>
      {trend && (
        <div className="mt-2">
          <Sparkline data={trend} color={accentColor} />
        </div>
      )}
    </div>
  );
}
