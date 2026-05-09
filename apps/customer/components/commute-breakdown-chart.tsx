"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  breakdown: Record<string, number>;
}

const TOKEN_COLORS = [
  "#D7FF3D",
  "#FF6B5C",
  "#6CC8FF",
  "#FF9CC1",
  "#2BB673"
];

const LABEL_OVERRIDES: Record<string, string> = {
  direct: "Trực tiếp",
  amortized: "Khấu hao",
  weather: "Mưa",
  routine: "Thói quen"
};

export function CommuteBreakdownChart({ breakdown }: Props) {
  const data = Object.entries(breakdown).map(([name, value]) => {
    const key = name.replace("MonthlyVnd", "");
    return {
      name: LABEL_OVERRIDES[key] ?? key,
      value
    };
  });

  return (
    <div className="h-72 rounded-2xl border-2 border-foreground bg-paper p-4 shadow-brutal-sm">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={98}
            paddingAngle={4}
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={TOKEN_COLORS[index % TOKEN_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: "2px solid hsl(var(--foreground))",
              borderRadius: "12px",
              fontFamily: "var(--font-mono), DM Mono, monospace",
              fontSize: "11px",
              backgroundColor: "hsl(var(--paper))",
              color: "hsl(var(--foreground))"
            }}
            formatter={(value) => Number(value).toLocaleString("vi-VN")}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
