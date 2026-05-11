"use client";

import ChartCard from "../ChartCard";

type Row = {
  band: string;
  gpu_count: number;
  pct_of_fleet: number;
};

export default function ChartUtilisationBands() {
  return (
    <ChartCard<Row[]>
      title="Utilisation bands"
      queryName="chart_utilisation_bands"
      height={180}
    >
      {(data) => (
        <div className="h-full flex flex-col justify-center">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-left text-[9px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-1.5 font-normal">Band</th>
                <th className="py-1.5 font-normal text-right">GPUs</th>
                <th className="py-1.5 font-normal text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.band} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-2 text-slate-700">{row.band}</td>
                  <td className="py-2 text-right text-slate-700 font-medium">{row.gpu_count.toLocaleString()}</td>
                  <td className="py-2 text-right text-slate-700">{row.pct_of_fleet}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}
