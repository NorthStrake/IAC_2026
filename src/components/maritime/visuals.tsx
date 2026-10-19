import { useEffect, useState, type CSSProperties } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Anchor, Compass, Radio, Shield, Waves as WavesIcon } from 'lucide-react';

type C = { className?: string };

/* ---------- Executive Naval Tactical Commander ("Commander Vance") ---------- */
export function CommanderOfficer({ className = '', status = 'standby' }: { className?: string; status?: 'standby' | 'active' | 'salute' | 'analyzing' }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-xl" aria-hidden>
        <defs>
          <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#0B1320" />
          </linearGradient>
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="visorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="hologramPing" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Commander Radar Halo */}
        <circle cx="60" cy="55" r="48" fill="url(#hologramPing)" className="animate-sonar-ping" />
        <circle cx="60" cy="55" r="42" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />

        {/* Shoulders & Tactical Jacket */}
        <path d="M22 120 C22 96, 36 84, 60 84 C84 84, 98 96, 98 120 Z" fill="url(#uniformGrad)" stroke="#334155" strokeWidth="1.5" />
        {/* Collar & Gold Epaulettes */}
        <path d="M42 84 L60 102 L78 84" fill="none" stroke="url(#goldTrim)" strokeWidth="2.5" />
        <rect x="23" y="90" width="16" height="5" rx="2" fill="url(#goldTrim)" />
        <rect x="81" y="90" width="16" height="5" rx="2" fill="url(#goldTrim)" />

        {/* Neck */}
        <path d="M50 72 h20 v16 h-20 z" fill="#F8FAFC" opacity="0.9" />

        {/* Head & Facial Profile */}
        <path d="M43 40 C43 32, 77 32, 77 40 C77 58, 68 74, 60 74 C52 74, 43 58, 43 40 Z" fill="#FDE047" opacity="0.15" />
        <path d="M44 42 C44 34, 76 34, 76 42 C76 56, 68 70, 60 70 C52 70, 44 56, 44 42 Z" fill="#E2E8F0" />
        {/* Sharp Hair / Sideburns */}
        <path d="M42 42 C42 36, 48 30, 60 30 C72 30, 78 36, 78 42 L76 52 C74 46, 70 42, 60 42 C50 42, 46 46, 44 52 Z" fill="#334155" />

        {/* Holographic Tactical Visor / Comm-Link */}
        <path d="M44 46 Q60 50 76 46" stroke="url(#visorGlow)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="75" cy="48" r="3" fill="#00E5FF" className="animate-pulse" />
        <path d="M75 48 Q82 52 80 62" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="1 2" />

        {/* Officer's Visor Peaked Cap */}
        {/* Cap Body */}
        <path d="M34 32 C34 18, 86 18, 86 32 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        {/* Cap Band with Gold Oak Leaves */}
        <path d="M32 30 H88 V36 H32 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
        <line x1="33" y1="33" x2="87" y2="33" stroke="url(#goldTrim)" strokeWidth="2.5" />
        {/* Naval Anchor Insignia */}
        <circle cx="60" cy="25" r="5" fill="url(#goldTrim)" />
        <path d="M58 24 L62 24 M60 22 L60 28 M57 27 Q60 30 63 27" stroke="#0F172A" strokeWidth="1" fill="none" />
        {/* Visor Peak (Patent Leather Brim) */}
        <path d="M30 35 C38 42, 82 42, 90 35 C82 38, 38 38, 30 35 Z" fill="#020617" stroke="#1E293B" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ---------- The Morphed Tactical Vessel (Used during slider drag) ---------- */
export function VesselMorph({ dir = 0, className = '' }: { dir?: number; className?: string }) {
  return (
    <div className={`relative transition-transform duration-200 ${dir > 0 ? 'rotate-3 scale-105' : dir < 0 ? '-rotate-3 scale-105' : ''} ${className}`}>
      <svg viewBox="0 0 90 48" className="w-20 h-11 drop-shadow-[0_4px_12px_rgba(0,229,255,0.4)]" aria-hidden>
        <defs>
          <linearGradient id="vesselHull" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="40%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="neonWake" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Churning Hydrodynamic Wake */}
        <path d="M4 38 Q25 42 50 38 Q75 42 88 38" fill="none" stroke="url(#neonWake)" strokeWidth="2.5" className="animate-pulse" />
        <path d="M10 41 Q30 44 65 41" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />

        {/* Sleek Modern Hull */}
        <path d="M12 24 L76 24 L86 34 L72 38 L16 38 L10 32 Z" fill="url(#vesselHull)" stroke="#38BDF8" strokeWidth="1.5" />
        
        {/* Bridge Superstructure */}
        <rect x="22" y="14" width="14" height="10" rx="2" fill="#1E293B" stroke="#00E5FF" strokeWidth="1" />
        <rect x="24" y="16" width="10" height="3" rx="1" fill="#00E5FF" opacity="0.9" />

        {/* Cargo Container Stacks / Hold Section */}
        <rect x="40" y="18" width="10" height="6" rx="1" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.8" />
        <rect x="52" y="18" width="10" height="6" rx="1" fill="#0369A1" stroke="#38BDF8" strokeWidth="0.8" />
        <rect x="64" y="18" width="10" height="6" rx="1" fill="#F59E0B" stroke="#FDE68A" strokeWidth="0.8" />

        {/* Radar Mast & Sonar Ping */}
        <line x1="26" y1="14" x2="26" y2="8" stroke="#38BDF8" strokeWidth="1.5" />
        <circle cx="26" cy="8" r="1.5" fill="#00E5FF" className="animate-ping" />
      </svg>
    </div>
  );
}

/* ---------- Executive Ocean Telemetry Background ---------- */
export function OceanBackground() {
  return (
    <div className="ocean-telemetry pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Bathymetric depth contour lines */}
      <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="telemetryGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="2 6" />
            <circle cx="80" cy="80" r="1" fill="#00E5FF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#telemetryGrid)" />
      </svg>

      {/* Lat/Lon Telemetry Overlay Labels */}
      <div className="num absolute left-8 top-28 text-[11px] font-mono tracking-widest text-cyan-500/20">
        LAT: 32°55'18"S &nbsp; LON: 151°46'54"E &nbsp; // SECTOR_07
      </div>
      <div className="num absolute right-8 top-44 text-[11px] font-mono tracking-widest text-cyan-500/20">
        DEST: 20°15'32"N &nbsp; LON: 86°40'28"E &nbsp; // CORRIDOR_ALPHA
      </div>

      {/* Horizon Horizon Cargo Vessel Silhouettes */}
      <div className="animate-wave-slow absolute bottom-28 left-0 flex w-[200%] items-center justify-around opacity-15">
        <svg viewBox="0 0 160 30" className="h-6 w-36 fill-slate-400">
          <path d="M10 20 L140 20 L150 28 L15 28 Z" />
          <rect x="25" y="10" width="18" height="10" rx="1" />
          <rect x="50" y="14" width="22" height="6" />
          <rect x="76" y="14" width="22" height="6" />
          <circle cx="26" cy="9" r="1.5" className="fill-emerald-400" />
        </svg>
        <svg viewBox="0 0 120 25" className="h-5 w-28 fill-slate-400">
          <path d="M5 16 L105 16 L115 24 L10 24 Z" />
          <rect x="18" y="8" width="14" height="8" rx="1" />
          <rect x="40" y="12" width="30" height="4" />
          <circle cx="114" cy="18" r="1.5" className="fill-rose-500" />
        </svg>
      </div>

      {/* Dual Hydrodynamic Ambient Wave Layers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="animate-wave-slow absolute bottom-0 h-full w-[200%] opacity-20">
          <path d="M0 30 Q75 10 150 30 T300 30 T450 30 T600 30 T750 30 T900 30 T1050 30 T1200 30 V60 H0 Z" fill="#0284C7" />
        </svg>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="animate-wave-slow absolute bottom-0 h-4/5 w-[200%] opacity-25" style={{ animationDirection: 'reverse', animationDuration: '22s' }}>
          <path d="M0 32 Q75 14 150 32 T300 32 T450 32 T600 32 T750 32 T900 32 T1050 32 T1200 32 V60 H0 Z" fill="#06B6D4" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- Precision Hold Capacity Visualizer ---------- */
export function HoldVisualizer({ quantity, max }: { quantity: number; max: number }) {
  const pct = Math.min(100, Math.max(5, Math.round((quantity / max) * 100)));
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-cyan-400" />
          Vessel Cargo Hold Volumetric Capacity
        </span>
        <span className="num font-bold text-cyan-400">{pct}% LOAD FACTOR</span>
      </div>
      <div className="relative h-6 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950 p-0.5">
        <div
          className="h-full rounded-md bg-gradient-to-r from-cyan-600 via-sky-500 to-amber-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
        {/* Structural Ribs */}
        <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-40">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-full w-px bg-slate-400" />
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-mono">
        <span>0 MT (BALLAST)</span>
        <span>LOADED: {quantity.toLocaleString()} MT</span>
        <span>MAX: {max.toLocaleString()} MT</span>
      </div>
    </div>
  );
}

/* ---------- Premium Cargo Icons ---------- */
export function CoalIcon({ className = '' }: C) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="coalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>
      </defs>
      <path d="M12 28 L20 12 L34 8 L42 20 L38 38 L22 42 Z" fill="url(#coalGrad)" stroke="#64748B" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 12 L28 26 L42 20 M28 26 L22 42 M28 26 L38 38" fill="none" stroke="#334155" strokeWidth="1.2" />
      <circle cx="16" cy="18" r="1.5" fill="#38BDF8" opacity="0.6" />
    </svg>
  );
}

export function OreIcon({ className = '' }: C) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="oreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="60%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>
      </defs>
      <path d="M10 36 L18 16 L28 12 L38 22 L40 38 L24 42 Z" fill="url(#oreGrad)" stroke="#EF4444" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 16 L28 30 L40 38 M28 30 L24 42 M28 12 L28 30" fill="none" stroke="#F87171" strokeWidth="1" />
      <polygon points="18,20 22,18 20,24" fill="#FCA5A5" opacity="0.7" />
    </svg>
  );
}

