"use client";
 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ChartCard from "../ChartCard";
 
type Row = {
  category: string;
  avg_kwh_per_hour: number;
};
 
const COLOURS = ["#dc2626", "#ea580c", "#ca8a04", "#0d9488", "#1d4ed8", "#7c3aed"];
 
export default function Chart4EnergyIntensity() {
  return (
    <ChartCard<Row[]>
      title="Energy intensity by workload category"
      queryName="chart4_energy_intensity"
      height={180}
    >
      {(data) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 50, right: 10, top: 5, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(v) => v.toFixed(2)}
              label={{ value: "kWh per hour of runtime", position: "insideBottom", offset: -5, fontSize: 10, fill: "#64748b" }}
            />
            <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={12} width={150} interval={0} />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(3)} kWh/hr`, "Energy intensity"]}
              contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}
            />
            <Bar dataKey="avg_kwh_per_hour" radius={[0, 4, 4, 0]}>
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
