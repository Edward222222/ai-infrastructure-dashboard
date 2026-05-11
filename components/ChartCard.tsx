"use client";

import { useState, useEffect, ReactNode } from "react";

type ApiResponse<T> = {
  query: string;
  description: string;
  sql: string;
  row_count: number;
  data: T;
};

type Props<T> = {
  title: string;
  queryName: string;
  className?: string;
  height?: number;
  headerExtra?: ReactNode;
  children: (data: T) => ReactNode;
};

export default function ChartCard<T>({
  title,
  queryName,
  className = "",
  height = 200,
  headerExtra,
  children,
}: Props<T>) {
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/${queryName}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) setError(json.error);
        else setResponse(json);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [queryName]);

  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-100 gap-2">
        <h3 className="text-sm font-medium text-slate-800 truncate">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {headerExtra}
          <button
            onClick={() => setShowSql(!showSql)}
            className="text-[10px] text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded px-1.5 py-0.5 transition-colors"
          >
            SQL
          </button>
        </div>
      </div>

      {showSql && response && (
        <pre className="bg-slate-50 border-b border-slate-100 px-3 py-2 text-[10px] text-slate-600 overflow-auto font-mono whitespace-pre-wrap max-h-40">
          {response.sql}
        </pre>
      )}

      <div className="p-1.5" style={{ height }}>
        {error && <p className="text-xs text-red-600">Error: {error}</p>}
        {!error && !response && <p className="text-xs text-slate-400">Loading…</p>}
        {response && children(response.data)}
      </div>
    </div>
  );
}