export function WheatIcon({ className = '' }: C) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 42 V10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      {[14, 20, 26, 32].map((y, i) => (
        <g key={y}>
          <ellipse cx="19" cy={y} rx="4" ry="2.5" transform={`rotate(-30 19 ${y})`} fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
          <ellipse cx="29" cy={y} rx="4" ry="2.5" transform={`rotate(30 29 ${y})`} fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
        </g>
      ))}
      <ellipse cx="24" cy="8" rx="2.5" ry="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    </svg>
  );
}

export function BauxiteIcon({ className = '' }: C) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <polygon points="8,32 18,14 34,10 42,26 34,42 16,40" fill="#EA580C" stroke="#FB923C" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="18,14 26,26 34,10" fill="#C2410C" stroke="#FDBA74" strokeWidth="1" />
      <polygon points="26,26 42,26 34,42" fill="#9A3412" stroke="#FDBA74" strokeWidth="1" />
    </svg>
  );
}

/* ---------- Propeller & Tactical Helm ---------- */
export function Propeller({ speed }: { speed: number }) {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-cyan-400" aria-hidden>
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <g className="animate-spin-var" style={{ ['--dur' as string]: `${Math.max(0.4, (22 - speed) / 10)}s` } as CSSProperties}>
        {[0, 120, 240].map(r => (
          <ellipse key={r} cx="16" cy="9" rx="3.5" ry="6" transform={`rotate(${r} 16 16)`} fill="currentColor" opacity="0.8" />
        ))}
      </g>
    </svg>
  );
}

