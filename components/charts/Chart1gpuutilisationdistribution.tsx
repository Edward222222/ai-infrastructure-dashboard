"use client";
 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartCard from "../ChartCard";
 
type Row = {
  gpu_id: number;
  model: string;
  avg_util_pct: number;
};
 
// Bin per-GPU averages into 10 buckets of 10% each.
function bucketise(rows: Row[]): Array<{ bucket: string; count: number }> {
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    bucket: `${i * 10}-${(i + 1) * 10}%`,
    count: 0,
  }));
  for (const r of rows) {
    const idx = Math.min(9, Math.floor(r.avg_util_pct / 10));
    buckets[idx].count++;
  }
  return buckets;
}
 
export default function Chart1GpuUtilisationDistribution() {
  return (
    <ChartCard<Row[]>
      title="GPU utilisation distribution"
      queryName="chart1_gpu_utilisation_distribution"
      height={180}
    >
      {(data) => {
        const binned = bucketise(data);
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={binned} margin={{ left: 0, right: 20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                formatter={(value) => [`${value} GPUs`, "Count"]}
                contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }}
    </ChartCard>
  );
}