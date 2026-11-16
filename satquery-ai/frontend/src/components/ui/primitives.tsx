import { useRef, type ReactNode } from "react";

/* ── palette ────────────────────────────────────────────── */
const C = {
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  border:  "rgba(56, 189, 248, 0.18)",
  pos:     "#34d399",
  neg:     "#f87171",
};

export { Card3D, Card3DGroup, FeatureCard, ImageShowcaseCard } from "../Card3D";

/* ── Legacy Card (plain, no effect) ─────────────────────── */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${className}`}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PanelTitle — 3D pop heading
   ════════════════════════════════════════════════════════ */
export function PanelTitle({ children, pop = true }: { children: ReactNode; pop?: boolean }) {
  return (
    <h3
      className={`text-[15px] font-bold mb-3 tracking-wide text-white ${pop ? "pop-heading-sm" : ""}`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </h3>
  );
}

/* ════════════════════════════════════════════════════════
   Badge
   ════════════════════════════════════════════════════════ */
export function Badge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "tertiary" | "positive" | "negative" | "cyan" | "amber" | "teal" | "red" | "blue";
}) {
  const tones: Record<string, string> = {
    primary:   "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    secondary: "bg-slate-800/60 text-slate-300 border-slate-700/60",
    tertiary:  "bg-slate-900/60 text-slate-400 border-slate-800",
    positive:  "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    negative:  "bg-rose-500/15 text-rose-300 border-rose-400/30",
    cyan:      "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    amber:     "bg-amber-500/15 text-amber-300 border-amber-400/30",
    teal:      "bg-teal-500/15 text-teal-300 border-teal-400/30",
    red:       "bg-rose-500/15 text-rose-300 border-rose-400/30",
    blue:      "bg-blue-500/15 text-blue-300 border-blue-400/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${tones[tone] ?? tones.primary}`}>
      {children}
    </span>
  );
}

/* ════════════════════════════════════════════════════════
   PrimaryButton
   ════════════════════════════════════════════════════════ */
export function PrimaryButton({
  children, onClick, className = "", disabled = false, type = "button",
}: {
  children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean; type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`glow-pill-btn focus-ring inline-flex items-center justify-center gap-2 rounded-full
      font-bold px-6 py-2.5 text-[13px] tracking-wide uppercase transition-all
      disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   SecondaryButton
   ════════════════════════════════════════════════════════ */
export function SecondaryButton({
  children, onClick, className = "", disabled = false,
}: {
  children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full
      font-semibold px-5 py-2.5 text-[13px] transition-all disabled:opacity-40
      border border-slate-700/80 bg-slate-900/60 text-slate-200 hover:text-white hover:border-cyan-400/60 hover:bg-cyan-950/30 ${className}`}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   SignalMeter
   ════════════════════════════════════════════════════════ */
export function SignalMeter({ value, segments = 10 }: { value?: number | null; segments?: number }) {
  if (value == null) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-[3px]">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="w-2 h-5 rounded-[1px] border" style={{ borderColor: C.border }} />
          ))}
        </div>
        <span className="data text-xs" style={{ color: C.third }}>n/a</span>
      </div>
    );
  }
  const pct    = Math.round(value * 100);
  const filled = Math.round((pct / 100) * segments);
  const color  = pct >= 80 ? C.pos : pct >= 60 ? C.third : C.neg;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className="w-2 h-5 rounded-[1px] border transition-colors"
               style={i < filled ? { backgroundColor: color, borderColor: color } : { borderColor: "rgba(153,126,103,0.25)" }} />
        ))}
      </div>
      <span className="data text-lg font-medium leading-none" style={{ color }}>{pct}%</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   TelemetryStrip
   ════════════════════════════════════════════════════════ */
export function TelemetryStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-px rounded-[5px] overflow-hidden border w-fit" style={{ borderColor: C.border }}>
      {items.map((item, i) => (
        <div key={i} className="px-3 py-1.5 flex items-center gap-2" style={{ background: "#1A1410" }}>
          <span className="text-[10px] font-mono" style={{ color: C.third }}>{item.label}</span>
          <span className="data text-[11px]" style={{ color: C.second }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Wordmark — satellite orbit mark
   ════════════════════════════════════════════════════════ */
export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="11" rx="9.5" ry="4.2" stroke="#22d3ee" strokeWidth="1.4" transform="rotate(-24 11 11)" />
      <circle cx="11" cy="11" r="2.2" fill="#22d3ee" />
      <circle cx="18.4" cy="6.4" r="1.4" fill="#bae6fd" />
    </svg>
  );
}
