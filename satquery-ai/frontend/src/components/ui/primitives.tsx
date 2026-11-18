import { type ReactNode } from "react";

/* ── Enterprise Geospatial Design Tokens ─────────────────── */
export const GEO_TOKENS = {
  bg: "#0B1118",
  secondary: "#101923",
  surface: "#141F2A",
  elevated: "#192633",
  border: "#273543",
  borderLight: "#36485C",
  text: "#E5EAF0",
  muted: "#9AA8B7",
  subtle: "#718096",
  accent: "#48A9A6",
  accentHover: "#3D9491",
  blue: "#648DB5",
  success: "#6BA88B",
  warning: "#D3A35C",
  error: "#CF7777",
};

export { Card3D, Card3DGroup, FeatureCard, ImageShowcaseCard } from "../Card3D";

/* ── Standard Card ──────────────────────────────────────── */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-[#273543] bg-[#141F2A] p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ── Panel Title ────────────────────────────────────────── */
export function PanelTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  pop?: boolean;
  className?: string;
}) {
  return (
    <h3 className={`text-[14px] font-medium mb-3 tracking-normal text-[#E5EAF0] ${className}`}>
      {children}
    </h3>
  );
}

/* ── Badge ──────────────────────────────────────────────── */
export function Badge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "tertiary" | "positive" | "negative" | "cyan" | "amber" | "teal" | "red" | "blue";
}) {
  const tones: Record<string, string> = {
    primary:   "bg-[#192633] text-[#48A9A6] border-[#273543]",
    secondary: "bg-[#141F2A] text-[#9AA8B7] border-[#273543]",
    tertiary:  "bg-[#101923] text-[#718096] border-[#273543]",
    positive:  "bg-[#141F2A] text-[#6BA88B] border-[#273543]",
    negative:  "bg-[#141F2A] text-[#CF7777] border-[#273543]",
    cyan:      "bg-[#192633] text-[#48A9A6] border-[#273543]",
    teal:      "bg-[#141F2A] text-[#48A9A6] border-[#273543]",
    blue:      "bg-[#141F2A] text-[#648DB5] border-[#273543]",
    amber:     "bg-[#141F2A] text-[#D3A35C] border-[#273543]",
    red:       "bg-[#141F2A] text-[#CF7777] border-[#273543]",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono leading-tight ${tones[tone] ?? tones.primary}`}>
      {children}
    </span>
  );
}

/* ── Primary Button ─────────────────────────────────────── */
export function PrimaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-primary focus-ring ${className}`}
    >
      {children}
    </button>
  );
}

/* ── Secondary Button ───────────────────────────────────── */
export function SecondaryButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`btn-secondary focus-ring ${className}`}
    >
      {children}
    </button>
  );
}

/* ── Signal Meter ───────────────────────────────────────── */
export function SignalMeter({ value, segments = 10 }: { value?: number | null; segments?: number }) {
  if (value == null) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-[2px]">
          {Array.from({ length: segments }).map((_, i) => (
            <div key={i} className="w-1.5 h-3.5 rounded-[1px] border border-[#273543]" />
          ))}
        </div>
        <span className="data text-xs text-[#718096]">n/a</span>
      </div>
    );
  }
  const pct    = Math.round(value * 100);
  const filled = Math.round((pct / 100) * segments);
  const color  = pct >= 80 ? GEO_TOKENS.success : pct >= 60 ? GEO_TOKENS.blue : GEO_TOKENS.warning;
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-[2px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-3.5 rounded-[1px] transition-colors"
            style={i < filled ? { backgroundColor: color } : { backgroundColor: "#192633", borderColor: "#273543" }}
          />
        ))}
      </div>
      <span className="data text-[13px] font-medium leading-none" style={{ color }}>{pct}%</span>
    </div>
  );
}

/* ── Telemetry Strip ────────────────────────────────────── */
export function TelemetryStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-px rounded border border-[#273543] overflow-hidden w-fit bg-[#273543]">
      {items.map((item, i) => (
        <div key={i} className="px-3 py-1.5 flex items-center gap-2 bg-[#101923]">
          <span className="text-[10px] font-mono text-[#718096] uppercase">{item.label}</span>
          <span className="data text-[11px] text-[#E5EAF0]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Wordmark (Geospatial Satellite Orbit Icon) ─────────── */
export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="11" rx="9.5" ry="4.2" stroke="#48A9A6" strokeWidth="1.4" transform="rotate(-24 11 11)" />
      <circle cx="11" cy="11" r="2" fill="#48A9A6" />
      <circle cx="18.4" cy="6.4" r="1.3" fill="#648DB5" />
    </svg>
  );
}
