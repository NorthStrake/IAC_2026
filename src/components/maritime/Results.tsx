import { BadgeCheck, Calendar, Download, FileText, Compass, DollarSign, Activity, AlertCircle } from 'lucide-react';

type Json = Record<string, unknown>;

const get = (o: unknown, ...keys: string[]): unknown => {
  if (!o || typeof o !== 'object') return undefined;
  for (const key of keys) {
    const value = (o as Json)[key];
    if (value !== null && value !== undefined) return value;
  }
  return undefined;
};

const show = (value: unknown, usd = false) => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'number') {
    return `${usd ? '$' : ''}${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
  return String(value);
};

const object = (v: unknown): Json => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : {});

export function Results({ data, error }: { data: Json | null; error: boolean }) {
  if (!data) {
    return (
      <section className="card-executive relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
              <Compass className="h-5 w-5 animate-pulse" />
            </span>
            <h2 className="text-base font-bold text-slate-100">Voyage Yield & Allocation</h2>
          </div>
          <span
            className={`num rounded-full border px-3 py-0.5 text-xs font-semibold ${
              error
                ? 'border-rose-500/40 bg-rose-950/40 text-rose-400'
                : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-400'
            }`}
          >
            {error ? 'OFFLINE' : 'STANDBY'}
          </span>
        </div>

        {error ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 rounded-full border border-rose-500/30 bg-rose-950/40 p-4 text-rose-400">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-base font-bold text-rose-300">Harbor Server Offline</h3>
            <p className="mt-2 max-w-xs text-xs text-slate-400 leading-relaxed">
              Unable to reach predictive engine at <code className="text-cyan-400 font-mono">http://localhost:8000/predict</code>. Verify your backend service is running.
            </p>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-900/80 text-cyan-400">
              <Activity className="h-8 w-8 animate-sonar-ping" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Telemetry Engine Ready</h3>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-400">
              Configure route coordinates and fleet manifest on the left, then dispatch the simulation to forecast four-month forward freight curves.
            </p>
          </div>
        )}
      </section>
    );
  }

  const alloc = object(get(data, 'allocation', 'optimal_allocation', 'fleet_allocation', 'order_matching') ?? data);
  const raw = get(data, 'forecast', 'forecasts', 'freight_forecast', 'monthly_forecast');
  const forecast = Array.isArray(raw) ? raw : [];
  const status = String(get(alloc, 'status', 'allocation_status') ?? 'Eligible');
  const eligible = /^eligible$/i.test(status.trim());
  const total = get(alloc, 'total_cost', 'net_cost', 'total_optimized_cost') ?? get(data, 'total_estimated_freight_cost');

  const rows = forecast.slice(0, 4).map((m, i) => [
    show(get(m, 'horizon_month', 'month', 'forecast_month') ?? `Month +${i + 1}`),
    show(get(m, 'freight_rate', 'predicted_rate', 'rate_usd_per_tonne', 'predicted_freight_rate_usd_per_tonne'), true),
    show(get(m, 'total_cost', 'total_freight_cost', 'estimated_total_voyage_cost_usd'), true),
    show(get(m, 'arrival_date', 'estimated_arrival_date', 'forecast_month'))
  ]);

  const costs: [string, unknown, boolean][] = [
    ['Repositioning Cost Surcharge', get(alloc, 'reposition_cost', 'repositioning_cost'), true],
    ['Port Demurrage / Idle Days', get(alloc, 'idle_days', 'demurrage_days'), false],
    ['Idle Cost Surcharge', get(alloc, 'idle_cost', 'idle_surcharge'), true]
  ];

  function exportCsv() {
    const values = [
      ['Maritime Freight & Vessel Chartering Report'],
      ['Matched Order ID', show(get(alloc, 'order_id', 'matched_order_id'))],
      ['Status', status],
      [],
      ['Horizon Month', 'Predicted Rate (USD/tonne)', 'Total Freight Cost (USD)', 'Estimated Arrival Date'],
      ...rows,
      [],
      ...costs.map(([l, v, usd]) => [l, show(v, usd)]),
      ['Total Minimized Voyage Cost', show(total, true)]
    ];
    const csv = values
      .map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maritime-voyage-yield-forecast.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card-executive relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-100">Simulation Resolved</h2>
            <p className="text-[11px] font-mono text-emerald-400">4-MONTH FORWARD FREIGHT CURVE</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-700 transition"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print report"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700 transition"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* 4-Month Forecast Horizon Cards */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            Forward Monthly Charter Rates & Yield
          </h3>
          {rows.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {rows.map(([month, rate, cost, date], i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3.5 transition-all hover:border-cyan-500/40 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span className="num font-bold text-cyan-400">Month +{i + 1}</span>
                    <span className="font-mono text-[10px]">{month}</span>
                  </div>
                  <div className="my-1.5">
                    <div className="num text-2xl font-black tracking-tight text-slate-100">
                      {rate}
                      <span className="text-xs font-normal text-slate-400"> / tonne</span>
                    </div>
                    <div className="num text-xs font-semibold text-slate-300">
                      Total: {cost}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    Est. Arrival: {date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No forward horizon rows available.</p>
          )}
        </div>

        {/* Fleet Allocation & Cost Optimization Card */}
        <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-400" />
              Optimal Fleet Allocation & Surcharges
            </span>
            <span className="num rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {show(get(alloc, 'order_id', 'matched_order_id'))}
            </span>
          </div>

          <dl className="mt-3 space-y-2 text-xs">
            {costs.map(([label, value, usd]) => (
              <div key={label} className="flex justify-between text-slate-300">
                <dt className="text-slate-400">{label}</dt>
                <dd className="num font-semibold text-slate-200">{show(value, usd)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
              <dt className="text-slate-200">Net Optimized Voyage Cost</dt>
              <dd className="num font-black text-amber-400">{show(total, true)}</dd>
            </div>
          </dl>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold tracking-wider ${
                eligible
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
              }`}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {eligible ? 'ELIGIBLE SHIPMENT ALLOCATED' : status.toUpperCase()}
            </span>
            <span className="text-[11px] font-mono text-slate-500">CONSTRAINTS SATISFIED</span>
          </div>
        </div>

        {/* Collapsible Raw JSON Data */}
        <details className="text-[11px] font-mono text-slate-500">
          <summary className="cursor-pointer hover:text-slate-300 transition">View Model Inference Payload</summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-[10px] text-slate-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    </section>
  );
}
