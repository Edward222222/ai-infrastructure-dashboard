"use client";
 
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, LabelList, ReferenceLine } from "recharts";
import ChartCard from "../ChartCard";
 
type Row = {
  datacentre: string;
  region: string;
  country: string;
  pue_rating: number;
  gpu_count: number;
  jobs_run: number;
  total_kwh: number;
};
 
const REGION_COLOURS: Record<string, string> = {
  "Europe":         "#1d4ed8",
  "Asia":           "#dc2626",
  "North America":  "#0d9488",
  "South America":  "#ca8a04",
  "Africa":         "#7c3aed",
  "Oceania":        "#0891b2",
  "Middle East":    "#ea580c",
};
 
export default function Chart5DatacentreBenchmark() {
  return (
    <ChartCard<Row[]>
      title="Data centre benchmark: PUE vs total energy"
      queryName="chart5_datacentre_benchmark"
      height={220}
    >
      {(data) => {
        const medianPue = data.length
          ? [...data].map(d => d.pue_rating).sort((a, b) => a - b)[Math.floor(data.length / 2)]
          : 1.27;
        const medianKwh = data.length
          ? [...data].map(d => d.total_kwh).sort((a, b) => a - b)[Math.floor(data.length / 2)]
          : 30000;
        return (
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <ReferenceLine x={medianPue} stroke="#94a3b8" strokeDasharray="3 3" />
              <ReferenceLine y={medianKwh} stroke="#94a3b8" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="pue_rating"
                name="PUE"
                domain={["dataMin - 0.05", "dataMax + 0.05"]}
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => v.toFixed(2)}
                label={{ value: "PUE rating (lower = more efficient)", position: "bottom", offset: 0, fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                type="number"
                dataKey="total_kwh"
                name="Total kWh"
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                label={{ value: "Total kWh", angle: -90, position: "insideLeft", offset: 10, fontSize: 12, fill: "#64748b" }}
              />
              <ZAxis type="number" dataKey="gpu_count" range={[30, 120]} name="GPUs" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload as Row;
                  return (
                    <div className="bg-white border border-slate-200 rounded p-3 shadow-sm text-xs">
                      <p className="font-medium text-slate-900">{d.datacentre} · {d.country}</p>
                      <p className="text-slate-600">Region: {d.region}</p>
                      <p className="text-slate-600">PUE: {d.pue_rating}</p>
                      <p className="text-slate-600">Total kWh: {d.total_kwh.toLocaleString()}</p>
                      <p className="text-slate-600">Jobs: {d.jobs_run.toLocaleString()}</p>
                      <p className="text-slate-600">GPUs: {d.gpu_count.toLocaleString()}</p>
                    </div>
                  );
                }}
              />
              <Scatter data={data}>
                <LabelList
                  dataKey="datacentre"
                  content={(props: any) => {
                    const { x, y, value, index } = props;
                    if (x == null || y == null) return null;
                    const dy = index % 2 === 0 ? -8 : 14;
                    return (
                      <text
                        x={x}
                        y={y + dy}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={500}
                        fill="#475569"
                      >
                        {value}
                      </text>
                    );
                  }}
                />
                {data.map((row, idx) => (
                  <Cell key={idx} fill={REGION_COLOURS[row.region] || "#64748b"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-2 text-[10px]">
              {Object.entries(REGION_COLOURS).map(([region, colour]) => (
                <div key={region} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: colour }} />
                  <span className="text-slate-600">{region}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-[9px] text-slate-500 flex-shrink-0">
              <span>Bubble size = GPU count</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-slate-400" />
            </div>
          </div>
        </div>
        );
      }}
    </ChartCard>
  );
}
