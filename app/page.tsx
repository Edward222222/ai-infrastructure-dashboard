import KpiCards from "../components/KpiCards";
import Chart1GpuUtilisationDistribution from "../components/charts/Chart1gpuutilisationdistribution";
import ChartTotalEnergyPerSite from "../components/charts/ChartTotalEnergyPerSite";
import ChartUtilisationBands from "../components/charts/ChartUtilisationBands";
import Chart3EnergyByCategory from "../components/charts/Chart3energybycategory";
import Chart4EnergyIntensity from "../components/charts/Chart4energyintensity";
import Chart5DatacentreBenchmark from "../components/charts/Chart5datacentrebenchmark";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
      {children}
    </p>
  );
}

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">AI Infrastructure Monitoring Dashboard</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              A data solution to optimise GPU utilisation and energy efficiency across a global AI infrastructure fleet
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-2">

        {/* KPI strip */}
        <section className="mb-2">
          <KpiCards />
        </section>

        {/* Row 1 — Utilisation imbalance */}
        <section className="mb-2">
          <SectionLabel>1 · Utilisation imbalance</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2">
              <Chart1GpuUtilisationDistribution />
            </div>
            <ChartUtilisationBands />
          </div>
        </section>

        {/* Row 2 — Energy by workload type */}
        <section className="mb-2">
          <SectionLabel>2 · Energy by workload type</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Chart3EnergyByCategory />
            <Chart4EnergyIntensity />
          </div>
        </section>

        {/* Row 3 — Cross-data-centre benchmarking */}
        <section className="mb-2">
          <SectionLabel>3 · Cross-data-centre benchmarking</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <ChartTotalEnergyPerSite />
            <Chart5DatacentreBenchmark />
          </div>
        </section>

      </div>
    </main>
  );
}
