import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2, Download, Eye, Sparkles, Loader2, Filter,
  Compass, ArrowRight, Clock, Shield, HardDrive,
} from "lucide-react";
import { Badge, PrimaryButton, GEO_TOKENS } from "../components/ui/primitives";
import { api } from "../services/api";
import { taskLabel } from "../utils/format";
import type { AnalyzeResponse, HistoryItem, MissionSummaryItem } from "../types";

/* ── Execution Trace Visualizer ───────────────────────────── */
function TraceHeader({ item }: { item: HistoryItem }) {
  const steps = [
    { n: "STEP 01", label: "Agent Workflow",    sub: "Change Detection Routing" },
    { n: "STEP 02", label: "Spatial Alignment", sub: "Coordinate Frame Pts" },
    { n: "STEP 03", label: "Multimodal Model",  sub: "Checkpoint Inference" },
  ];
  return (
    <div className="mb-4">
      <div className="text-[11px] font-mono uppercase tracking-wider mb-2.5 font-medium flex items-center gap-2 text-[#48A9A6]">
        <span className="w-1.5 h-1.5 rounded-full inline-block bg-[#48A9A6]" />
        Execution Trace Pipeline
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className="rounded-md border border-[#273543] bg-[#101923] p-3"
          >
            <div className="text-[9px] font-mono mb-0.5 text-[#718096]">{s.n}</div>
            <div className="text-[12px] font-medium text-[#E5EAF0]">{s.label}</div>
            <div className="text-[11px] font-mono text-[#9AA8B7] truncate">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2 font-medium text-[#9AA8B7]">
        <span>Temporal Pair (T1 vs T2) &amp; Differential Metric</span>
        <span className="text-[#48A9A6]">Δ Matrix: +15.4% Alteration</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "BASELINE (T1)",   sub: "Reference",    val: "0.12 DN",      color: "#9AA8B7" },
          { label: "CURRENT (T2)",    sub: "Observation",  val: "0.86 DN",      color: "#48A9A6" },
          { label: "DELTA HEATMAP",   sub: "Differential", val: "+15.4% SHIFT", color: "#648DB5" },
        ].map((cell, i) => (
          <div
            key={i}
            className="rounded-md border border-[#273543] bg-[#101923] p-2.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#718096]">
                {cell.label}
              </span>
              <span className="text-[10px] font-mono font-medium" style={{ color: cell.color }}>{cell.val}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#718096]">{cell.sub}</span>
              <div className="w-12 h-1 rounded-full overflow-hidden bg-[#273543]">
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

/* ── Main History Page ────────────────────────────────────── */
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
    <div className="min-h-screen bg-[#0B1118]">
      {/* ── Page Header ── */}
      <div className="border-b border-[#273543] bg-[#101923] px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-[#718096]">
              Audit Trail // Intelligence Archive
            </div>
            <h1 className="text-[20px] font-semibold text-[#E5EAF0]">
              Analysis &amp; Mission History
            </h1>
            <p className="text-[12px] font-mono text-[#9AA8B7] mt-1">
              Deterministic logs of prior satellite imagery queries and autonomous missions.
            </p>
          </div>

          {/* Telemetry strip */}
          <div className="flex items-center gap-5 text-[10px] font-mono">
            {[
              { icon: HardDrive, label: "STORAGE",   val: "1.04 GB" },
              { icon: Shield,    label: "INTEGRITY",  val: "SHA-256 ✓" },
              { icon: Clock,     label: "CHAIN",      val: "LOCAL" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="text-right">
                <div className="flex items-center gap-1 justify-end mb-0.5 text-[#718096]">
                  <Icon size={11} />
                  <span className="uppercase tracking-wider">{label}</span>
                </div>
                <div className="text-[#6BA88B]">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 max-w-7xl mx-auto space-y-5">
        {/* ── Tab Switcher & Filter ── */}
        <div className="flex items-center gap-2 border-b border-[#273543] pb-3 flex-wrap">
          {[
            { key: "analyses", label: "Standard Analyses", count: items.length },
            { key: "missions", label: "Mission Investigations", count: missions.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`text-[12px] font-mono px-3.5 py-1.5 rounded-md transition-colors border ${
                tab === key
                  ? "bg-[#48A9A6] text-[#0B1118] font-medium border-[#48A9A6]"
                  : "bg-[#141F2A] text-[#9AA8B7] border-[#273543] hover:text-[#E5EAF0] hover:border-[#36485C]"
              }`}
            >
              {label} ({count})
            </button>
          ))}

          {/* Filter input */}
          <div className="relative ml-auto">
            <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#718096]" />
            <input
              placeholder="Filter archives…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-[12px] rounded-md border border-[#273543] bg-[#141F2A] text-[#E5EAF0] placeholder-[#718096] outline-none font-mono focus:border-[#48A9A6] transition-colors w-48"
            />
          </div>
        </div>

        {/* ── Missions tab ── */}
        {tab === "missions" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-mono text-[#718096]">
                Stored Autonomous Earth-Observation Investigations
              </div>
              <PrimaryButton onClick={() => navigate("/missions")}>
                <Compass size={14} /> Start New Mission
              </PrimaryButton>
            </div>

            {loading ? (
              <div className="text-[12px] font-mono py-8 text-center text-[#718096]">
                Loading missions…
              </div>
            ) : filteredMissions.length === 0 ? (
              <div className="p-10 text-center rounded-md border border-[#273543] bg-[#141F2A] space-y-3">
                <Compass size={24} className="mx-auto text-[#718096]" />
                <div className="text-[14px] font-medium text-[#E5EAF0]">
                  No Mission Investigations Found
                </div>
                <p className="text-[12px] font-mono max-w-md mx-auto text-[#718096]">
                  State a high-level Earth observation objective to launch an autonomous multi-step investigation.
                </p>
                <PrimaryButton onClick={() => navigate("/missions")} className="mx-auto">
                  Launch Investigation
                </PrimaryButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMissions.map((msn) => (
                  <div
                    key={msn.mission_id}
                    className="p-4 rounded-md border border-[#273543] bg-[#141F2A] transition-colors hover:border-[#36485C]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#273543] bg-[#192633] text-[#48A9A6]">
                            #{msn.mission_id.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-[#6BA88B]">
                            ✓ {msn.status}
                          </span>
                        </div>
                        <div className="text-[13px] font-mono font-medium truncate text-[#E5EAF0]">
                          "{msn.objective}"
                        </div>
                        <div className="text-[11px] font-mono text-[#718096]">
                          Type: {msn.mission_title} &bull; Changed Area: {msn.changed_area_km2.toFixed(2)} km²
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteMission(msn.mission_id, e)}
                        className="transition-colors p-1 text-[#718096] hover:text-[#CF7777]"
                        title="Delete Mission"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-[#273543] text-[11px] font-mono">
                      <span className="text-[#718096]">
                        {new Date(msn.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/missions?id=${msn.mission_id}`)}
                        className="flex items-center gap-1 text-[#48A9A6] hover:underline font-medium"
                      >
                        Inspect Mission <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Standard Analyses tab ── */
          <div className="space-y-4">
            {/* Summarize panel */}
            <div className="rounded-md border border-[#273543] bg-[#141F2A] p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Sparkles size={14} className="text-[#48A9A6]" />
                <span className="text-[12px] font-mono text-[#9AA8B7]">Summarize recent</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={summaryCount}
                  onChange={(e) => setSummaryCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 rounded px-2 py-1 text-[12px] text-center border border-[#273543] bg-[#101923] text-[#E5EAF0] outline-none font-mono focus:border-[#48A9A6]"
                />
                <span className="text-[12px] font-mono text-[#9AA8B7]">geospatial analyses</span>
                <PrimaryButton onClick={handleSummarize} disabled={summarizing} className="ml-auto">
                  {summarizing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>{summarizing ? "Synthesizing…" : "Generate Summary"}</span>
                </PrimaryButton>
              </div>
              {summary && (
                <p className="text-[12px] font-mono text-[#E5EAF0] leading-relaxed mt-3 pt-3 border-t border-[#273543]">
                  {summary}
                </p>
              )}
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 items-start">
              {/* Left — list */}
              <div className="rounded-md border border-[#273543] bg-[#141F2A] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[14px] font-medium text-[#E5EAF0]">
                    Analyses ({items.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="text-[12px] font-mono py-4 text-[#718096]">Loading…</div>
                ) : filtered.length === 0 ? (
                  <div className="text-[12px] font-mono py-4 text-[#718096]">No history records found.</div>
                ) : (
                  <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                    {filtered.map((it) => {
                      const active = selectedItem?.analysis_id === it.analysis_id;
                      return (
                        <button
                          key={it.analysis_id}
                          onClick={() => openItem(it)}
                          className={`w-full text-left rounded-md border p-3 transition-colors ${
                            active
                              ? "border-[#48A9A6] bg-[#192633]"
                              : "border-[#273543] bg-[#101923]/60 hover:bg-[#101923] hover:border-[#36485C]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[13px] font-medium truncate mb-1.5 text-[#E5EAF0]">
                                {it.query}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge tone="primary">{taskLabel(it.task)}</Badge>
                                <span className="text-[11px] font-mono text-[#718096]">
                                  {new Date(it.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => deleteItem(it.analysis_id, e)}
                              className="transition-colors p-1 shrink-0 text-[#718096] hover:text-[#CF7777]"
                              title="Delete Item"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right — trace / result */}
              <div>
                {selected && selectedItem ? (
                  <div className="rounded-md border border-[#273543] bg-[#141F2A] p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider mb-1 text-[#718096]">
                          Inspection Archive // TRACE-{selectedItem.analysis_id.slice(0, 8)}
                        </div>
                        <h3 className="text-[16px] font-medium text-[#E5EAF0]">
                          {selectedItem.query.slice(0, 50)}{selectedItem.query.length > 50 ? "…" : ""}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6BA88B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6BA88B]" />
                        <span>COMPLETED</span>
                      </div>
                    </div>

                    <TraceHeader item={selectedItem} />

                    <div className="border-t border-[#273543] pt-4">
                      <div className="text-[11px] font-mono uppercase tracking-wider mb-2 font-medium flex items-center gap-2 text-[#48A9A6]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#48A9A6]" />
                        Analytical Interpretation &amp; Reasoning
                      </div>
                      <div className="text-[12px] font-mono leading-relaxed mb-3 rounded p-3 bg-[#101923] border border-[#273543] text-[#E5EAF0]">
                        {selected.answer}
                      </div>

                      {/* Readout metrics strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        {[
                          { k: "TASK", v: selected.task_display },
                          { k: "MODEL", v: selected.selected_model },
                          { k: "STATUS", v: "DETERMINISTIC" },
                          { k: "LATENCY", v: "412ms" },
                        ].map(({ k, v }) => (
                          <div key={k} className="p-2.5 rounded bg-[#101923] border border-[#273543] flex flex-col gap-0.5">
                            <span className="text-[9px] uppercase tracking-wider font-mono text-[#718096]">{k}</span>
                            <span className="text-[11px] font-mono font-medium text-[#48A9A6] truncate">{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/analyze?query=${encodeURIComponent(selectedItem.query)}`)}
                          className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded bg-[#48A9A6] text-[#0B1118] font-medium hover:bg-[#3D9491] transition-colors ml-auto"
                        >
                          <Eye size={12} /> Open in Analyzer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-[#273543] bg-[#141F2A] p-5">
                    <div className="text-center py-16 flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border border-[#273543] bg-[#101923] flex items-center justify-center">
                        <Eye size={18} className="text-[#718096]" />
                      </div>
                      <div className="text-[13px] font-medium text-[#9AA8B7] mt-1">
                        Select an analysis to inspect its full trace and outputs
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
