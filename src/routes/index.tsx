import { createFileRoute } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  Coins,
  Gauge,
  MapPin,
  Package,
  RotateCcw,
  Ship,
  TrendingUp,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BoatSlider, Card, NumberField, PortField, inputClass, labelClass } from '@/components/maritime/fields';
import {
  BauxiteIcon,
  CoalIcon,
  CommanderOfficer,
  Helm,
  HoldVisualizer,
  LoadingOverlay,
  OceanBackground,
  OreIcon,
  Propeller,
  VesselMorph,
  WheatIcon
} from '@/components/maritime/visuals';
import { Results } from '@/components/maritime/Results';
import { DEFAULTS, ENDPOINT, LIMITS, MARKET, PORTS, payloadFor, validateForm, type Form, type NumKey } from '@/components/maritime/model';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Tidewise — Executive Maritime Intelligence' },
      { name: 'description', content: 'Enterprise bulk voyage planning and forward freight rate forecasting platform.' },
      { property: 'og:title', content: 'Tidewise Maritime Analytics' },
      { property: 'og:description', content: 'Forward freight rate forecasting & optimal fleet allocation engine.' }
    ]
  }),
  component: Index
});

const VESSELS: [string, string, number][] = [
  ['Handysize', '25k–39k DWT', 32000],
  ['Supramax', '50k–65k DWT', 58000],
  ['Panamax', '65k–85k DWT', 82406],
  ['Capesize', '100k–200k DWT', 175000]
];

const CARGO: [string, (p: { className?: string }) => ReactNode][] = [
  ['Coal', CoalIcon],
  ['Iron Ore', OreIcon],
  ['Wheat', WheatIcon],
  ['Bauxite', BauxiteIcon]
];

const OFFLINE = 'Harbor server offline at http://localhost:8000. Start backend to receive real inferences.';

