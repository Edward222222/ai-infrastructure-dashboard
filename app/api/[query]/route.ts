export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { QUERIES } from "../../../lib/queries";
 
// Equivalent of Flask's @app.route("/api/<query>") with method GET.
// The query name is the URL segment, e.g. /api/chart3_energy_by_category
// resolves QUERIES["chart3_energy_by_category"], runs the SQL, and returns
// the rows along with the SQL itself so the dashboard can display it.
 
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ query: string }> }
) {
  const { query } = await context.params;
  const def = QUERIES[query];
 
  if (!def) {
    return NextResponse.json(
      { error: `Unknown query: ${query}` },
      { status: 404 }
    );
  }
 
  try {
    const db = getDb();
    const sql = def.sql.trim();
    const rows = db.prepare(sql).all();
 
    // For the summary endpoint we flatten the single-row result into an object,
    // since the frontend treats it as a metrics object rather than a list.
    const data = query === "summary_metrics" && rows.length === 1 ? rows[0] : rows;
 
    return NextResponse.json({
      query,
      description: def.description,
      sql,
      row_count: Array.isArray(data) ? data.length : 1,
      data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query execution failed";
    return NextResponse.json({ error: message, query }, { status: 500 });
  }
}
 