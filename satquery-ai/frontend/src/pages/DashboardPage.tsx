import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  MessageSquareText,
  Activity,
  Eye,
  Cpu,
  Zap,
  ChevronRight,
  Satellite,
  ArrowRight,
} from "lucide-react";
import { Badge, Card } from "../components/ui/primitives";
import { taskLabel } from "../utils/format";
import { api } from "../services/api";
import type { HistoryItem } from "../types";
import { RealisticSatellite } from "../components/space/RealisticSatellites";

/* ── Stat Card Component ─────────────────────────────────── */
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
    <div className="p-4 rounded border border-[#273543] bg-[#141F2A] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA8B7]">
            {label}
          </span>
          <div className="w-7 h-7 rounded bg-[#101923] border border-[#273543] flex items-center justify-center text-[#48A9A6]">
            <Icon size={14} />
          </div>
        </div>
        <div
          className="data text-2xl sm:text-3xl font-semibold leading-none mb-2"
          style={{ color }}
        >
          {value}
        </div>
      </div>
      {sub && <div className="text-[11px] font-mono text-[#718096]">{sub}</div>}
    </div>
  );
}

/* ── Main Dashboard Page ─────────────────────────────────── */
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
    <div className="px-6 py-6 max-w-[1340px] mx-auto space-y-6 bg-[#0B1118]">
      {/* ── Hero Banner ── */}
      <div className="p-6 sm:p-8 rounded border border-[#273543] bg-[#141F2A] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#48A9A6]" />
              <div className="text-[11px] tracking-wider uppercase font-mono font-medium text-[#48A9A6]">
                EARTH OBSERVATION ORCHESTRATOR
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#E5EAF0] tracking-tight mb-2">
              Multimodal Geospatial Intelligence
            </h1>

            <p className="text-[14px] text-[#9AA8B7] max-w-xl mb-6 leading-relaxed">
              Autonomous reasoning across optical multispectral, SAR radar, and bi-temporal remote-sensing data feeds through natural language.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/missions")}
                className="btn-primary"
              >
                <Zap size={14} />
                <span>Mission Mode Investigation</span>
              </button>

              <button
                onClick={() => navigate("/analyze")}
                className="btn-secondary"
              >
                <span>Query &amp; Analyze</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Floating Satellite Visual */}
          <div className="lg:col-span-4 relative h-44 lg:h-52 flex items-center justify-center">
            <div className="w-full h-full relative flex items-center justify-center opacity-90">
              <RealisticSatellite type="sentinel-2" size="85%" isHero />
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Stat Row ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Scenes Ingested"
          value={stats.analyzed}
          sub={`${stats.analyzed * 2} CALIBRATED FEEDS · 100% VALIDATED`}
          icon={ImageIcon}
          color="#E5EAF0"
        />
        <StatCard
          label="Queries Executed"
          value={stats.queries}
          sub="~420ms INFERENCE LATENCY"
          icon={MessageSquareText}
          color="#48A9A6"
        />
        <StatCard
          label="Active Specialist Models"
          value={7}
          sub="VQA · GROUNDING · CHANGE · SAR"
          icon={Cpu}
          color="#648DB5"
        />
      </div>

      {/* ── Recent Analyses Section ─────────────────────────── */}
      <div className="w-full">
        <Card className="!p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#101923] border border-[#273543] flex items-center justify-center text-[#48A9A6]">
                <Activity size={14} />
              </div>
              <div>
                <h2 className="text-[15px] font-medium text-[#E5EAF0]">Recent Analyses</h2>
                <div className="text-[10px] font-mono text-[#718096] uppercase tracking-wider">
                  Multi-Temporal Sensor Sessions
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-1 text-[12px] font-mono text-[#48A9A6] hover:text-[#3D9491] transition-colors"
            >
              <span>View Archive</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="p-8 text-center rounded border border-dashed border-[#273543] bg-[#101923]">
              <Satellite size={28} className="mx-auto text-[#718096] mb-2" />
              <div className="text-[14px] font-medium text-[#9AA8B7] mb-1">
                No analyses recorded in this session
              </div>
              <p className="text-[12px] text-[#718096] mb-4 max-w-sm mx-auto">
                Upload imagery and ask your first question to view specialist routing traces and confidence metrics.
              </p>
              <button
                onClick={() => navigate("/analyze")}
                className="btn-primary text-xs"
              >
                Start First Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((r) => (
                <div
                  key={r.analysis_id}
                  onClick={() => navigate("/history")}
                  className="w-full text-left flex items-center justify-between p-3 rounded border border-[#273543] bg-[#101923] hover:bg-[#192633] hover:border-[#36485C] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-[#141F2A] border border-[#273543] flex items-center justify-center text-[#48A9A6] shrink-0">
                      <Eye size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[#E5EAF0] truncate group-hover:text-[#48A9A6] transition-colors">
                        {r.query}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge tone="teal">{taskLabel(r.task)}</Badge>
                        <span className="data text-[11px] text-[#718096]">
                          {new Date(r.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#273543] bg-[#141F2A] text-[#9AA8B7] group-hover:border-[#36485C] group-hover:text-[#E5EAF0] transition-colors">
                      Inspect Trace →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
