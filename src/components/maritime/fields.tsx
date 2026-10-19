import { useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown, Search, Navigation } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VesselMorph } from './visuals';

const FLAGS: Record<string, string> = {
  Australia: '🇦🇺',
  Indonesia: '🇮🇩',
  'South Africa': '🇿🇦',
  Mozambique: '🇲🇿',
  'United States': '🇺🇸',
  'United Arab Emirates': '🇦🇪',
  India: '🇮🇳'
};

export function Card({
  icon,
  title,
  badge,
  children,
  subtitle
}: {
  icon: ReactNode;
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  subtitle?: string;
  anchorKey?: string | number;
  tone?: string;
}) {
  return (
    <section className="card-executive relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {badge}
      </div>
      <div className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export const inputClass =
  'num h-11 w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 text-sm font-semibold text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 placeholder:text-slate-500 shadow-inner';
export const labelClass = 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300';

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  icon,
  pip
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: ReactNode;
  pip?: string;
}) {
  const id = label.replaceAll(' ', '-').toLowerCase();
  return (
    <div className="space-y-1.5" data-pip={pip}>
      <label htmlFor={id} className={labelClass}>
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          required
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          className={`${inputClass} ${unit ? 'pr-20' : ''}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-3 text-xs font-mono font-semibold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function BoatSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  readout,
  icon,
  onSlidingActive
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  readout: ReactNode;
  icon?: ReactNode;
  pip?: string;
  onSlidingActive?: (active: boolean) => void;
}) {
  const [isSliding, setIsSliding] = useState(false);
  const [dir, setDir] = useState<number>(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const change = (v: number) => {
    setDir(v > value ? 1 : v < value ? -1 : 0);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDir(0), 400);
    onChange(v);
  };

  const handlePointerDown = () => {
    setIsSliding(true);
    onSlidingActive?.(true);
  };

  const handlePointerUp = () => {
    setIsSliding(false);
    onSlidingActive?.(false);
  };

  return (
    <div className="space-y-2 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <span className={labelClass}>
          {icon}
          {label}
        </span>
        <span className="num rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-bold text-cyan-300">
          {readout}
        </span>
      </div>
      <div className="relative h-14 pt-4">
        {/* Track */}
        <div className="absolute inset-x-0 top-6 h-2 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.6)]"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Dynamic Handle: Transforms from precision dial into sleek vessel when sliding */}
        <div
          className="pointer-events-none absolute top-1.5 -translate-x-1/2 transition-all duration-150"
          style={{ left: `${pct}%` }}
        >
          {isSliding ? (
            <VesselMorph dir={dir} className="scale-90" />
          ) : (
            <div className="group relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-900 shadow-[0_0_12px_rgba(0,229,255,0.6)] transition-transform hover:scale-110">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse" />
            </div>
          )}
        </div>

        {/* Native Range Slider */}
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onChange={e => change(Number(e.target.value))}
          className="absolute inset-x-0 top-2 h-10 w-full cursor-pointer opacity-0"
        />
      </div>
      <div className="num flex justify-between text-[11px] font-mono text-slate-500">
        <span>MIN: {min.toLocaleString()}</span>
        <span>MAX: {max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function PortField({
  label,
  value,
  onChange,
  ports
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ports: { id: string; name: string; country: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = ports.find(p => p.id === value);
  const list = ports.filter(p =>
    `${p.name} ${p.country} ${p.id}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      <span className={labelClass}>
        <Navigation className="h-3.5 w-3.5 text-cyan-400" />
        {label}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-label={label}
            aria-expanded={open}
            className={`${inputClass} flex items-center justify-between gap-2 text-left cursor-pointer hover:border-slate-600`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-base">{FLAGS[selected?.country ?? '']}</span>
              <span className="truncate font-semibold text-slate-100">{selected?.name}</span>
              <span className="num rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400">
                {selected?.id}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80 rounded-xl border border-slate-700 bg-slate-900/95 p-0 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-slate-800 p-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              aria-label={`Search ${label}`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search port or country..."
              className="w-full bg-transparent text-xs font-semibold text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="max-h-60 overflow-auto p-1.5">
            {list.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                  setQuery('');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-cyan-950/40 transition-colors"
              >
                <Check
                  className={`h-3.5 w-3.5 shrink-0 ${p.id === value ? 'text-cyan-400' : 'opacity-0'}`}
                />
                <span className="text-sm">{FLAGS[p.country]}</span>
                <span className="flex-1 truncate">
                  <span className="block text-xs font-semibold text-slate-200">{p.name}</span>
                  <span className="text-[10px] text-slate-400">{p.country}</span>
                </span>
                <span className="num text-[10px] font-mono font-bold text-cyan-400">{p.id}</span>
              </button>
            ))}
            {!list.length && <p className="p-3 text-center text-xs text-slate-400">No ports found</p>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
