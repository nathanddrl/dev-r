"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { HypeScore } from "@/types/hype";
import { HypeScoreTooltip } from "./HypeScoreTooltip";

interface HypeChartProps {
  data: HypeScore[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const github = payload.find((p) => p.dataKey === "githubScore")?.value ?? 0;
  const devto = payload.find((p) => p.dataKey === "devtoScore")?.value ?? 0;
  const total = payload.find((p) => p.dataKey === "score")?.value
    ?? Math.round(Number(github) * 0.6 + Number(devto) * 0.4);

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: "#3b82f6" }}>GitHub : {Number(github).toFixed(1)} / 100</p>
      <p style={{ color: "#10b981" }}>Dev.to : {Number(devto).toFixed(1)} / 100</p>
      <p className="font-medium mt-1">Hype total : {Number(total).toFixed(1)} / 100</p>
    </div>
  );
}

export function HypeChart({ data }: HypeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-2 text-muted-foreground">
        <span className="text-3xl opacity-40">📊</span>
        <p className="text-sm">Pas encore de données croisées disponibles.</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, name: d.label }));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Hype Score du jour</h2>
        <HypeScoreTooltip />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}`} label={{ value: "Score /100", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11 } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" />
          <Bar dataKey="githubScore" name="GitHub" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="devtoScore" name="Dev.to" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
