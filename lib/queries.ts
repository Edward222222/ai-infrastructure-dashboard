// All SQL queries used by the dashboard live here as named exports.
// Each entry has the SQL string plus a description, so the API route
// can return both — the dashboard displays the SQL alongside each chart.

export type QueryDef = {
  description: string;
  sql: string;
};

export const QUERIES: Record<string, QueryDef> = {
  // -------------------------------------------------------------------------
  // KPI summary
  // -------------------------------------------------------------------------
  summary_metrics: {
    description: "Top-level KPIs for the dashboard header.",
    sql: `
      SELECT
        (SELECT COUNT(*) FROM DataCentre)                              AS total_datacentres,
        (SELECT COUNT(*) FROM GPU)                                     AS total_gpus,
        (SELECT COUNT(*) FROM WorkloadJob)                             AS total_jobs,
        (SELECT ROUND(SUM(kwh_consumed), 0) FROM EnergyRecord)         AS total_kwh,
        (SELECT ROUND(AVG(utilisation_pct), 1) FROM UtilisationRecord) AS avg_utilisation_pct,
        (SELECT ROUND(AVG(pue_rating), 2) FROM DataCentre)             AS avg_pue
    `,
  },

  // -------------------------------------------------------------------------
  // SECTION 1 — Utilisation imbalance (Use Case 1)
  // -------------------------------------------------------------------------
  chart1_gpu_utilisation_distribution: {
    description: "Average utilisation per GPU. Plotted as a histogram to reveal under- and over-utilised GPUs.",
    sql: `
      SELECT g.gpu_id,
             g.model,
             ROUND(AVG(ur.utilisation_pct), 1) AS avg_util_pct
      FROM GPU g
      JOIN UtilisationRecord ur ON g.gpu_id = ur.gpu_id
      GROUP BY g.gpu_id, g.model
    `,
  },

  chart_utilisation_bands: {
    description: "Fleet-wide breakdown of GPUs by utilisation band — actionable summary of imbalance pattern.",
    sql: `
      WITH gpu_avg AS (
        SELECT gpu_id, AVG(utilisation_pct) AS avg_util
        FROM UtilisationRecord
        GROUP BY gpu_id
      ),
      banded AS (
        SELECT
          CASE
            WHEN avg_util < 30 THEN 'Underutilised (<30%)'
            WHEN avg_util <= 70 THEN 'Healthy (30-70%)'
            ELSE 'Saturated (>70%)'
          END AS band,
          CASE
            WHEN avg_util < 30 THEN 1
            WHEN avg_util <= 70 THEN 2
            ELSE 3
          END AS sort_order
        FROM gpu_avg
      )
      SELECT band,
             COUNT(*) AS gpu_count,
             ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM banded), 1) AS pct_of_fleet
      FROM banded
      GROUP BY band, sort_order
      ORDER BY sort_order
    `,
  },

  chart_total_energy_per_site: {
    description: "Total energy consumption per data centre — surfaces absolute scale of each site's consumption. 4-table join.",
    sql: `
      SELECT dc.name                            AS datacentre,
             dc.region                          AS region,
             dc.pue_rating                      AS pue_rating,
             COUNT(DISTINCT g.gpu_id)           AS gpu_count,
             ROUND(SUM(er.kwh_consumed), 1)     AS total_kwh
      FROM DataCentre dc
      JOIN GPU g           ON dc.datacentre_id = g.datacentre_id
      JOIN WorkloadJob wj  ON wj.gpu_id = g.gpu_id
      JOIN EnergyRecord er ON er.job_id = wj.job_id
      GROUP BY dc.datacentre_id
      ORDER BY total_kwh DESC
    `,
  },

  // -------------------------------------------------------------------------
  // SECTION 2 — Energy by workload type (Use Case 2)
  // -------------------------------------------------------------------------
  chart3_energy_by_category: {
    description: "Total energy consumption (kWh) by workload category. 3-table join.",
    sql: `
      SELECT wc.category_name                     AS category,
             COUNT(*)                             AS job_count,
             ROUND(SUM(er.kwh_consumed), 1)       AS total_kwh,
             ROUND(AVG(er.kwh_consumed), 2)       AS avg_kwh_per_job
      FROM EnergyRecord er
      JOIN WorkloadJob wj      ON er.job_id = wj.job_id
      JOIN WorkloadCategory wc ON wj.category_id = wc.category_id
      GROUP BY wc.category_name
      ORDER BY total_kwh DESC
    `,
  },

  chart4_energy_intensity: {
    description: "Average kWh consumed per hour of runtime, by workload category.",
    sql: `
      SELECT wc.category_name AS category,
             ROUND(AVG(er.kwh_consumed /
                 ((julianday(wj.end_time) - julianday(wj.start_time)) * 24.0)
             ), 3) AS avg_kwh_per_hour
      FROM EnergyRecord er
      JOIN WorkloadJob wj      ON er.job_id = wj.job_id
      JOIN WorkloadCategory wc ON wj.category_id = wc.category_id
      WHERE wj.end_time IS NOT NULL
        AND (julianday(wj.end_time) - julianday(wj.start_time)) > 0
      GROUP BY wc.category_name
      ORDER BY avg_kwh_per_hour DESC
    `,
  },

  // -------------------------------------------------------------------------
  // SECTION 3 — Cross-data-centre benchmarking (Use Case 3)
  // -------------------------------------------------------------------------
  chart5_datacentre_benchmark: {
    description: "Per-data-centre PUE rating vs total energy consumed. 4-table join.",
    sql: `
      SELECT dc.name                              AS datacentre,
             dc.region                            AS region,
             dc.country                           AS country,
             dc.pue_rating                        AS pue_rating,
             COUNT(DISTINCT g.gpu_id)             AS gpu_count,
             COUNT(DISTINCT wj.job_id)            AS jobs_run,
             ROUND(SUM(er.kwh_consumed), 1)       AS total_kwh
      FROM DataCentre dc
      JOIN GPU g           ON dc.datacentre_id = g.datacentre_id
      JOIN WorkloadJob wj  ON wj.gpu_id = g.gpu_id
      JOIN EnergyRecord er ON er.job_id = wj.job_id
      GROUP BY dc.datacentre_id
      ORDER BY total_kwh DESC
    `,
  },
};
