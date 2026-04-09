"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { HypeScore } from "@/types/hype";
import { HypeScoreTooltip } from "./HypeScoreTooltip";

interface HypeChartProps {
  data: HypeScore[];
}

const TERRACOTTA = "#D97B4F";
const EAU = "#A8C4B8";

function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  const github = payload.find((p) => p.dataKey === "githubScore")?.value ?? 0;
  const devto = payload.find((p) => p.dataKey === "devtoScore")?.value ?? 0;
  const total = payload.find((p) => p.dataKey === "score")?.value
    ?? Math.round(Number(github) * 0.6 + Number(devto) * 0.4);

  return (
    <div
      style={{
        background: "var(--color-surface, #E8DFD0)",
        border: "0.5px solid var(--border-primary, rgba(60,55,50,0.15))",
        borderRadius: "10px",
        padding: "12px 14px",
        fontSize: "13px",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary, #3D3A35)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
      <p style={{ color: TERRACOTTA }}>GitHub : {Number(github).toFixed(1)} / 100</p>
      <p style={{ color: EAU }}>Dev.to : {Number(devto).toFixed(1)} / 100</p>
      <p style={{ fontWeight: 500, marginTop: 6, color: "var(--color-text-secondary, #6B6560)" }}>
        Hype total : {Number(total).toFixed(1)} / 100
      </p>
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
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--color-text-primary, #3D3A35)",
          }}
        >
          Hype Score du jour
        </h2>
        <HypeScoreTooltip />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--color-text-secondary, #6B6560)", fontFamily: "var(--font-body)" }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}`} tick={{ fontSize: 11, fill: "var(--color-text-tertiary, #9E9890)", fontFamily: "var(--font-body)" }} label={{ value: "Score /100", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 11, fill: "var(--color-text-tertiary, #9E9890)" } }} />
          <Tooltip content={CustomTooltip} />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-text-secondary, #6B6560)" }} />
          <Bar dataKey="githubScore" name="GitHub" fill={TERRACOTTA} radius={[4, 4, 0, 0]} />
          <Bar dataKey="devtoScore" name="Dev.to" fill={EAU} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
