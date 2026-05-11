"use client";
 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ChartCard from "../ChartCard";
 
type Row = {
  category: string;
  job_count: number;
  total_kwh: number;
  avg_kwh_per_job: number;
};
 
const COLOURS = ["#1d4ed8", "#0d9488", "#ca8a04", "#7c3aed", "#dc2626", "#059669"];
 
export default function Chart3EnergyByCategory() {
  return (
    <ChartCard<Row[]>
      title="Total energy consumption by workload category"
      queryName="chart3_energy_by_category"
      height={180}
    >
      {(data) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={12} width={150} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Total energy"]}
              contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}
            />
            <Bar dataKey="total_kwh" radius={[0, 4, 4, 0]}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLOURS[idx % COLOURS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
 