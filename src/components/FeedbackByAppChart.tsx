"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface AppFeedbackDatum {
  applicationName: string;
  count: number;
}

// Validated categorical order (see dataviz skill palette.md) — fixed order, never cycled per-request.
const CATEGORICAL_PALETTE = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

function TooltipContent({ active, payload }: { active?: boolean; payload?: { payload: AppFeedbackDatum }[] }) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-lg border border-zinc-100 bg-white px-3 py-2 text-xs shadow-card dark:border-zinc-700 dark:bg-zinc-900">
      <p className="font-semibold text-ink dark:text-white">{datum.applicationName}</p>
      <p className="text-zinc-500 dark:text-zinc-400">{datum.count} feedback</p>
    </div>
  );
}

export function FeedbackByAppChart({ data }: { data: AppFeedbackDatum[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No feedback yet.</p>;
  }

  // Chosen to hold reasonable contrast on both a white and a near-black chart surface,
  // since Recharts colors are plain SVG attributes and can't respond to a CSS dark: class.
  const chrome = { grid: "#8a8a86", axis: "#8a8a86", tick: "#8a8a86" };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} strokeDasharray="0" stroke={chrome.grid} strokeOpacity={0.25} />
        <XAxis
          dataKey="applicationName"
          tick={{ fontSize: 12, fill: chrome.tick }}
          stroke={chrome.axis}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: chrome.tick }}
          stroke={chrome.axis}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<TooltipContent />} cursor={{ fill: "#80808020" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={24}>
          {data.map((_, index) => (
            <Cell key={index} fill={CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
