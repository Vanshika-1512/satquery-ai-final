import { useState } from "react";
import { FlaskConical, Activity, BarChart3, Database } from "lucide-react";
import { Badge, SecondaryButton } from "../components/ui/primitives";
import { api } from "../services/api";

const C = {
  bg:      "#030712",
  panel:   "#08142c",
  border:  "rgba(56, 189, 248, 0.18)",
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  pos:     "#34d399",
  amber:   "#fbbf24",
};

const DATASETS = [
  { id: "vrsbench", label: "VRSBench",  desc: "Captioning, grounding, VQA evaluation",  icon: "🛰️" },
  { id: "rsvqa",    label: "RSVQA",     desc: "Single-image VQA",                        icon: "🌍" },
  { id: "cdvqa",    label: "CDVQA",     desc: "Multitemporal change VQA",                icon: "📡" },
  { id: "custom",   label: "Custom",    desc: "User-provided evaluation set",             icon: "🔬" },
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
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Page header */}
      <div
        className="border-b px-8 py-6"
        style={{ borderColor: C.border, background: `${C.panel}80` }}
      >
        <div
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: C.third }}
        >
          Benchmark Pipeline // SatQuery AI
        </div>
        <h1
          className="text-[28px] font-black pop-heading"
          style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}
        >
          Evaluation
        </h1>
        <p className="text-[13px] mt-1" style={{ color: C.third }}>
          Evaluate the pipeline against benchmark remote-sensing datasets.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        {/* Info panel */}
        <div
          className="p-4 rounded-xl border text-[12px] font-mono leading-relaxed"
          style={{ background: `${C.panel}80`, borderColor: C.border, color: C.third }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={13} style={{ color: C.primary }} />
            <span className="font-bold uppercase tracking-wider text-[11px]" style={{ color: C.primary }}>
              Benchmark Evaluation
            </span>
          </div>
          Results are clearly labeled as <span style={{ color: C.amber }}>SYNTHETIC RESULTS</span> (computed on
          labeled synthetic data via the live pipeline) unless real benchmark files are placed under{" "}
          <code className="data">data/benchmarks/&lt;name&gt;</code>. No fabricated scores are shown.
        </div>

        {/* Dataset cards */}
        <div className="grid grid-cols-2 gap-4">
          {DATASETS.map((ds) => (
            <div
              key={ds.id}
              className="rounded-2xl border p-5 backdrop-blur-sm transition-all hover:border-cyan-400/40"
              style={{ background: `${C.panel}90`, borderColor: C.border }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border text-lg"
                    style={{ borderColor: C.border, background: `${C.primary}10` }}
                  >
                    {ds.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[14px]" style={{ color: C.text }}>
                      {ds.label}
                    </div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: C.third }}>
                      {ds.desc}
                    </div>
                  </div>
                </div>
                <SecondaryButton
                  onClick={() => runBenchmark(ds.id)}
                  disabled={evalLoading === ds.id}
                >
                  <FlaskConical size={14} />
                  {evalLoading === ds.id ? "Running..." : "Run"}
                </SecondaryButton>
              </div>

              {/* Results */}
              {evalResults[ds.id] && (
                <div
                  className="pt-4 border-t space-y-3"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 size={13} style={{ color: C.primary }} />
                    <Badge tone={evalResults[ds.id].is_benchmark ? "teal" : "amber"}>
                      {evalResults[ds.id].is_benchmark ? "BENCHMARK RESULTS" : "SYNTHETIC RESULTS"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    {Object.entries(evalResults[ds.id].metrics || {}).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px]">
                        <span style={{ color: C.third }}>{k}</span>
                        <span className="data font-bold" style={{ color: C.primary }}>
                          {typeof v === "number" ? v.toFixed(3) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {evalResults[ds.id].notes && (
                    <p className="text-[11px] font-mono" style={{ color: C.third }}>
                      {evalResults[ds.id].notes}
                    </p>
                  )}
                </div>
              )}

              {/* Idle state */}
              {!evalResults[ds.id] && (
                <div
                  className="flex items-center gap-2 text-[11px] font-mono pt-3 border-t"
                  style={{ borderColor: C.border, color: C.third }}
                >
                  <Database size={12} />
                  No results yet — click Run to evaluate
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
