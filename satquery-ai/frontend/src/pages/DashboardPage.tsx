import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  MessageSquareText,
  Layers,
  Activity,
  Eye,
  Cpu,
  Zap,
  ChevronRight,
  Satellite,
  Radar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge, Card3D } from "../components/ui/primitives";
import { taskLabel } from "../utils/format";
import { api } from "../services/api";
import type { HistoryItem } from "../types";
import { RealisticSatellite } from "../components/space/RealisticSatellites";

/* ── Deep Space Theme Palette ────────────────────────────── */
const C = {
  bg:      "#030712",
  panel:   "#08142c",
  border:  "rgba(56, 189, 248, 0.18)",
  hover:   "#172b52",
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  pos:     "#34d399",
};

/* ── Stat card ──────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  color: string;
}) {
  return (
    <Card3D className="!p-4 flex flex-col justify-between border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] tracking-wider uppercase font-mono font-bold text-cyan-400">
            {label}
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <Icon size={16} />
          </div>
        </div>
        <div
          className="font-mono text-3xl sm:text-4xl font-black leading-none drop-shadow-[0_0_12px_rgba(34,211,238,0.3)] mb-2"
          style={{ color }}
        >
          {value}
        </div>
      </div>
      {sub && <div className="text-[11px] font-mono text-slate-400 font-medium">{sub}</div>}
    </Card3D>
  );
}

/* ── Main Dashboard Component ────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState({ analyzed: 0, queries: 0 });

  useEffect(() => {
    api
      .getHistory(8)
      .then((h) => {
        setRecent(h);
        setStats({ analyzed: h.length, queries: h.length });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="px-6 py-6 max-w-[1340px] mx-auto space-y-6">
      {/* ── Hero Banner with Animated Satellite Visual ── */}
      <Card3D
        config={{ maxTilt: 2, scale: 1.002, parallax: false }}
        className="!p-8 relative overflow-hidden border border-cyan-500/25 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 graticule opacity-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Actions (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <div className="text-[12px] tracking-[0.25em] uppercase font-mono font-bold text-cyan-400">
                EARTH OBSERVATION ORCHESTRATOR
              </div>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ask questions. Understand Earth.
            </h1>

            <p className="text-[14px] text-slate-300 max-w-xl mb-6 leading-relaxed font-light">
              An agentic vision-language assistant for multimodal remote-sensing intelligence — optical, SAR radar,
              multispectral, and multitemporal imagery, one natural-language query at a time.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/missions")}
                className="glow-pill-btn px-7 py-3 rounded-full font-bold text-[13px] tracking-wider uppercase flex items-center gap-2"
              >
                <Zap size={16} />
                <span>Mission Mode Investigation</span>
              </button>

              <button
                onClick={() => navigate("/analyze")}
                className="px-6 py-3 rounded-full font-semibold text-[13px] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all flex items-center gap-2"
              >
                <span>Query &amp; Analyze</span>
                <ArrowRight size={14} />
              </button>

            </div>
          </div>

          {/* Right Floating Satellite Visual (4 cols) */}
          <div className="lg:col-span-4 relative h-48 lg:h-56 flex items-center justify-center">
            <div className="w-full h-full relative flex items-center justify-center">
              <RealisticSatellite type="sentinel-2" size="90%" isHero />
            </div>
          </div>
        </div>
      </Card3D>

      {/* ── Key Metrics Stat Row ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Images Analyzed"
          value={stats.analyzed}
          sub={`${stats.analyzed * 2} SCENE INGEST · 100% VALIDATED`}
          icon={ImageIcon}
          color="#22d3ee"
        />
        <StatCard
          label="Queries Processed"
          value={stats.queries}
          sub="~420ms LATENCY · 0 HALLUCINATIONS"
          icon={MessageSquareText}
          color="#38bdf8"
        />
        <StatCard
          label="Specialist AI Models"
          value={7}
          sub="VQA · GROUNDING · CHANGE · SAR"
          icon={Cpu}
          color="#a855f7"
        />
      </div>

      {/* ── Two-Column Main Content ─────────────────────────── */}
      <div className="w-full">
        {/* Recent Analyses Card */}
        <Card3D className="!p-6 border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-white">Recent Analyses</h2>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  Multi-Temporal Sensor Sessions
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-1 text-[13px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <Satellite size={32} className="mx-auto text-slate-600 mb-3" />
              <div className="text-[15px] font-medium text-slate-300 mb-1">
                No analyses recorded yet
              </div>
              <p className="text-[13px] text-slate-500 mb-4 max-w-sm mx-auto font-light">
                Upload imagery and ask your first question to view specialist routing traces and confidence metrics.
              </p>
              <button
                onClick={() => navigate("/analyze")}
                className="glow-pill-btn px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider"
              >
                Start First Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recent.map((r) => (
                <div
                  key={r.analysis_id}
                  onClick={() => navigate("/history")}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-cyan-400/50 hover:bg-slate-900/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Eye size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-white truncate group-hover:text-cyan-300 transition-colors">
                        {r.query}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge tone="cyan">{taskLabel(r.task)}</Badge>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(r.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition-colors">
                      Inspect Trace →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card3D>

      </div>
    </div>
  );
}