function Index() {
  const [f, setF] = useState<Form>({ ...DEFAULTS });
  const [chest, setChest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);
  const [isSlidingActive, setIsSlidingActive] = useState(false);

  // Executive Tactical Commander briefing dialogue
  const [commanderSpeech, setCommanderSpeech] = useState(
    'Bridge systems operational. Ready to evaluate voyage parameters.'
  );

  const portName = (id: string) => PORTS.find(p => p.id === id)?.name ?? id;

  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => {
    setF(p => ({ ...p, [k]: v }));
    if (k === 'quantity_mt') {
      setCommanderSpeech(
        Number(v) > 100000
          ? `High-tonnage manifest: ${Number(v).toLocaleString()} MT. Verifying deep-water berth clearance.`
          : `Manifest updated: ${Number(v).toLocaleString()} MT standard loading.`
      );
    } else if (k === 'destination_port_id') {
      setCommanderSpeech(`Destination set: ${portName(String(v))}. Checking port congestion and tide drafts.`);
    } else if (k === 'origin_port_id') {
      setCommanderSpeech(`Origin port locked: ${portName(String(v))}. Computing Great Circle nautical trajectory.`);
    } else if (k === 'speed_knots') {
      setCommanderSpeech(`Cruising speed adjusted: ${Number(v).toFixed(1)} knots. Balancing fuel burn vs ETA.`);
    } else if (k === 'vessel_type') {
      setCommanderSpeech(`Vessel class configured: ${String(v)}. Recalibrating hydrodynamic fuel consumption curve.`);
    }
  };

  async function dispatch() {
    if (!validateForm(f)) {
      toast.error('Voyage parameters outside operational specifications. Please verify inputs.');
      return;
    }
    setError(false);
    setResult(null);
    setLoading(true);
    setCommanderSpeech('Transmitting voyage trajectory to AI inference engine...');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFor(f)),
        signal: AbortSignal.timeout(60000)
      });
      if (!response.ok) throw new Error('Inference server returned error');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Malformed telemetry response');
      setResult(data as Record<string, unknown>);
      setCommanderSpeech('Simulation resolved. Four-month forward charter rate curve generated.');
      toast.success('Simulation complete. Optimal fleet schedule resolved.');
    } catch {
      setError(true);
      setCommanderSpeech('Connection error: Harbor server unreachable at http://localhost:8000.');
      toast.error(OFFLINE);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setF({ ...DEFAULTS });
    setChest(false);
    setResult(null);
    setError(false);
    setCommanderSpeech('Telemetry parameters reset to baseline configuration.');
  }

  const [qMin, qMax, qStep] = LIMITS.quantity_mt;
  const [dMin, dMax, dStep] = LIMITS.distance_nm;
  const [sMin, sMax, sStep] = LIMITS.speed_knots;

  return (
    <div className="relative min-h-screen">
      <OceanBackground />

      {/* Header */}
      <header className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 pt-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Ship className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-slate-100">TIDEWISE</span>
              <span className="rounded-md border border-cyan-500/40 bg-cyan-950/60 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-cyan-300">
                PRO 2026
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400">Enterprise Maritime Logistics & Charter Forecasting</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300">
            <Radio className={`h-3 w-3 ${error ? 'text-rose-400' : 'animate-pulse text-emerald-400'}`} />
            <span>Telemetry Server</span>
            <span className="num font-mono text-[11px] text-cyan-400">localhost:8000</span>
          </span>
          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:bg-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* Subheader Title */}
      <div className="mx-auto max-w-[1400px] px-6 pb-2 pt-6 lg:px-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          Voyage Planning & Yield Optimization
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Chart dry-bulk trade corridors, verify vessel hydrodynamic clearance, and forecast forward freight rates.
        </p>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 pb-28 pt-4 lg:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Left Column: Form & Tactical Console */}
          <div className="space-y-6">
            {/* Tactical Commander Bridge Console (Side Station) */}
            <div className="card-executive overflow-hidden border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-[#0B172A] to-slate-900/90 p-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {isSlidingActive ? (
                    <div className="h-16 w-16 flex items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/40 p-1 animate-pulse">
                      <VesselMorph dir={1} className="scale-75" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950 p-1">
                      <CommanderOfficer className="h-full w-full" status={loading ? 'analyzing' : 'standby'} />
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-950 ${
                      isSlidingActive ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      COMMANDER VANCE // FLEET NAVIGATOR
                    </span>
                    <span className="num font-mono text-[10px] text-cyan-400 tracking-wider">
                      {isSlidingActive ? 'ACTIVE MORPH // HYDRODYNAMIC SLIDER' : 'BRIDGE STANDBY'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-cyan-200/90 font-medium truncate">
                    {isSlidingActive
                      ? 'Deploying vessel hull along trajectory track. Adjusting nautical values...'
                      : commanderSpeech}
                  </p>
                </div>
              </div>
            </div>

            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                void dispatch();
              }}
            >
              {/* Card 1: Route & Voyage Corridor */}
              <Card
                icon={<MapPin className="h-5 w-5" />}
                title="Route & Voyage Trajectory"
                subtitle="Select load and discharge ports across international dry-bulk terminals"
                badge={
                  <span className="num rounded-md border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
                    {f.route_id}
                  </span>
                }
              >
                <PortField
                  label="Origin Port (Load Terminal)"
                  value={f.origin_port_id}
                  onChange={set('origin_port_id')}
                  ports={PORTS}
                />
                <PortField
                  label="Destination Port (Discharge Terminal)"
                  value={f.destination_port_id}
                  onChange={set('destination_port_id')}
                  ports={[...PORTS.slice(13), ...PORTS.slice(0, 13)]}
                />

                <div className="space-y-1.5">
                  <label htmlFor="route-id" className={labelClass}>
                    Route Code Identifier
                  </label>
                  <input
                    id="route-id"
                    required
                    value={f.route_id}
                    onChange={e => set('route_id')(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="departure" className={labelClass}>
                    <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
                    Forecast Origin Month
                  </label>
                  <input
                    id="departure"
                    type="month"
                    required
                    value={f.current_month}
                    onChange={e => set('current_month')(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <BoatSlider
                  label="Voyage Distance (Nautical Miles)"
                  value={f.distance_nm}
                  onChange={set('distance_nm')}
                  min={dMin}
                  max={dMax}
                  step={dStep}
                  onSlidingActive={setIsSlidingActive}
                  readout={
                    <>
                      {f.distance_nm.toLocaleString()} NM · {Math.round(f.distance_nm * 1.852).toLocaleString()} km
                    </>
                  }
                />
              </Card>

              {/* Card 2: Cargo & Vessel Manifest */}
              <Card
                icon={<Package className="h-5 w-5" />}
                title="Cargo & Vessel Allocation"
                subtitle="Specify bulk commodity volume, vessel class, and operating costs"
              >
                {/* Cargo Type Selector */}
                <div className="space-y-2 sm:col-span-2">
                  <span className={labelClass}>Cargo Commodity Classification</span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {CARGO.map(([name, Icon]) => {
                      const on = f.type_of_cargo === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set('type_of_cargo')(name)}
                          className={`flex flex-col items-center justify-center rounded-xl border p-3 font-semibold transition-all cursor-pointer ${
                            on
                              ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <Icon className="h-10 w-10 mb-1" />
                          <span className="text-xs">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <BoatSlider
                  label="Cargo Quantity"
                  value={f.quantity_mt}
                  onChange={set('quantity_mt')}
                  min={qMin}
                  max={qMax}
                  step={qStep}
                  onSlidingActive={setIsSlidingActive}
                  readout={
                    <>
                      {f.quantity_mt.toLocaleString()} MT · {(f.quantity_mt * 1000).toLocaleString()} kg
                    </>
                  }
                />

                <div className="sm:col-span-2">
                  <HoldVisualizer quantity={f.quantity_mt} max={qMax} />
                </div>

                {/* Vessel Class Selector */}
                <div className="space-y-2 sm:col-span-2">
                  <span className={labelClass}>
                    <Ship className="h-3.5 w-3.5 text-cyan-400" />
                    Vessel Specification Class
                  </span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {VESSELS.map(([name, range, defaultDwt]) => {
                      const on = f.vessel_type === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            set('vessel_type')(name);
                            set('deadweight_tonnage_dwt')(defaultDwt);
                          }}
                          className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            on
                              ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <span className="block text-xs font-bold text-slate-100">{name}</span>
                          <span className="num text-[11px] font-mono text-cyan-400">{range}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <NumberField
                  label="Deadweight Tonnage"
                  value={f.deadweight_tonnage_dwt}
                  onChange={set('deadweight_tonnage_dwt')}
                  min={LIMITS.deadweight_tonnage_dwt[0]}
                  max={LIMITS.deadweight_tonnage_dwt[1]}
                  unit="DWT"
                  icon={<Gauge className="h-3.5 w-3.5 text-cyan-400" />}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="speed" className={labelClass}>
                      Cruising Service Speed
                    </label>
                    <Propeller speed={f.speed_knots} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      id="speed"
                      type="range"
                      min={sMin}
                      max={sMax}
                      step={sStep}
                      value={f.speed_knots}
                      onChange={e => set('speed_knots')(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-950 accent-cyan-400 cursor-pointer"
                    />
                    <span className="num font-mono text-sm font-bold text-cyan-400 w-16 text-right">
                      {f.speed_knots.toFixed(1)} kn
                    </span>
                  </div>
                </div>

                <NumberField
                  label="Daily Idle Demurrage Cost"
                  value={f.idle_cost_per_day}
                  onChange={set('idle_cost_per_day')}
                  min={LIMITS.idle_cost_per_day[0]}
                  max={LIMITS.idle_cost_per_day[1]}
                  step={LIMITS.idle_cost_per_day[2]}
                  unit="USD / day"
                  icon={<Coins className="h-3.5 w-3.5 text-amber-400" />}
                />

                <NumberField
                  label="Repositioning Surcharge"
                  value={f.reposition_cost_per_distance}
                  onChange={set('reposition_cost_per_distance')}
                  min={LIMITS.reposition_cost_per_distance[0]}
                  max={LIMITS.reposition_cost_per_distance[1]}
                  step={LIMITS.reposition_cost_per_distance[2]}
                  unit="USD / NM"
                  icon={<Coins className="h-3.5 w-3.5 text-amber-400" />}
                />

                <div className="sm:col-span-2">
                  <NumberField
                    label="Maximum Travel & Arrival Window"
                    value={f.expected_arrival_hours}
                    onChange={set('expected_arrival_hours')}
                    min={LIMITS.expected_arrival_hours[0]}
                    max={LIMITS.expected_arrival_hours[1]}
                    step={LIMITS.expected_arrival_hours[2]}
                    unit="hours"
                    icon={<Clock className="h-3.5 w-3.5 text-slate-400" />}
                  />
                </div>
              </Card>

              {/* Card 3: Macroeconomic Market Factors (Collapsible) */}
              <div className="card-executive overflow-hidden">
                <button
                  type="button"
                  aria-expanded={chest}
                  onClick={() => setChest(o => !o)}
                  className="flex w-full items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-4 text-left transition hover:bg-slate-900/90 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-100">Macroeconomic Market Indicators</h2>
                      <p className="text-xs text-slate-400">
                        Bunker futures, commodity price indices, and port congestions (13 parameters)
                      </p>
                    </div>
                  </div>
                  {chest ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {chest && (
                  <div className="grid gap-4 p-6 sm:grid-cols-2 border-t border-slate-800/80 bg-slate-950/40">
                    {MARKET.map(([key, label, min, max, step, unit]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-300">
                          <label htmlFor={key}>{label}</label>
                          <span className="num font-mono text-cyan-400">
                            {f[key].toLocaleString()} <span className="text-[10px] text-slate-500">{unit}</span>
                          </span>
                        </div>
                        <input
                          id={key}
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={f[key]}
                          onChange={e => set(key as NumKey)(Number(e.target.value))}
                          className="w-full h-1.5 rounded-lg bg-slate-900 accent-cyan-400 cursor-pointer"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2 pt-2">
                      <NumberField
                        label="Historical Baseline Freight Rate Reference"
                        value={f.synthetic_rate_reference}
                        onChange={set('synthetic_rate_reference')}
                        min={0}
                        step={0.01}
                        unit="USD / tonne"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-executive flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-4 font-display text-base font-bold text-slate-950 shadow-xl shadow-cyan-950/60 disabled:opacity-50 cursor-pointer"
              >
                <Helm className="h-5 w-5 text-slate-950" />
                DISPATCH VOYAGE SIMULATION &amp; PREDICT CHARTER RATES
              </button>
            </form>
          </div>

          {/* Right Column: Sticky Results View */}
          <div className="sticky top-6">
            <Results data={result} error={error} />
          </div>
        </div>
      </main>

      <LoadingOverlay open={loading} />
    </div>
  );
}
