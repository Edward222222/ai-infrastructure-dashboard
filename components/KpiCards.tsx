"use client";
 
import { useEffect, useState } from "react";
 
type Metrics = {
  total_datacentres: number;
  total_gpus: number;
  jobs_last_24h: number;
  kwh_last_24h: number;
  avg_utilisation_pct: number;
  avg_pue: number;
};
 
function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString();
}
 
const KPIS: Array<{ key: keyof Metrics; label: string; format?: (n: number) => string }> = [
  { key: "total_datacentres",    label: "Data Centres" },
  { key: "total_gpus",           label: "GPUs",            format: formatNumber },
  { key: "jobs_last_24h",        label: "Jobs (24h)",      format: formatNumber },
  { key: "kwh_last_24h",         label: "kWh (24h)",       format: formatNumber },
  { key: "avg_utilisation_pct",  label: "Avg Utilisation", format: (n) => `${n}%` },
  { key: "avg_pue",              label: "Avg PUE" },
];
 
export default function KpiCards() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
 
  useEffect(() => {
    fetch("/api/summary_metrics")
      .then((r) => r.json())
      .then((json) => setMetrics(json.data));
  }, []);
 
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {KPIS.map(({ key, label, format }) => (
        <div key={key} className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-base font-medium text-slate-900 mt-0.5">
            {metrics ? (format ? format(metrics[key]) : metrics[key]) : "…"}
          </p>
        </div>
      ))}
    </div>
  );
}