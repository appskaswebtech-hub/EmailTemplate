"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface AppFeedbackDatum {
  applicationName: string;
  count: number;
  brandColor: string;
}

export function FeedbackByAppChart({ data }: { data: AppFeedbackDatum[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-zinc-500">No feedback yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="applicationName" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#a1a1aa" />
        <Tooltip />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}
