"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartCard from "../ChartCard";

type Row = {
  datacentre: string;
  region: string;
  pue_rating: number;
  gpu_count: number;
  total_kwh: number;
};

export default function ChartTotalEnergyPerSite() {
  return (
    <ChartCard<Row[]>
      title="Total energy consumption per site"
      queryName="chart_total_energy_per_site"
      height={220}
    >
      {(data) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20, top: 5, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              label={{ value: "Total kWh consumed", position: "insideBottom", offset: -5, fontSize: 10, fill: "#64748b" }}
            />
            <YAxis type="category" dataKey="datacentre" stroke="#64748b" fontSize={9} width={150} interval={0} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as Row;
                return (
                  <div className="bg-white border border-slate-200 rounded p-3 shadow-sm text-xs">
                    <p className="font-medium text-slate-900">{d.datacentre}</p>
                    <p className="text-slate-600">Region: {d.region}</p>
                    <p className="text-slate-600">PUE: {d.pue_rating}</p>
                    <p className="text-slate-600">GPUs: {d.gpu_count.toLocaleString()}</p>
                    <p className="text-slate-600">Total kWh: {d.total_kwh.toLocaleString()}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="total_kwh" radius={[0, 4, 4, 0]} fill="#1d4ed8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