export function Helm({ className = '' }: C) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      {[0, 45, 90, 135].map(r => (
        <line key={r} x1="16" y1="2" x2="16" y2="30" transform={`rotate(${r} 16 16)`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* ---------- High-Tech Loading & Simulation Overlay ---------- */
const SIM_TELEMETRY = [
  'Establishing Satellite AIS Link // Sector 07...',
  'Evaluating Dynamic Port Draft & Physical Clearances...',
  'Polling Baltic Dry Index & Bunker Fuel Futures...',
  'Executing Multi-Horizon XGBoost Regressors (Months +1 to +4)...',
  'Optimizing Fleet Repositioning & Demurrage Matrix...',
  'Synthesizing Executive Voyage Forecast...'
];

export function LoadingOverlay({ open }: { open: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!open) return;
    setStep(0);
    const t = setInterval(() => setStep(s => (s + 1) % SIM_TELEMETRY.length), 1100);
    return () => clearInterval(t);
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} onEscapeKeyDown={e => e.preventDefault()} onPointerDownOutside={e => e.preventDefault()} className="card-executive max-w-lg border-cyan-500/40 p-0 overflow-hidden shadow-2xl shadow-cyan-950/80">
        <DialogTitle className="sr-only">Maritime Inference Simulation</DialogTitle>
        <DialogDescription className="sr-only">Evaluating forward freight rate model.</DialogDescription>
        
        {/* Radar & Sailing Ship Header */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-b from-[#081220] via-[#0B1A2E] to-[#0E223D]">
          {/* Circular Radar Sweep */}
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20">
            <div className="absolute inset-4 rounded-full border border-cyan-500/15" />
            <div className="absolute inset-12 rounded-full border border-cyan-500/10" />
            <div className="h-full w-full animate-radar-sweep rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent" />
          </div>

          {/* Animated Vessel Cutting Through Waves */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <VesselMorph dir={1} className="scale-125" />
          </div>

          {/* Hydrodynamic Wave Swell */}
          <div className="absolute inset-x-0 bottom-0 h-16">
            <svg viewBox="0 0 800 40" preserveAspectRatio="none" className="h-full w-full fill-cyan-950/60 animate-wave-slow">
              <path d="M0 20 Q100 5 200 20 T400 20 T600 20 T800 20 V40 H0 Z" />
            </svg>
          </div>
        </div>

        {/* Live Simulation Telemetry Terminal */}
        <div className="border-t border-slate-800 bg-slate-950/80 p-5 font-mono">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              LIVE TELEMETRY FEED
            </span>
            <span className="num text-[11px] text-slate-500">2026.IAC.AI</span>
          </div>
          <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs font-semibold text-cyan-300 transition-all flex items-center">
            &gt; {SIM_TELEMETRY[step]}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
