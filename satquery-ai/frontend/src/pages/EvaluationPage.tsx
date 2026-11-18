import { useState } from "react";
import { FlaskConical, Activity, BarChart3, Database } from "lucide-react";
import { Badge, SecondaryButton } from "../components/ui/primitives";
import { api } from "../services/api";

const DATASETS = [
  { id: "vrsbench", label: "VRSBench",  desc: "Captioning, grounding, VQA benchmark set", icon: "🛰️" },
  { id: "rsvqa",    label: "RSVQA",     desc: "Single-image remote-sensing VQA",          icon: "🌍" },
  { id: "cdvqa",    label: "CDVQA",     desc: "Multitemporal change VQA suite",          icon: "📡" },
  { id: "custom",   label: "Custom",    desc: "User-supplied evaluation dataset",         icon: "🔬" },
];

export default function EvaluationPage() {
  const [evalResults, setEvalResults] = useState<Record<string, any>>({});
  const [evalLoading, setEvalLoading] = useState<string | null>(null);

  const runBenchmark = async (dataset: string) => {
    setEvalLoading(dataset);
    try {
      const res = await api.runEvaluation(dataset, 10);
      setEvalResults((prev) => ({ ...prev, [dataset]: res }));
    } finally {
      setEvalLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1118]">
      {/* ── Page Header ── */}
      <div className="border-b border-[#273543] bg-[#101923] px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-[#718096]">
            Benchmark Pipeline // SatQuery AI
          </div>
          <h1 className="text-[20px] font-semibold text-[#E5EAF0]">
            System Evaluation &amp; Benchmarks
          </h1>
          <p className="text-[12px] font-mono text-[#9AA8B7] mt-1">
            Empirical evaluation of specialist vision models across standardized remote-sensing datasets.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Info panel */}
        <div className="p-4 rounded-md border border-[#273543] bg-[#141F2A] text-[12px] font-mono leading-relaxed text-[#9AA8B7]">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-[#48A9A6]" />
            <span className="font-medium uppercase tracking-wider text-[11px] text-[#48A9A6]">
              Verification Rigor
            </span>
          </div>
          Results are explicitly designated as <span className="text-[#D3A35C]">SYNTHETIC RESULTS</span> (derived from labeled synthetic data via the live inference pipeline) unless real benchmark sets are staged in <code className="text-[#E5EAF0] bg-[#101923] px-1.5 py-0.5 rounded border border-[#273543]">data/benchmarks/&lt;name&gt;</code>. Fabricated scores are never generated.
        </div>

        {/* Dataset cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATASETS.map((ds) => (
            <div
              key={ds.id}
              className="rounded-md border border-[#273543] bg-[#141F2A] p-5 transition-colors hover:border-[#36485C]"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded flex items-center justify-center border border-[#273543] bg-[#101923] text-base">
                    {ds.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[14px] text-[#E5EAF0]">
                      {ds.label}
                    </div>
                    <div className="text-[11px] font-mono text-[#718096] mt-0.5">
                      {ds.desc}
                    </div>
                  </div>
                </div>
                <SecondaryButton
                  onClick={() => runBenchmark(ds.id)}
                  disabled={evalLoading === ds.id}
                >
                  <FlaskConical size={13} className="text-[#48A9A6]" />
                  <span>{evalLoading === ds.id ? "Running…" : "Run Benchmark"}</span>
                </SecondaryButton>
              </div>

              {/* Results */}
              {evalResults[ds.id] && (
                <div className="pt-4 border-t border-[#273543] space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={13} className="text-[#48A9A6]" />
                    <Badge tone={evalResults[ds.id].is_benchmark ? "teal" : "amber"}>
                      {evalResults[ds.id].is_benchmark ? "BENCHMARK RESULTS" : "SYNTHETIC RESULTS"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    {Object.entries(evalResults[ds.id].metrics || {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px] font-mono">
                        <span className="text-[#718096]">{k}</span>
                        <span className="text-[#48A9A6] font-medium tabular-nums">
                          {typeof v === "number" ? v.toFixed(3) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {evalResults[ds.id].notes && (
                    <p className="text-[11px] font-mono text-[#718096]">
                      {evalResults[ds.id].notes}
                    </p>
                  )}
                </div>
              )}

              {/* Idle state */}
              {!evalResults[ds.id] && (
                <div className="flex items-center gap-2 text-[11px] font-mono pt-3 border-t border-[#273543] text-[#718096]">
                  <Database size={12} />
                  <span>No results yet — click Run to evaluate</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
