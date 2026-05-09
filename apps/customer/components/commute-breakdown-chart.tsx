"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  breakdown: Record<string, number>;
};

const colors = ["#25604a", "#f0b766", "#74b5aa", "#d9825f"];

export function CommuteBreakdownChart({ breakdown }: Props) {
  const data = Object.entries(breakdown).map(([name, value]) => ({
    name: name.replace("MonthlyVnd", ""),
    value
  }));

  return (
    <div className="h-72 rounded-3xl bg-background/80 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={98} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => Number(value).toLocaleString("vi-VN")} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
