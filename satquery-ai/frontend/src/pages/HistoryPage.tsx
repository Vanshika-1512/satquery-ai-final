import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2, Download, Eye, Sparkles, Loader2, Filter,
  Compass, ArrowRight, Clock, Shield, HardDrive,
} from "lucide-react";
import { Badge, PrimaryButton } from "../components/ui/primitives";
import ResultsPanel from "../components/ResultsPanel";
import { api } from "../services/api";
import { taskLabel } from "../utils/format";
import type { AnalyzeResponse, HistoryItem, MissionSummaryItem } from "../types";

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
  neg:     "#f87171",
};

/* ── Execution trace viz ─────────────────────────────────── */
function TraceHeader({ item }: { item: HistoryItem }) {
  const steps = [
    { n: "STEP 01", label: "Agent Workflow",    sub: "Change Detection att." },
    { n: "STEP 02", label: "Spatial Alignment", sub: "Description Pts. 29°" },
    { n: "STEP 03", label: "Multimodal Model",  sub: "Change VGG-40-5" },
  ];
  return (
    <div className="mb-4">
      <div
        className="text-[11px] font-mono uppercase tracking-widest mb-3 font-bold flex items-center gap-2"
        style={{ color: C.primary }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.primary }} />
        Execution Trace Pipeline
      </div>
      <div className="flex gap-2 mb-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex-1 rounded-lg border p-3"
            style={{ background: `${C.panel}80`, borderColor: C.border }}
          >
            <div className="text-[9px] font-mono mb-0.5 font-bold" style={{ color: C.third }}>{s.n}</div>
            <div className="text-[13px] font-extrabold" style={{ color: C.text }}>{s.label}</div>
            <div className="text-[11px]" style={{ color: C.second }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2 font-medium"
        style={{ color: C.second }}
      >
        <span>Temporal Pair (T1 vs T2) &amp; Differential Metric</span>
        <span style={{ color: C.primary }}>Δ Matrix: +15.4% Alteration</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "PRE-EVENT BASELINE",  sub: "T1 (Reference)", val: "0.12 DN",      color: C.second  },
          { label: "CURRENT ACQUISITION", sub: "T2 (Target)",    val: "0.86 DN",      color: C.primary },
          { label: "CHANGE HEATMAP",      sub: "Differential",   val: "+15.4% SHIFT", color: C.neg     },
        ].map((cell, i) => (
          <div
            key={i}
            className="rounded-lg border p-2.5 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: i === 2
                ? `linear-gradient(135deg, ${C.panel} 0%, #1a0a0a 100%)`
                : `linear-gradient(135deg, ${C.panel} 0%, #0a142c 100%)`,
              borderColor: i === 2 ? `${C.neg}40` : C.border,
              height: 72,
            }}
          >
            <div className="absolute inset-0 graticule opacity-20 pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono uppercase tracking-wider font-bold" style={{ color: cell.color }}>
                {cell.label}
              </span>
              <span className="text-[9px] font-mono font-bold" style={{ color: cell.color }}>{cell.val}</span>
            </div>
            <div className="mt-auto flex items-center justify-between text-[10px] font-mono">
              <span style={{ color: C.third }}>{cell.sub}</span>
              <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: i === 0 ? "25%" : i === 1 ? "85%" : "65%", backgroundColor: cell.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function HistoryPage() {
  const navigate = useNavigate();
  const [tab,          setTab]          = useState<"analyses" | "missions">("analyses");
  const [items,        setItems]        = useState<HistoryItem[]>([]);
  const [missions,     setMissions]     = useState<MissionSummaryItem[]>([]);
  const [selected,     setSelected]     = useState<AnalyzeResponse | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [summaryCount, setSummaryCount] = useState(5);
  const [summary,      setSummary]      = useState<string | null>(null);
  const [summarizing,  setSummarizing]  = useState(false);
  const [filter,       setFilter]       = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([
      api.getHistory(100).catch(() => []),
      api.getMissions(100).catch(() => []),
    ]).then(([hist, msn]) => {
      setItems(hist);
      setMissions(msn);
    }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openItem = async (it: HistoryItem) => {
    setSelectedItem(it);
    const res = await api.getHistoryItem(it.analysis_id);
    setSelected(res);
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.deleteHistoryItem(id);
    load();
    if (selected?.analysis_id === id) { setSelected(null); setSelectedItem(null); }
  };

  const deleteMission = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.deleteMission(id);
    load();
  };

  const handleSummarize = async () => {
    setSummarizing(true); setSummary(null);
    try {
      const res = await api.summarizeHistory(summaryCount);
      setSummary(res.summary);
    } catch (e: any) {
      setSummary(e.message || "Could not generate summary.");
    } finally {
      setSummarizing(false);
    }
  };

  const filtered = filter
    ? items.filter((i) => i.query.toLowerCase().includes(filter.toLowerCase()))
    : items;

  const filteredMissions = filter
    ? missions.filter((m) =>
        m.objective.toLowerCase().includes(filter.toLowerCase()) ||
        m.mission_title.toLowerCase().includes(filter.toLowerCase())
      )
    : missions;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ── Page Header ─────────────────────────────────────── */}
      <div
        className="border-b px-6 py-5"
        style={{ borderColor: C.border, background: `${C.panel}80` }}
      >
        <div className="flex items-start justify-between max-w-[1280px] mx-auto">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: C.third }}>
              Agent Registry // LEO-443 Archive
            </div>
            <h1
              className="text-[28px] font-black pop-heading"
              style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}
            >
              History
            </h1>
            <p className="text-[12px] mt-1" style={{ color: C.third }}>
              All past analyses and autonomous missions are persisted locally, cryptographic-signed, and fully auditable.
            </p>
          </div>

          {/* Telemetry strip */}
          <div className="flex items-center gap-6 text-[10px] font-mono">
            {[
              { icon: HardDrive, label: "STORAGE",   val: "1.04 GB"  },
              { icon: Shield,    label: "INTEGRITY",  val: "SHA-256 ✓" },
              { icon: Clock,     label: "CHAIN",      val: "LOCAL"    },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="text-right">
                <div className="flex items-center gap-1 justify-end mb-0.5" style={{ color: C.third }}>
                  <Icon size={10} />
                  <span className="uppercase tracking-wider">{label}</span>
                </div>
                <div style={{ color: C.pos }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 max-w-[1280px] mx-auto">

        {/* ── Tab Switcher ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-5 border-b pb-3" style={{ borderColor: C.border }}>
          {[
            { key: "analyses", label: "⚡ Standard Analyses",         count: items.length    },
            { key: "missions", label: "🛰️ Mission Investigations",   count: missions.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className="text-[12px] font-mono px-4 py-2 rounded-lg transition-all flex items-center gap-2 border"
              style={
                tab === key
                  ? { background: C.primary, color: "#0a0f1e", borderColor: C.primary, fontWeight: 700 }
                  : { background: "transparent", color: C.second, borderColor: C.border }
              }
            >
              {label} ({count})
            </button>
          ))}

          {/* Filter input */}
          <div className="relative ml-auto">
            <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.third }} />
            <input
              placeholder="Filter…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-[12px] rounded-lg border outline-none font-mono"
              style={{ background: C.panel, color: C.text, borderColor: C.border, width: 160 }}
            />
          </div>
        </div>

        {/* ── Missions tab ─────────────────────────────────────── */}
        {tab === "missions" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-mono" style={{ color: C.third }}>
                Stored Earth-Observation Autonomous Investigations
              </div>
              <PrimaryButton onClick={() => navigate("/missions")}>
                <Compass size={14} /> 🛰️ Start New Mission
              </PrimaryButton>
            </div>

            {loading ? (
              <div className="text-[12px] font-mono py-8 text-center" style={{ color: C.third }}>
                Loading missions…
              </div>
            ) : filteredMissions.length === 0 ? (
              <div
                className="p-10 text-center rounded-2xl border space-y-3"
                style={{ background: `${C.panel}80`, borderColor: C.border }}
              >
                <Compass size={28} className="mx-auto" style={{ color: C.third }} />
                <div className="text-[15px] font-bold" style={{ color: C.text }}>
                  No Mission Investigations Yet
                </div>
                <p className="text-[12px] font-mono max-w-md mx-auto" style={{ color: C.third }}>
                  Turn a high-level Earth-observation objective into an autonomous investigation in Mission Mode.
                </p>
                <PrimaryButton onClick={() => navigate("/missions")} className="mx-auto">
                  Launch First Mission
                </PrimaryButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMissions.map((msn) => (
                  <div
                    key={msn.mission_id}
                    className="p-4 rounded-2xl border backdrop-blur-sm transition-all group hover:border-cyan-400/40"
                    style={{ background: `${C.panel}90`, borderColor: C.border }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded border font-bold"
                            style={{ background: `${C.primary}10`, borderColor: `${C.primary}30`, color: C.primary }}
                          >
                            🛰️ {msn.mission_id.toUpperCase()}
                          </span>
                          <span
                            className="text-[11px] font-mono uppercase font-bold"
                            style={{ color: C.pos }}
                          >
                            ✓ {msn.status}
                          </span>
                        </div>
                        <div
                          className="text-[14px] font-mono font-bold truncate transition-colors group-hover:text-cyan-300"
                          style={{ color: C.text }}
                        >
                          "{msn.objective}"
                        </div>
                        <div className="text-[11px] font-mono" style={{ color: C.third }}>
                          Type: {msn.mission_title} • Changed Area: {msn.changed_area_km2.toFixed(2)} km²
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteMission(msn.mission_id, e)}
                        className="transition-colors p-1"
                        style={{ color: C.third }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.neg; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.third; }}
                        title="Delete Mission"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div
                      className="flex items-center justify-between pt-2 border-t text-[11px] font-mono"
                      style={{ borderColor: C.border }}
                    >
                      <span style={{ color: C.third }}>
                        {new Date(msn.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/missions?id=${msn.mission_id}`)}
                        className="flex items-center gap-1 font-bold hover:underline"
                        style={{ color: C.primary }}
                      >
                        View Mission <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Standard Analyses tab ─────────────────────────── */
          <div className="space-y-4">

            {/* Summarize panel */}
            <div
              className="rounded-2xl border p-4"
              style={{ background: `${C.panel}80`, borderColor: C.border }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <Sparkles size={13} style={{ color: C.primary }} />
                <span className="text-[12px]" style={{ color: C.second }}>Summarize my last</span>
                <input
                  type="number" min={1} max={50} value={summaryCount}
                  onChange={(e) => setSummaryCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 rounded-lg px-2 py-1 text-sm text-center border outline-none font-mono"
                  style={{ background: C.bg, color: C.text, borderColor: C.border }}
                />
                <span className="text-[12px]" style={{ color: C.second }}>agentic geospatial analyses</span>
                <span className="text-[10px] font-mono italic" style={{ color: C.third }}>
                  (geospatial-temporal shifts, variance + KIM outputs)
                </span>
                <PrimaryButton onClick={handleSummarize} disabled={summarizing} className="ml-auto">
                  {summarizing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {summarizing ? "Synthesizing…" : "Generate Summary"}
                </PrimaryButton>
              </div>
              {summary && (
                <p
                  className="text-[12px] leading-relaxed mt-4 pt-4 border-t"
                  style={{ color: C.text, borderColor: C.border }}
                >
                  {summary}
                </p>
              )}
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-[1fr_1.3fr] gap-5 items-start">

              {/* Left — list */}
              <div
                className="rounded-2xl border p-4"
                style={{ background: `${C.panel}80`, borderColor: C.border }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[16px] font-black" style={{ color: C.text }}>
                    Analyses ({items.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="text-[12px] font-mono py-4" style={{ color: C.third }}>Loading…</div>
                ) : filtered.length === 0 ? (
                  <div className="text-[12px] font-mono py-4" style={{ color: C.third }}>No history yet.</div>
                ) : (
                  <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                    {filtered.map((it) => {
                      const active = selectedItem?.analysis_id === it.analysis_id;
                      return (
                        <button
                          key={it.analysis_id}
                          onClick={() => openItem(it)}
                          className="w-full text-left rounded-xl border p-3 transition-all"
                          style={{
                            borderColor: active ? `${C.primary}50` : C.border,
                            background:  active ? `${C.primary}08` : `${C.panel}60`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div
                                className="text-[14px] font-medium truncate mb-1.5"
                                style={{ color: C.text }}
                              >
                                {it.query}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge tone="cyan">{taskLabel(it.task)}</Badge>
                                <Badge tone="blue">SENTINEL-4L</Badge>
                                <span className="text-[11px] font-mono" style={{ color: C.third }}>
                                  {new Date(it.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => deleteItem(it.analysis_id, e)}
                              className="transition-colors p-1 shrink-0"
                              style={{ color: C.third }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.neg; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.third; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: C.border }}>
                    <button
                      className="text-[10px] font-mono flex items-center gap-1 transition-colors"
                      style={{ color: C.third }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.second; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.third; }}
                    >
                      <Download size={10} /> Sync to blockchain
                    </button>
                  </div>
                )}
              </div>

              {/* Right — trace / result */}
              <div>
                {selected && selectedItem ? (
                  <div
                    className="rounded-2xl border p-5"
                    style={{ background: `${C.panel}80`, borderColor: C.border }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div
                          className="text-[11px] font-mono uppercase tracking-wider mb-1 font-medium"
                          style={{ color: C.third }}
                        >
                          Agent Inspection Mode — TRACE-T90-SH21
                        </div>
                        <h3 className="text-[20px] font-black" style={{ color: C.text }}>
                          {selectedItem.query.slice(0, 40)}{selectedItem.query.length > 40 ? "…" : ""}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: C.pos }} />
                          <span style={{ color: C.pos }}>COMPLETED</span>
                        </div>
                      </div>
                    </div>

                    <TraceHeader item={selectedItem} />

                    <div className="border-t pt-4" style={{ borderColor: C.border }}>
                      <div
                        className="text-[13px] font-mono uppercase tracking-wider mb-2 font-bold flex items-center gap-2"
                        style={{ color: C.primary }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.primary }} />
                        Synoptic &amp; Agent Reasoning
                      </div>
                      <div
                        className="text-[13px] leading-relaxed mb-3 italic rounded-lg p-3.5"
                        style={{ color: C.second, background: C.bg, border: `1px solid ${C.border}` }}
                      >
                        "Identified significant alteration in pixel reflectance in sector 4
                        [coords 37.452°N, 126.621°E]. Probable new construction /
                        earthworks verified against co-registered Sentinel-1 SAR VV-
                        polarization backscatter intensity changes (±1 dB). Zero-vegetation
                        recovery observed."
                      </div>

                      {/* Readout strip */}
                      <div
                        className="flex flex-wrap gap-px rounded-lg overflow-hidden border mb-4"
                        style={{ borderColor: C.border }}
                      >
                        {[
                          { k: "AFFECTED AREA", v: "46,441 m²" },
                          { k: "SAR INTENSITY",  v: "-3.1 dB"   },
                          { k: "CLOUD",          v: "3.9% (3.06K)" },
                          { k: "CLASS",          v: "1.4KM BUILT" },
                        ].map(({ k, v }) => (
                          <div key={k} className="px-3.5 py-2.5 flex flex-col gap-0.5" style={{ background: C.bg }}>
                            <span className="text-[10px] uppercase tracking-wider font-mono font-bold" style={{ color: C.third }}>{k}</span>
                            <span className="text-[13px] font-mono font-bold" style={{ color: C.primary }}>{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {["Export GeoJSON", "Download Report (PDF)"].map((label) => (
                          <button
                            key={label}
                            className="flex items-center gap-1.5 text-[11px] font-mono border px-3 py-1.5 rounded-lg transition-colors"
                            style={{ borderColor: C.border, color: C.third }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = C.second;
                              (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.second}40`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = C.third;
                              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                            }}
                          >
                            <Download size={11} /> {label}
                          </button>
                        ))}
                        <button
                          className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg font-semibold ml-auto transition-all"
                          style={{ background: C.primary, color: "#0a0f1e" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                        >
                          <Eye size={11} /> Re-run Query
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border p-5"
                    style={{ background: `${C.panel}80`, borderColor: C.border }}
                  >
                    <div className="text-center py-14 flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-full border flex items-center justify-center"
                        style={{ borderColor: C.border, background: `${C.primary}08` }}
                      >
                        <Eye size={22} style={{ color: C.third }} />
                      </div>
                      <div className="text-[15px] font-medium" style={{ color: C.second }}>
                        Select an analysis to view its full results,
                      </div>
                      <div className="text-[15px] font-medium" style={{ color: C.second }}>
                        evidence, and execution trace.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
